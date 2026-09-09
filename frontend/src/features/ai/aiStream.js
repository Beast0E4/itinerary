/**
 * Consumes a Server-Sent Events stream from a POST endpoint.
 *
 * Native browser EventSource only supports GET requests and cannot send
 * custom headers, which rules it out here -- we need to send a JWT
 * Authorization header and a JSON request body. This hand-parses the
 * standard SSE wire format ("event: X\ndata: Y\n\n") from a streamed
 * fetch() response instead.
 *
 * @param {string} url - relative API path, e.g. `/trips/5/ai/plan/stream`
 * @param {object} payload - request body, JSON-serialized
 * @param {object} handlers
 * @param {(data: any) => void} handlers.onProgress - called per "progress" event, parsed JSON
 * @param {(data: any) => void} handlers.onComplete - called once on "complete", parsed JSON (AiTripPlanResponse shape)
 * @param {(message: string) => void} handlers.onError - called at most once, on "error" event or any transport failure
 * @param {AbortSignal} [signal] - pass an AbortController's signal to allow cancellation
 */
export async function streamSse(url, payload, { onProgress, onComplete, onError }, signal) {
  const token = localStorage.getItem('atlas_token');

  let response;
  try {
    response = await fetch(`/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') return; // cancelled deliberately, not an error
    onError('Could not reach the server. Check your connection and try again.');
    return;
  }

  if (!response.ok || !response.body) {
    onError(`Request failed (${response.status}). Please try again.`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line ("\n\n").
      let frameEnd;
      while ((frameEnd = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, frameEnd);
        buffer = buffer.slice(frameEnd + 2);
        dispatchFrame(frame, { onProgress, onComplete, onError });
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      onError('Connection lost while generating your plan. Please try again.');
    }
  }
}

function dispatchFrame(frame, { onProgress, onComplete, onError }) {
  let eventType = 'message';
  let dataLines = [];

  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  const raw = dataLines.join('\n');
  if (!raw) return;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return; // malformed frame; skip rather than crash the whole stream
  }

  if (eventType === 'progress') onProgress(parsed);
  else if (eventType === 'complete') onComplete(parsed);
  else if (eventType === 'error') onError(parsed.message || 'Something went wrong.');
}
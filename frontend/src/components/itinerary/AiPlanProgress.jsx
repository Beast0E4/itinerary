import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

/**
 * Renders the live "thinking" log while the AI agent streams progress
 * events. Every message gets a checkmark once superseded by the next
 * one; only the most recent (if still streaming) shows the spinner.
 */
export default function AiPlanProgress({ messages, streaming }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles className="w-4 h-4" strokeWidth={1.75} />
        <p className="text-sm font-medium">
          {streaming ? 'Planning your trip…' : 'Done thinking'}
        </p>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-text-faint italic">Getting started…</p>
        )}

        {messages.map((message, i) => {
          const isLast = i === messages.length - 1;
          const isActive = streaming && isLast;
          return (
            <div key={i} className="flex items-start gap-2.5 animate-rise-in">
              {isActive ? (
                <Loader2 className="w-4 h-4 text-accent animate-spin shrink-0 mt-0.5" strokeWidth={2} />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={2} />
              )}
              <span className={`text-sm ${isActive ? 'text-text' : 'text-text-muted'}`}>
                {message}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
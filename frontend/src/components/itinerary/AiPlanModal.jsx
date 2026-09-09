import React, { useRef, useState } from 'react';
import { Sparkles, Navigation, Loader2, MapPin, Calendar, X } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import TagInput from '../common/TagInput';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import AiPlanProgress from './AiPlanProgress';
import { useGeolocation } from '../../hooks/useGeolocation';
import { streamSse } from '../../features/ai/aiStream';
import { formatCurrency } from '../../utils/currencyHelpers';
import { formatDateShort } from '../../utils/dateHelpers';

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'INR', label: 'INR' },
  { value: 'JPY', label: 'JPY' },
];

/**
 * Three views in one modal:
 *   'form'     -> collect starting location, destinations, budget, preferences
 *   'progress' -> live SSE log while the agent thinks (AiPlanProgress)
 *   'preview'  -> the finished plan, with Apply / Discard
 *
 * Streaming state (progressLog, plan, planStatus) lives in Redux
 * (aiSlice) so it survives if the modal is briefly unmounted, but the
 * actual fetch + AbortController lives here since that's inherently a
 * component-lifecycle concern.
 */
export default function AiPlanModal({
  open,
  onClose,
  tripId,
  plan,
  planStatus,
  applyStatus,
  progressLog,
  error,
  onStreamStart,
  onProgress,
  onStreamComplete,
  onStreamError,
  onApplyPlan,
  onDiscard,
}) {
  const { coords, status: geoStatus, error: geoError, requestLocation } = useGeolocation();
  const [locationSource, setLocationSource] = useState(null); // 'coords' | 'text' | null
  const [form, setForm] = useState({
    startLocationText: '',
    destinations: [],
    budget: '',
    currency: 'USD',
    preferences: '',
  });
  const abortControllerRef = useRef(null);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleUseLocation = () => {
    requestLocation();
    setLocationSource('coords');
    setForm({ ...form, startLocationText: '' });
  };

  const handleTextChange = (e) => {
    setLocationSource(e.target.value ? 'text' : null);
    setForm({ ...form, startLocationText: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usingCoords = locationSource === 'coords' && coords;
    const payload = {
      startLatitude: usingCoords ? coords.latitude : null,
      startLongitude: usingCoords ? coords.longitude : null,
      startLocationText: usingCoords ? null : (form.startLocationText || null),
      destinations: form.destinations,
      budget: Number(form.budget),
      currency: form.currency,
      preferences: form.preferences || null,
    };

    onStreamStart();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    await streamSse(
      `/trips/${tripId}/ai/plan/stream`,
      payload,
      {
        onProgress: (data) => onProgress(data.message),
        onComplete: (data) => onStreamComplete(data),
        onError: (message) => onStreamError(message),
      },
      controller.signal
    );
  };

  const handleCancelStream = () => {
    abortControllerRef.current?.abort();
    onDiscard();
  };

  const handleClose = () => {
    abortControllerRef.current?.abort();
    onDiscard();
    onClose();
  };

  // Derive which of the three views to render from planStatus alone --
  // no separate local "view" state to keep in sync.
  const view =
    planStatus === 'loading' ? 'progress'
    : planStatus === 'succeeded' && plan ? 'preview'
    : 'form';

  const title = {
    form: 'Plan this trip with AI',
    progress: 'Planning your trip',
    preview: 'Proposed plan',
  }[view];

  return (
    <Modal open={open} onClose={handleClose} title={title} size={view === 'preview' ? 'xl' : 'md'}>
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Starting location</label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="secondary"
                className="!py-2 text-sm w-full"
                onClick={handleUseLocation}
                loading={geoStatus === 'loading'}
              >
                <Navigation className="w-3.5 h-3.5" strokeWidth={1.75} />
                Use my current location
              </Button>
            </div>
            {locationSource === 'coords' && coords && (
              <p className="text-xs text-accent flex items-center gap-1.5 mb-2">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                Using your location ({coords.latitude.toFixed(2)}, {coords.longitude.toFixed(2)})
              </p>
            )}
            {geoError && <p className="text-xs text-warn mb-2">{geoError}</p>}
            <Input
              placeholder="Or type your starting city"
              value={form.startLocationText}
              onChange={handleTextChange}
              disabled={locationSource === 'coords'}
            />
            {locationSource === 'coords' && (
              <p className="text-xs text-text-faint mt-1">
                Clear your captured location above to type a city instead.
              </p>
            )}
          </div>

          <TagInput
            label="Places you want to visit (optional)"
            placeholder="e.g. Manali — press Enter to add"
            hint="Add as many as you like, or leave empty to let the AI choose the destination(s) within your budget."
            values={form.destinations}
            onChange={(destinations) => setForm({ ...form, destinations })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget"
              type="number"
              min="0"
              step="1"
              required
              value={form.budget}
              onChange={update('budget')}
            />
            <Dropdown label="Currency" options={CURRENCIES} value={form.currency} onChange={update('currency')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Preferences (optional)</label>
            <textarea
              className="input-field min-h-[70px] resize-y"
              placeholder="e.g. relaxed pace, food-focused, avoid long hikes"
              value={form.preferences}
              onChange={update('preferences')}
            />
          </div>

          <Button type="submit" disabled={!locationSource} className="w-full">
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            Generate plan
          </Button>

          {!locationSource && (
            <p className="text-xs text-text-faint text-center">
              Use your current location or type a starting city to continue.
            </p>
          )}

          {planStatus === 'failed' && error && (
            <p className="text-sm text-danger bg-danger-subtle rounded-md px-4 py-3">{error}</p>
          )}
        </form>
      )}

      {view === 'progress' && (
        <div className="space-y-5">
          <AiPlanProgress messages={progressLog} streaming />
          <Button variant="secondary" className="w-full" onClick={handleCancelStream}>
            <X className="w-4 h-4" strokeWidth={1.75} />
            Cancel
          </Button>
        </div>
      )}

      {view === 'preview' && (
        <div className="space-y-5">
          {plan.summary && (
            <p className="text-sm text-text-muted bg-accent-subtle text-accent rounded-md px-4 py-3">
              {plan.summary}
            </p>
          )}

          {plan.destinations?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {plan.destinations.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-accent-subtle text-accent text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  <MapPin className="w-3 h-3" strokeWidth={2} />
                  {d.name}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {plan.days?.map((day) => (
              <div key={day.dayNumber} className="border-l-2 border-accent/40 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-text-faint" strokeWidth={1.75} />
                  <p className="font-medium text-sm">
                    Day {day.dayNumber}
                    {day.title && ` — ${day.title}`}
                  </p>
                  <span className="data-mono text-xs">{formatDateShort(day.date)}</span>
                </div>
                <ul className="space-y-1.5">
                  {day.items?.map((item, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-center justify-between">
                      <span>{item.title}</span>
                      {item.estimatedCost && (
                        <span className="data-mono text-xs text-warn">
                          {formatCurrency(item.estimatedCost, item.currency)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {plan.budgetSuggestion && (
            <div className="card p-4">
              <p className="data-mono text-xs mb-1">Suggested total budget</p>
              <p className="font-display text-2xl">
                {formatCurrency(plan.budgetSuggestion.totalBudget, form.currency)}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleClose}>
              Discard
            </Button>
            <Button className="flex-1" loading={applyStatus === 'loading'} onClick={onApplyPlan}>
              {applyStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              Apply to trip
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
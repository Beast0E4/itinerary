import React, { useState } from 'react';
import { Sparkles, Navigation, Loader2, MapPin, Calendar } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { useGeolocation } from '../../hooks/useGeolocation';
import { formatCurrency } from '../../utils/currencyHelpers';
import { formatDateShort } from '../../utils/dateHelpers';

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'INR', label: 'INR' },
  { value: 'JPY', label: 'JPY' },
];

export default function AiPlanModal({
  open,
  onClose,
  plan,
  planStatus,
  applyStatus,
  onRequestPlan,
  onApplyPlan,
  onDiscard,
}) {
  const { coords, status: geoStatus, error: geoError, requestLocation } = useGeolocation();
  const [form, setForm] = useState({
    startLocationText: '',
    budget: '',
    currency: 'USD',
    preferences: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestPlan({
      startLatitude: coords?.latitude ?? null,
      startLongitude: coords?.longitude ?? null,
      startLocationText: form.startLocationText || null,
      budget: Number(form.budget),
      currency: form.currency,
      preferences: form.preferences || null,
    });
  };

  const handleClose = () => {
    onDiscard();
    onClose();
  };

  const showPreview = plan && planStatus === 'succeeded';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={showPreview ? 'Proposed plan' : 'Plan this trip with AI'}
      size={showPreview ? 'xl' : 'md'}
    >
      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Starting location</label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="secondary"
                className="!py-2 text-sm w-full"
                onClick={requestLocation}
                loading={geoStatus === 'loading'}
              >
                <Navigation className="w-3.5 h-3.5" strokeWidth={1.75} />
                Use my current location
              </Button>
            </div>
            {coords && (
              <p className="text-xs text-accent flex items-center gap-1.5 mb-2">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                Location captured ({coords.latitude.toFixed(2)}, {coords.longitude.toFixed(2)})
              </p>
            )}
            {geoError && <p className="text-xs text-warn mb-2">{geoError}</p>}
            <Input
              placeholder="Or type your starting city"
              value={form.startLocationText}
              onChange={update('startLocationText')}
            />
          </div>

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

          <Button type="submit" loading={planStatus === 'loading'} className="w-full">
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            Generate plan
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          {plan.summary && (
            <p className="text-sm text-text-muted bg-accent-subtle text-accent rounded-md px-4 py-3">
              {plan.summary}
            </p>
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
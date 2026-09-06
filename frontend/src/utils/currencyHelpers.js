export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

export function formatCompactCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(0)}`;
  }
}
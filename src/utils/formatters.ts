import { CurrencyCode } from '../types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF ',
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  includeDecimals: boolean = false
): string {
  if (isNaN(amount) || !isFinite(amount)) return '$0';
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const absAmount = Math.abs(amount);
  
  const formattedNumber = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formattedNumber}`;
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  const pct = value * 100;
  const formatted = pct.toFixed(1);
  if (includeSign && pct > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDaysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export interface TipTotals {
  subtotal: number;
  tip: number;
  total: number;
  tipPercentage: number;
}

export const QUICK_TIP_PERCENTAGES = [15, 18, 20, 22];

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export function sanitizeMoneyInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return decimalParts.length > 0 ? `${whole}.${decimal}` : whole;
}

export function sanitizePercentInput(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  return decimalParts.length > 0 ? `${whole}.${decimal}` : whole;
}

export function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateTipTotals(billTotal: string, tipPercentage: string): TipTotals {
  const subtotal = parseAmount(billTotal);
  const percentage = parseAmount(tipPercentage);
  const tip = subtotal * (percentage / 100);

  return {
    subtotal,
    tip,
    total: subtotal + tip,
    tipPercentage: percentage
  };
}

export function formatPercentage(value: number): string {
  return value.toFixed(value % 1 ? 2 : 0);
}

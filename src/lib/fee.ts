// Single source of truth for the Revenue Leak Hunter contingency fee.
// The business model: RLH earns a 10% performance fee on attributable cash
// actually recovered. The client keeps 90% of recovered cash. No retainer,
// no setup fee, no fees on unrealized potential.
export const RLH_FEE_RATE = 0.1;
export const RLH_FEE_PERCENT = 10;

export function calculateFee(amount: number | string): number {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * RLH_FEE_RATE * 100) / 100;
}
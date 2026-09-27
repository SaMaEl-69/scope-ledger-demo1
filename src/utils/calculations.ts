import { CalculationResults, LaborRateLine, Project, ScopeChangeRequest } from '../types';

/**
 * Calculates the net incremental cost of the change request:
 * D = sum(Hours * Loaded Hourly Rate) + Outside Vendor Costs - Avoidable Removable Costs
 * Note: Never subtract sunk costs A from D.
 */
export function calculateIncrementalCost(
  laborLines: LaborRateLine[],
  outsideCosts: number = 0,
  avoidableCosts: number = 0
): number {
  const laborTotal = laborLines.reduce((sum, line) => {
    const hours = Math.max(0, Number(line.hours) || 0);
    const rate = Math.max(0, Number(line.loadedRate) || 0);
    return sum + hours * rate;
  }, 0);

  const outside = Math.max(0, Number(outsideCosts) || 0);
  const avoidable = Math.max(0, Number(avoidableCosts) || 0);

  // D cannot be less than 0
  return Math.max(0, laborTotal + outside - avoidable);
}

/**
 * Baseline margin: (F - C) / F
 */
export function calculateBaselineMargin(F: number, C: number): number {
  if (F <= 0) return 0;
  return (F - C) / F;
}

/**
 * Margin if absorbed internally: (F - C - D) / F
 */
export function calculateAbsorbedMargin(F: number, C: number, D: number): number {
  if (F <= 0) return 0;
  return (F - C - D) / F;
}

/**
 * Incremental Change Price Floor: D / (1 - g)
 * For D >= 0, 0 <= g < 1
 */
export function calculatePriceFloor(D: number, g: number): number {
  if (D <= 0) return 0;
  const clampedG = Math.min(0.99, Math.max(0, g));
  const denominator = 1 - clampedG;
  if (denominator <= 0) return D;
  return D / denominator;
}

/**
 * Whole-Project Restorative Fee: max(0, (C + D) / (1 - g) - F)
 * Restores the entire project to margin g if previously underpriced.
 */
export function calculateRestorativeFee(C: number, D: number, g: number, F: number): number {
  const clampedG = Math.min(0.99, Math.max(0, g));
  const denominator = 1 - clampedG;
  if (denominator <= 0) return Math.max(0, (C + D) - F);
  
  const targetRevenue = (C + D) / denominator;
  const fee = targetRevenue - F;
  return Math.max(0, fee);
}

/**
 * Resulting Margin at Quoted Fee P:
 * (F + P - C - D) / (F + P)
 */
export function calculateNewMargin(F: number, P: number, C: number, D: number): number {
  const totalRevenue = F + P;
  if (totalRevenue <= 0) return 0;
  const totalCost = C + D;
  return (totalRevenue - totalCost) / totalRevenue;
}

/**
 * Comprehensive financial summary calculation for a project & scope change.
 */
export function calculateFinancialMetrics(
  project: Project,
  changeRequest?: ScopeChangeRequest
): CalculationResults {
  const F = Math.max(0, Number(project.approvedFee) || 0);
  const A = Math.max(0, Number(project.incurredCosts) || 0);
  const R = Math.max(0, Number(project.remainingCosts) || 0);
  const C = A + R;
  
  // Target contribution margin g (e.g. 0.35)
  const g = Math.min(0.95, Math.max(0.01, Number(project.targetMargin) || 0.35));

  let D = 0;
  let P = 0;

  if (changeRequest) {
    D = calculateIncrementalCost(
      changeRequest.laborLines || [],
      changeRequest.outsideVendorCosts,
      changeRequest.avoidableRemovableCosts
    );

    // Depending on offer type, quoted fee P is determined
    if (changeRequest.offerType === 'quote') {
      P = Math.max(0, Number(changeRequest.quotedFee) || 0);
    } else if (changeRequest.offerType === 'absorb') {
      P = 0;
    } else if (changeRequest.offerType === 'exchange') {
      P = 0;
    } else if (changeRequest.offerType === 'defer') {
      P = 0;
    }
  }

  const currentBaselineMargin = calculateBaselineMargin(F, C);
  const absorbedMargin = calculateAbsorbedMargin(F, C, D);
  const priceFloor = calculatePriceFloor(D, g);
  const restorativeFee = calculateRestorativeFee(C, D, g, F);
  const newMargin = calculateNewMargin(F, P, C, D);

  const baselineGrossProfit = F - C;
  const absorbedGrossProfit = F - C - D;
  const newGrossProfit = (F + P) - (C + D);
  const incrementalProfitOnFee = P - D;
  const incrementalMarginOnFee = P > 0 ? (P - D) / P : 0;
  const marginErosionPct = currentBaselineMargin - absorbedMargin;
  const marginErosionAmount = D;

  return {
    F,
    A,
    R,
    C,
    D,
    g,
    P,
    currentBaselineMargin,
    absorbedMargin,
    priceFloor,
    restorativeFee,
    newMargin,
    baselineGrossProfit,
    absorbedGrossProfit,
    newGrossProfit,
    incrementalProfitOnFee,
    incrementalMarginOnFee,
    marginErosionPct,
    marginErosionAmount,
  };
}

/**
 * Returns a health category for a margin value:
 * 'healthy' (>= g), 'warning' (0 to g), 'critical' (< 0)
 */
export function getMarginHealth(
  margin: number,
  targetMargin: number
): { status: 'healthy' | 'warning' | 'critical'; label: string; color: string; badgeBg: string; badgeBorder: string; badgeText: string } {
  if (margin >= targetMargin) {
    return {
      status: 'healthy',
      label: 'Target Met',
      color: '#10b981', // emerald-500
      badgeBg: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/30',
      badgeText: 'text-emerald-400',
    };
  }
  if (margin >= 0.15) {
    return {
      status: 'warning',
      label: 'Below Target',
      color: '#f59e0b', // amber-500
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-500/30',
      badgeText: 'text-amber-400',
    };
  }
  return {
    status: 'critical',
    label: 'Margin Erosion Danger',
    color: '#ef4444', // red-500
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
  };
}

export type RouteType = 'included' | 'defect' | 'ambiguous' | 'addition';

export type OfferType = 'quote' | 'absorb' | 'exchange' | 'defer';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface LaborRateLine {
  id: string;
  role: string;
  hours: number;
  loadedRate: number;
}

export interface ScopeChangeRequest {
  id: string;
  referenceId: string; // e.g. "SCB-2026-004"
  title: string;
  clientDescription: string;
  requestDate: string;
  targetCompletionDate: string;
  
  // R - Route
  route: RouteType;
  routeRationale: string;
  ambiguityQuestions?: string[];
  defectRootCause?: string;
  
  // A - Assess (Private Vault)
  laborLines: LaborRateLine[];
  outsideVendorCosts: number;
  outsideVendorDescription: string;
  avoidableRemovableCosts: number;
  avoidableScopeDescription: string;
  scheduleImpactDays: number;
  scheduleNotes: string;
  
  // C - Choose an Offer
  offerType: OfferType;
  quotedFee: number; // P
  absorbRationale?: string;
  exchangeScopeOffered?: string;
  deferralTiming?: string;
  deferralRationale?: string;
  
  // E - Evidence
  deliveryConditions: string[];
  clientSignerName?: string;
  clientSignerTitle?: string;
  signedDate?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'deferred';
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  referenceCode: string;
  isSample?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Baseline Financials
  approvedFee: number; // F
  incurredCosts: number; // A
  remainingCosts: number; // R
  targetMargin: number; // g (e.g. 0.35)
  
  // Active scope change requests
  activeChangeId: string;
  changeRequests: ScopeChangeRequest[];
}

export interface PlaybookScenario {
  id: string;
  number: number;
  title: string;
  category: 'CMS & Content' | 'Design & Revisions' | 'Integrations & Code' | 'Timeline & Assets' | 'Scope Management' | 'Triage & Defect';
  summary: string;
  recommendedRoute: RouteType;
  recommendedOffer: OfferType;
  defaultHours: {
    design: number;
    dev: number;
    pm: number;
  };
  defaultOutsideCost: number;
  defaultScheduleDays: number;
  clientDescription: string;
  conditions: string[];
  agencyAdvice: string;
}

export interface WorkspaceSettings {
  agencyName: string;
  agencyWebsite: string;
  agencyEmail: string;
  studioLogoUrl: string; // base64 or SVG
  currency: CurrencyCode;
  currencySymbol: string;
  defaultTargetMargin: number; // e.g. 0.35
  defaultDesignRate: number; // $/hr
  defaultDevRate: number; // $/hr
  defaultPmRate: number; // $/hr
  termsAndConditions: string;
}

export interface LicenseState {
  isLicensed: boolean;
  tier: 'free' | 'individual' | 'agency';
  licenseKey: string;
  activatedAt?: string;
  registeredDevices: number;
  maxDevices: number;
  currentDeviceName: string;
}

export interface CalculationResults {
  F: number; // approved fee
  A: number; // actual incurred costs
  R: number; // remaining baseline costs
  C: number; // total committed cost = A + R
  D: number; // net incremental cost of change
  g: number; // target margin
  P: number; // quoted fee
  
  currentBaselineMargin: number; // (F - C) / F
  absorbedMargin: number; // (F - C - D) / F
  priceFloor: number; // D / (1 - g)
  restorativeFee: number; // max(0, (C + D) / (1 - g) - F)
  newMargin: number; // (F + P - C - D) / (F + P)
  
  // Extra agency profit metrics
  baselineGrossProfit: number; // F - C
  absorbedGrossProfit: number; // F - C - D
  newGrossProfit: number; // (F + P) - (C + D)
  incrementalProfitOnFee: number; // P - D
  incrementalMarginOnFee: number; // (P - D) / P
  marginErosionPct: number; // currentBaselineMargin - absorbedMargin
  marginErosionAmount: number; // D
}

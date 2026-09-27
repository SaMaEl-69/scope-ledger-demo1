import { Project, WorkspaceSettings, LicenseState } from '../types';

export const INITIAL_WORKSPACE_SETTINGS: WorkspaceSettings = {
  agencyName: 'Atelier North Studio',
  agencyWebsite: 'www.ateliernorth.studio',
  agencyEmail: 'delivery@ateliernorth.studio',
  studioLogoUrl: '', // Will use default elegant monogram
  currency: 'USD',
  currencySymbol: '$',
  defaultTargetMargin: 0.38,
  defaultDesignRate: 85,
  defaultDevRate: 95,
  defaultPmRate: 75,
  termsAndConditions: 'All scope adjustments are subject to studio availability and require formal digital or written counter-authorization prior to engineering scheduling. Invoices for approved scope changes are due upon issuance.',
};

export const INITIAL_LICENSE_STATE: LicenseState = {
  isLicensed: false,
  tier: 'free',
  licenseKey: '',
  registeredDevices: 1,
  maxDevices: 1,
  currentDeviceName: 'Studio Workstation (Demo)',
};

export const SAMPLE_PROJECT: Project = {
  id: 'proj-harbor-001',
  name: 'Harbor / Brand & Experience Website',
  clientName: 'Harbor Hospitality Group',
  clientEmail: 'elena@harborhospitality.co',
  referenceCode: 'HBR-WEB-2026',
  isSample: true,
  createdAt: '2026-09-12T10:00:00Z',
  updatedAt: '2026-09-27T14:30:00Z',
  approvedFee: 14500, // F
  incurredCosts: 5200, // A
  remainingCosts: 3400, // R
  targetMargin: 0.38, // g = 38%
  activeChangeId: 'scb-harbor-01',
  changeRequests: [
    {
      id: 'scb-harbor-01',
      referenceId: 'SCB-2026-004',
      title: 'Interactive Room Booking Calendar & Multi-Room CMS Filter',
      clientDescription: 'Addition of an interactive date-picker booking modal and custom multi-room category filter on the accommodations index page, integrating with Harbor’s Cloudbeds reservation engine API.',
      requestDate: '2026-09-24',
      targetCompletionDate: '2026-10-09',
      
      // R - Route
      route: 'addition',
      routeRationale: 'New functional component requested after Milestone 2 sitemap and user flow sign-off. Out-of-scope addition qualifying for commercial authorization.',
      
      // A - Assess
      laborLines: [
        { id: 'l-1', role: 'UI/UX Design', hours: 4, loadedRate: 85 },
        { id: 'l-2', role: 'Webflow & Custom JS Dev', hours: 8, loadedRate: 95 },
        { id: 'l-3', role: 'Delivery Lead / QA', hours: 2, loadedRate: 75 },
      ],
      outsideVendorCosts: 130, // Calendar plugin license
      outsideVendorDescription: 'Custom JS date-picker library commercial license & webhook endpoint proxy',
      avoidableRemovableCosts: 0,
      avoidableScopeDescription: '',
      scheduleImpactDays: 3,
      scheduleNotes: 'Adds 3 working days to final staging delivery; pushes final review from Oct 6 to Oct 9.',
      
      // C - Choose an Offer
      offerType: 'quote',
      quotedFee: 2225, // Covers at ~38% margin
      absorbRationale: '',
      exchangeScopeOffered: '',
      deferralTiming: 'Post-Launch Phase 2',
      deferralRationale: '',
      
      // E - Evidence
      deliveryConditions: [
        'Harbor provides sandbox Cloudbeds API credentials and webhook test payload within 48 hours.',
        'Includes responsive layout tuning across Desktop (1440px), Tablet (768px), and Mobile (390px).',
        'Payment terms: Invoiced upon scope authorization, payable net-7 prior to staging deployment.',
      ],
      clientSignerName: 'Elena Rostova',
      clientSignerTitle: 'VP of Brand & Digital Experience',
      signedDate: '',
      status: 'pending_approval',
    },
    {
      id: 'scb-harbor-02',
      referenceId: 'SCB-2026-005',
      title: 'Safari Touch Glitch on Accommodations Carousel',
      clientDescription: 'Remediation of swipe hitch on mobile iOS Safari when toggling suite gallery previews.',
      requestDate: '2026-09-22',
      targetCompletionDate: '2026-09-23',
      route: 'defect',
      routeRationale: 'Studio QA execution defect identified during staging preview. Zero charge to client.',
      defectRootCause: 'CSS touch-action overflow collision with Webflow slider swipe gesture handler.',
      laborLines: [
        { id: 'l-4', role: 'Webflow & Custom JS Dev', hours: 2, loadedRate: 95 },
      ],
      outsideVendorCosts: 0,
      outsideVendorDescription: '',
      avoidableRemovableCosts: 0,
      avoidableScopeDescription: '',
      scheduleImpactDays: 0,
      scheduleNotes: 'Hotfix deployed to staging within 24 hours. Zero milestone slippage.',
      offerType: 'absorb',
      quotedFee: 0,
      absorbRationale: 'Covered under Studio QA Warranty. Resolving internally at no charge to client.',
      deliveryConditions: [
        'Internal warranty remediation.',
        'Verified across iPhone 14/15 Safari and Chrome.',
      ],
      status: 'approved',
    }
  ],
};

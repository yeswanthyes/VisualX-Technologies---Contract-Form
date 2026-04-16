// Default values for the entire contract form
export const defaultValues = {
  // ─── Step 1: Parties ──────────────────────────────────────
  company: {
    name: 'VisualX Technologies',
    address: '',
    city: '',
    state: '',
    pin: '',
    gstin: '',
    email: '',
    phone: '',
    representative: '',
    designation: '',
  },
  client: {
    name: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    gstin: '',
    email: '',
    phone: '',
    representative: '',
    designation: '',
  },

  // ─── Step 2: Scope ────────────────────────────────────────
  scope: {
    websiteDev: true,
    webAppDev: true,
    desktopAppDev: true,
    uiuxDesign: true,
    quotationModule: true,
    paymentModule: true,
    customScope: '',
  },

  // ─── Step 3: Tech Stack ───────────────────────────────────
  techStack: [
    { id: 'frontend', layer: 'Frontend', tech: 'React.js, HTML5, CSS3, Tailwind CSS', enabled: true },
    { id: 'desktop', layer: 'Desktop Application Framework', tech: 'Electron.js', enabled: true },
    { id: 'backend', layer: 'Backend', tech: 'Node.js, Express.js', enabled: true },
    { id: 'database', layer: 'Database', tech: 'Local Database (SQLite / LowDB / IndexedDB)', enabled: true },
    { id: 'payment', layer: 'Payment Integration', tech: 'Razorpay', enabled: true },
    { id: 'tools', layer: 'Other Tools & Services', tech: 'RESTful APIs, Git Version Control, Deployment Platforms', enabled: true },
  ],

  // ─── Step 4: Payment ─────────────────────────────────────
  payment: {
    totalAmount: '',
    totalAmountWords: '',
    paymentSplit: [
      { milestone: 'Advance Payment (upon signing)', percent: 50, dueOn: 'Upon execution of this Agreement' },
      { milestone: 'Mid-Project Milestone', percent: 25, dueOn: '' },
      { milestone: 'Final Payment (upon delivery)', percent: 25, dueOn: 'Upon final delivery and acceptance' },
    ],
    methods: {
      bankTransfer: true,
      upi: true,
      razorpayLink: true,
      cheque: true,
      cash: false,
    },
    lateFeePercent: 2,
    lateFeeWeeks: 1,
    ovdueSuspendDays: 15,
    overdueTerminateDays: 30,
    taxNote: true,
  },

  // ─── Step 5: Timeline ─────────────────────────────────────
  timeline: {
    startDate: '',
    phases: [
      { name: 'Discovery & Planning', days: 7 },
      { name: 'Design Phase', days: 10 },
      { name: 'Development Phase', days: 30 },
      { name: 'Testing & QA', days: 7 },
      { name: 'Deployment & Handover', days: 3 },
    ],
    clientDelayClause: true,
    revisionDelayClause: true,
    thirdPartyDelayClause: true,
    forceMajeureDelayClause: true,
  },

  // ─── Step 6: Revisions ────────────────────────────────────
  revisions: {
    freeRounds: 2,
    additionalRate: '',
    changeRequestProcess: true,
  },

  // ─── Step 7: Client Responsibilities ──────────────────────
  clientResp: {
    contentDeliveryDays: 5,
    feedbackDays: 3,
    singlePOC: true,
    paymentGatewayAccounts: true,
    legalCompliance: true,
  },

  // ─── Step 8: Legal ────────────────────────────────────────
  legal: {
    confidentialityYears: 2,
    ipTransferOnPayment: true,
    portfolioRights: true,
    liabilityCap: true,
    refundTiers: [
      { stage: 'Before project commencement', refund: '80% of advance payment (20% retained as administrative & opportunity cost)' },
      { stage: 'During Discovery & Planning phase', refund: '50% of advance payment' },
      { stage: 'During Design phase', refund: '25% of advance payment' },
      { stage: 'During or after Development phase', refund: 'No refund; Client pays for work completed' },
    ],
    warrantyDays: 30,
  },

  // ─── Step 9: Support ──────────────────────────────────────
  support: {
    freeSupportDays: 30,
    supportEmail: '',
    supportPhone: '',
    supportHours: '10:00 AM – 6:00 PM IST, Monday to Saturday',
    sla: [
      { priority: 'Critical', description: 'System down, data loss, security breach', responseTime: '4 hours' },
      { priority: 'High', description: 'Major feature not working', responseTime: '12 hours' },
      { priority: 'Medium', description: 'Minor functionality issue', responseTime: '24 hours' },
      { priority: 'Low', description: 'Cosmetic issues, general queries', responseTime: '48 hours' },
    ],
  },

  // ─── Step 10: Dispute & Force Majeure ─────────────────────
  dispute: {
    jurisdiction: 'Tamil Nadu, India',
    negotiationDays: 15,
    mediationDays: 30,
    arbitrationEnabled: true,
    forceMajeureDays: 60,
    forceMajeureNoticehours: 48,
  },

  // ─── Step 11: Optional Clauses ────────────────────────────
  optional: {
    ndaEnabled: false,
    ndaYears: 3,
    amcEnabled: false,
    amcPlans: [
      { name: 'Basic', annualFee: '', billing: 'Annual' },
      { name: 'Standard', annualFee: '', billing: 'Annual' },
      { name: 'Premium', annualFee: '', billing: 'Annual' },
    ],
  },

  // ─── Step 12: Signatures ──────────────────────────────────
  signatures: {
    company: { name: '', designation: '', date: '', place: '' },
    client: { name: '', designation: '', date: '', place: '' },
  },

  // ─── Meta ─────────────────────────────────────────────────
  meta: {
    agreementNo: '',
    executionDate: '',
  },
};

import { CampaignSimulation } from '../types';

export interface GrowthKPIs {
  revenue: string;
  revenueRaw: number;
  conversionRate: string;
  avgOrderValue: string;
  aiAssistedRevenue: string;
  repeatCustomers: string;
  intentSessionsCount: number;
  activeAgentsCount: number;
}

export const GROWTH_KPIS: GrowthKPIs = {
  revenue: '₹24.8L',
  revenueRaw: 2480000,
  conversionRate: '8.7%',
  avgOrderValue: '₹4,820',
  aiAssistedRevenue: '₹6.4L',
  repeatCustomers: '32%',
  intentSessionsCount: 42180,
  activeAgentsCount: 10
};

export const REVENUE_TIMELINE = [
  { month: 'Jan', organic: 12.4, aiAssisted: 2.1 },
  { month: 'Feb', organic: 14.2, aiAssisted: 3.4 },
  { month: 'Mar', organic: 15.8, aiAssisted: 4.2 },
  { month: 'Apr', organic: 16.5, aiAssisted: 4.9 },
  { month: 'May', organic: 17.2, aiAssisted: 5.6 },
  { month: 'Jun', organic: 18.4, aiAssisted: 6.4 }
];

export interface GrowthOpportunity {
  id: string;
  title: string;
  description: string;
  estimatedOpportunity: string;
  aiRecommendation: string;
  expectedImpact: string;
  category: 'recovery' | 'loyalty' | 'cross_sell' | 'pricing';
  campaignDraft: CampaignSimulation;
}

export const GROWTH_OPPORTUNITIES: GrowthOpportunity[] = [
  {
    id: 'opp-1',
    title: '2,841 customers viewed laptops but didn\'t purchase',
    description: 'High-intent shoppers who compared specs or added items to cart in the last 7 days without finishing checkout.',
    estimatedOpportunity: '₹18.4L',
    aiRecommendation: 'Create a personalized recovery campaign with dynamic bank discount reminder.',
    expectedImpact: '+18% conversion lift',
    category: 'recovery',
    campaignDraft: {
      id: 'camp-rec-01',
      name: 'High-Intent Laptop Recovery Sprint',
      goal: 'Recover abandoned high-intent laptop cart sessions',
      audience: '2,841 high-intent shoppers (Price range ₹50k-₹90k)',
      targetCount: 2841,
      channel: 'WhatsApp + Email',
      offerType: 'Dynamic HDFC/SBI Bank ₹3,000 Card Discount Alert',
      durationDays: 7,
      budget: 50000,
      estimatedRoi: 5.8,
      expectedConversionLift: 18.4,
      status: 'simulated',
      createdDate: 'Today'
    }
  },
  {
    id: 'opp-2',
    title: 'Returning customers convert 3.2x better with personalized offers',
    description: 'Loyal customer segment entering hardware refresh cycle after 18-24 months of previous laptop purchase.',
    estimatedOpportunity: '₹7.2L',
    aiRecommendation: 'Deploy an automated trade-in exchange bonus campaign tailored to previous model.',
    expectedImpact: '+24% repeat purchase rate',
    category: 'loyalty',
    campaignDraft: {
      id: 'camp-loy-02',
      name: 'Smart Hardware Upgrade Concierge',
      goal: 'Accelerate laptop trade-in lifecycle for past buyers',
      audience: '1,420 verified past electronics purchasers',
      targetCount: 1420,
      channel: 'WhatsApp',
      offerType: 'Extra ₹3,000 Exchange Bonus + Free Data Migration',
      durationDays: 14,
      budget: 35000,
      estimatedRoi: 6.4,
      expectedConversionLift: 24.2,
      status: 'draft',
      createdDate: 'Yesterday'
    }
  },
  {
    id: 'opp-3',
    title: 'Surging student searches for AI & Python laptops under ₹70K',
    description: '42% surge in natural language searches containing "Jupyter", "VS Code", and "Machine Learning".',
    estimatedOpportunity: '₹12.5L',
    aiRecommendation: 'Bundle free 16GB RAM upgrade consultation and student ID cashback.',
    expectedImpact: '+15% average order value',
    category: 'cross_sell',
    campaignDraft: {
      id: 'camp-stud-03',
      name: 'Back to Campus: AI & Data Science Starter Pack',
      goal: 'Capture college student developer laptop demand',
      audience: '3,900 college & self-taught developers',
      targetCount: 3900,
      channel: 'WhatsApp + Email',
      offerType: 'Student ID Instant ₹2,000 Off + 1-Yr Extended Warranty',
      durationDays: 10,
      budget: 45000,
      estimatedRoi: 5.2,
      expectedConversionLift: 15.6,
      status: 'draft',
      createdDate: '3 days ago'
    }
  }
];

export interface CustomerJourneyStep {
  step: number;
  name: string;
  description: string;
  agentRole: string;
  agentName: string;
  aiAction: string;
  conversionMetric: string;
}

export const CUSTOMER_JOURNEY_STEPS: CustomerJourneyStep[] = [
  {
    step: 1,
    name: 'Discover',
    description: 'Customer visits platform with an open-ended goal (e.g., "Need laptop for college & ML").',
    agentRole: 'Intent Understanding',
    agentName: 'Intent Agent',
    aiAction: 'Transforms vague prompt into concrete hardware constraints (16GB RAM, High IPC CPU, ₹70k budget).',
    conversionMetric: '96% intent clarity'
  },
  {
    step: 2,
    name: 'Search',
    description: 'Autonomous catalog scan across 8 top manufacturers and 5 marketplace feeds.',
    agentRole: 'Catalog Deduplication',
    agentName: 'Product Discovery Agent',
    aiAction: 'Filters 64 catalog SKUs down to 18 high-confidence candidate laptops.',
    conversionMetric: '0 duplicate listings'
  },
  {
    step: 3,
    name: 'Compare',
    description: 'Customer evaluates shortlisted laptops side-by-side.',
    agentRole: 'Multivariate Analysis',
    agentName: 'Ranking Agent',
    aiAction: 'Highlights winning metrics and generates transparent decision rationale for each model.',
    conversionMetric: '3.4x faster decision time'
  },
  {
    step: 4,
    name: 'Product View',
    description: 'Deep dive into specifications, thermal reports, and verified review sentiment.',
    agentRole: 'Review Mining',
    agentName: 'Review Agent',
    aiAction: 'Synthesizes 1,850+ reviews into clear pros, cons, and developer verdict.',
    conversionMetric: '88% customer confidence'
  },
  {
    step: 5,
    name: 'Price Check',
    description: 'Live cross-store price comparison across Amazon, Flipkart, Croma, Reliance & OEM.',
    agentRole: 'Arbitrage Scanner',
    agentName: 'Price Intelligence Agent',
    aiAction: 'Identifies ₹3,200 lower listed price on Amazon and confirms 30-day historical low status.',
    conversionMetric: '100% price transparency'
  },
  {
    step: 6,
    name: 'Add to Cart',
    description: 'Customer selects optimal laptop configuration.',
    agentRole: 'Offer Optimization',
    agentName: 'Offer & Savings Agent',
    aiAction: 'Automatically calculates ₹3,000 HDFC bank discount and applies ₹1,000 instant coupon.',
    conversionMetric: '₹4,000 upfront savings'
  },
  {
    step: 7,
    name: 'Checkout',
    description: 'Agentic 1-click checkout with pre-verified card eligibility.',
    agentRole: 'Frictionless Routing',
    agentName: 'Checkout Agent',
    aiAction: 'Pre-selects lowest effective price payment method (HDFC Credit Card) with 0 error rate.',
    conversionMetric: '92% checkout completion'
  },
  {
    step: 8,
    name: 'Payment',
    description: 'Secure instant transaction confirmation.',
    agentRole: 'Payment Verification',
    agentName: 'Checkout Agent',
    aiAction: 'Dispatches instant order token and confirms stock reservation with merchant.',
    conversionMetric: '0 payment drops'
  },
  {
    step: 9,
    name: 'Purchase',
    description: 'Transaction feeds real-time telemetry to merchant growth engine.',
    agentRole: 'Commerce Signal',
    agentName: 'Growth Agent',
    aiAction: 'Logs intent-to-purchase path and updates cohort demand curves for Python developer demographic.',
    conversionMetric: 'Real-time telemetry'
  },
  {
    step: 10,
    name: 'Retention',
    description: 'Post-delivery warranty registration and personalized upgrade lifecycle.',
    agentRole: 'Post-Purchase Care',
    agentName: 'Retention Agent',
    aiAction: 'Schedules 30-day thermal performance check-in and 24-month trade-in valuation.',
    conversionMetric: '32% repeat engagement'
  }
];

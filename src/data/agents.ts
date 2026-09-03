import { CommerceAgent, LiveAgentEvent } from '../types';

export const COMMERCE_AGENTS: CommerceAgent[] = [
  {
    id: 'intent-agent',
    name: 'Intent Agent',
    status: 'active',
    role: 'Natural Language Understanding & Requirement Extraction',
    purpose: 'Parses customer prompts and voice queries to extract budget constraints, target applications, hardware priorities, and implicit preferences.',
    inputs: ['Voice transcript', 'Natural text search', 'User questionnaire', 'Context memory'],
    tools: ['NLP Semantic Classifier', 'Hardware Ontology Map', 'Constraint Parser'],
    recentAction: 'Extracted intent: "AI & Data Science, Budget ₹70,000, 16GB RAM"',
    lastResult: 'Mapped 4 mandatory constraints & 2 soft preferences',
    successRate: 99.8,
    latencyMs: 140,
    iconName: 'Compass'
  },
  {
    id: 'product-agent',
    name: 'Product Discovery Agent',
    status: 'active',
    role: 'Multi-Store Catalog Search & Spec Normalization',
    purpose: 'Queries multi-store catalogs, removes duplicate listings, normalizes raw CPU/GPU nomenclatures, and filters matching candidates.',
    inputs: ['Parsed intent constraints', 'Catalog database', 'Inventory feeds'],
    tools: ['Vector Similarity Matcher', 'Spec Deduplicator', 'Fuzzy SKU Resolver'],
    recentAction: 'Indexed 64 candidate models and retrieved 18 exact constraint matches',
    lastResult: 'Deduplicated 42 cross-merchant variants',
    successRate: 99.4,
    latencyMs: 220,
    iconName: 'Search'
  },
  {
    id: 'review-agent',
    name: 'Review Agent',
    status: 'active',
    role: 'Sentiment Mining & Real-World Reliability Analysis',
    purpose: 'Aggregates thousands of verified buyer reviews across platforms, filtering out sponsored noise to extract genuine pros, cons, thermal feedback, and reliability patterns.',
    inputs: ['18,400+ verified buyer reviews', 'Video teardown transcripts', 'Support forums'],
    tools: ['Sentiment Aspect Extractor', 'Review Authenticity Scorer', 'Thermal Heatmap Analyzer'],
    recentAction: 'Analyzed 1,850 verified reviews for HP 15 (13th Gen i5)',
    lastResult: '88% positive sentiment; Flagged 250-nit display brightness outdoor limitation',
    successRate: 98.9,
    latencyMs: 310,
    iconName: 'MessageSquareText'
  },
  {
    id: 'price-agent',
    name: 'Price Intelligence Agent',
    status: 'active',
    role: 'Cross-Marketplace Price Tracking & Trend Forecasting',
    purpose: 'Scans Amazon, Flipkart, Croma, Reliance Digital, and Brand Stores in real time to locate lowest listed pricing, price drops, and historical anomalies.',
    inputs: ['5 Marketplace REST/Scrape endpoints', '30-day Historical Price Tables'],
    tools: ['Price Arbitrage Scanner', 'Historical Lowest Detector', 'Stock Availability Monitor'],
    recentAction: 'Compared 5 merchant stores for ASUS Vivobook 16X',
    lastResult: 'Found ₹3,200 price difference between Amazon (₹68,990) and Croma (₹72,190)',
    successRate: 99.6,
    latencyMs: 180,
    iconName: 'TrendingDown'
  },
  {
    id: 'offer-agent',
    name: 'Offer & Savings Agent',
    status: 'active',
    role: 'Bank Discount, Coupon & EMI Optimizer',
    purpose: 'Evaluates eligible credit/debit card instant discounts, no-cost EMI tiers, brand exchange bonuses, and hidden coupon codes to compute real out-of-pocket cost.',
    inputs: ['HDFC/SBI/ICICI/Axis Bank API tables', 'Exchange evaluation matrices', 'Coupon feeds'],
    tools: ['Stacking Discount Calculator', 'Eligibility Matcher', 'Effective Cost Engine'],
    recentAction: 'Stacked ₹1,000 instant coupon + ₹3,000 HDFC CC discount on ₹67,990 baseline',
    lastResult: 'Calculated estimated effective price of ₹55,990 (inclusive of ₹8,000 exchange)',
    successRate: 99.2,
    latencyMs: 195,
    iconName: 'Tag'
  },
  {
    id: 'ranking-agent',
    name: 'Ranking Agent',
    status: 'active',
    role: 'Multi-Factor Weighted Decision Scoring',
    purpose: 'Applies personalized weighted scoring across performance, memory, thermals, display, battery, review sentiment, and effective price to generate transparent rankings.',
    inputs: ['Normalized specs', 'Benchmark indexes', 'Review scores', 'Customized weights'],
    tools: ['Multi-criteria Decision Matrix (MCDM)', 'Pareto Frontier Filter', 'Dynamic Scorer'],
    recentAction: 'Calculated 94/100 match score for HP 15 against Data Science profile',
    lastResult: 'Ranked HP 15 as #1 Best Match; ASUS TUF as #1 Best Gaming/GPU',
    successRate: 100.0,
    latencyMs: 110,
    iconName: 'Award'
  },
  {
    id: 'personalization-agent',
    name: 'Personalization Agent',
    status: 'active',
    role: 'Contextual Preference & Sensitivity Modeling',
    purpose: 'Adapts ranking priorities based on customer role, past hardware ownership, price sensitivity, and workflow profile.',
    inputs: ['Customer Profile', 'Behavioral session telemetry', 'Workload requirements'],
    tools: ['Adaptive Weight Tuner', 'Persona Classifier'],
    recentAction: 'Adjusted GPU weight +15% based on "occasional gaming" toggle',
    lastResult: 'Dynamically promoted ASUS TUF from #4 to #2',
    successRate: 99.5,
    latencyMs: 95,
    iconName: 'UserCheck'
  },
  {
    id: 'checkout-agent',
    name: 'Checkout Agent',
    status: 'active',
    role: 'Frictionless Transaction & Payment Routing',
    purpose: 'Guides the customer through 1-click payment verification, verifies bank card discount eligibility at checkout, and routes the transaction securely.',
    inputs: ['Cart state', 'Selected bank discount', 'Preferred payment gateway'],
    tools: ['Pre-checkout Validator', 'Instant Discount Enforcer', 'Payment Gateway Router'],
    recentAction: 'Applied HDFC ₹3,000 instant discount and pre-filled UPI handle',
    lastResult: 'Secured order total ₹64,990 with 0% payment drop-off',
    successRate: 99.9,
    latencyMs: 250,
    iconName: 'CreditCard'
  },
  {
    id: 'growth-agent',
    name: 'Growth Agent',
    status: 'active',
    role: 'Merchant Revenue Intelligence & Opportunity Discovery',
    purpose: 'Monitors aggregate customer discovery patterns, identifies drop-off anomalies, and autonomously proposes targeted conversion campaigns to merchants.',
    inputs: ['Cart abandonment telemetry', 'Search bounce rates', 'Merchant margin targets'],
    tools: ['Opportunity Miner', 'Predictive ROI Simulator', 'Autonomous Campaign Generator'],
    recentAction: 'Identified 2,841 high-intent browse sessions without checkout',
    lastResult: 'Simulated WhatsApp recovery campaign with estimated ₹18.4L revenue recovery',
    successRate: 98.7,
    latencyMs: 420,
    iconName: 'TrendingUp'
  },
  {
    id: 'retention-agent',
    name: 'Retention Agent',
    status: 'active',
    role: 'Post-Purchase Care, Warranty & Upgrade Signals',
    purpose: 'Tracks post-delivery satisfaction, schedules automated warranty reminders, and predicts next upgrade lifecycle for loyal customers.',
    inputs: ['Order history', 'Delivery tracking status', 'Product lifecycle age'],
    tools: ['Lifecycle Predictor', 'Automated Post-Purchase Concierge'],
    recentAction: 'Scheduled 30-day performance check-in and trade-in notification',
    lastResult: 'Achieved 32% repeat customer engagement rate across merchant cohort',
    successRate: 99.1,
    latencyMs: 160,
    iconName: 'HeartHandshake'
  }
];

export const INITIAL_LIVE_EVENTS: LiveAgentEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Just now',
    agentId: 'intent-agent',
    agentName: 'Intent Agent',
    action: 'Analyzed customer prompt',
    details: '"I need a laptop under ₹70,000 for AI and Data Science with Python & Jupyter"',
    category: 'intent',
    isHighlighted: true
  },
  {
    id: 'evt-2',
    timestamp: '4s ago',
    agentId: 'product-agent',
    agentName: 'Product Discovery Agent',
    action: 'Filtered multi-store catalog',
    details: 'Found 18 candidate laptops matching 16GB RAM + High IPC processor requirements',
    category: 'catalog'
  },
  {
    id: 'evt-3',
    timestamp: '9s ago',
    agentId: 'review-agent',
    agentName: 'Review Agent',
    action: 'Mined 1,850 verified buyer reviews',
    details: 'Extracted key pros (CPU speed, thermals) and cons (outdoor screen brightness)',
    category: 'reviews'
  },
  {
    id: 'evt-4',
    timestamp: '14s ago',
    agentId: 'price-agent',
    agentName: 'Price Intelligence Agent',
    action: 'Scanned 5 merchant stores',
    details: 'Located lowest baseline on Amazon at ₹67,990 (₹3,200 lower than retail MSRP)',
    category: 'pricing'
  },
  {
    id: 'evt-5',
    timestamp: '19s ago',
    agentId: 'offer-agent',
    agentName: 'Offer & Savings Agent',
    action: 'Optimized bank stack',
    details: 'Applied ₹3,000 HDFC Card instant discount + ₹1,000 coupon code',
    category: 'offers'
  },
  {
    id: 'evt-6',
    timestamp: '25s ago',
    agentId: 'ranking-agent',
    agentName: 'Ranking Agent',
    action: 'Generated AI Match Score 94/100',
    details: 'Selected HP 15 (13th Gen i5) as #1 Recommendation for Data Science workflow',
    category: 'intent',
    isHighlighted: true
  },
  {
    id: 'evt-7',
    timestamp: '32s ago',
    agentId: 'growth-agent',
    agentName: 'Growth Agent',
    action: 'Logged commerce interaction',
    details: 'Added high-intent Python developer signal to merchant conversion funnel',
    category: 'growth'
  }
];

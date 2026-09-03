import { DemoScene } from '../types';

export const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    sceneNumber: '01 / 12',
    title: 'Customer Intent Entry',
    subtitle: 'Natural language shopping goal input',
    activeAgent: 'Intent Agent',
    customerInput: '"I need a laptop under ₹70,000 for AI and Data Science, Python, Jupyter, VS Code and occasional gaming."',
    narration: 'A student or developer describes their real-world computing needs in conversational language without having to know raw chip models or complicated SKU codes.',
    systemAction: 'Intent Agent captures audio & text stream, initializing multi-agent discovery pipeline.',
    routeTarget: '/'
  },
  {
    id: 2,
    sceneNumber: '02 / 12',
    title: 'Intent Extraction & Constraint Mapping',
    subtitle: 'NLU turns conversation into machine requirements',
    activeAgent: 'Intent Agent',
    narration: 'The Intent Agent decomposes the prompt into concrete hardware requirements: Budget ≤ ₹70,000, RAM ≥ 16GB, CPU IPC > 85 for Python compilation, and dedicated/high-bandwidth GPU for occasional gaming.',
    systemAction: 'Extracted 4 hard constraints and 2 soft preferences.',
    routeTarget: '/ai-finder'
  },
  {
    id: 3,
    sceneNumber: '03 / 12',
    title: 'Multi-Store Catalog Search & Normalization',
    subtitle: 'Querying 60+ laptop models across 8 top brands',
    activeAgent: 'Product Discovery Agent',
    narration: 'Product Discovery Agent queries catalog feeds, standardizes raw processor and GPU naming schemes, and eliminates duplicate listings across merchant platforms.',
    systemAction: 'Identified 18 qualified candidate laptops matching the hard criteria.',
    routeTarget: '/shop'
  },
  {
    id: 4,
    sceneNumber: '04 / 12',
    title: 'AI Review Sentiment Mining',
    subtitle: 'Filtering sponsored noise across 1,850+ buyer reviews',
    activeAgent: 'Review Agent',
    narration: 'The Review Agent analyzes verified user sentiment to find genuine thermal performance under heavy Jupyter loads, keyboard ergonomics, and actual battery endurance.',
    systemAction: 'Extracted positive signals (CPU response, thermals) and identified 250-nit display outdoor limitation.',
    routeTarget: '/product/hp-15-fd0012tu'
  },
  {
    id: 5,
    sceneNumber: '05 / 12',
    title: 'Cross-Store Price Intelligence',
    subtitle: 'Real-time price arbitrage across 5 stores',
    activeAgent: 'Price Intelligence Agent',
    narration: 'Price Intelligence Agent scans Amazon, Flipkart, Croma, Reliance Digital, and Brand Stores, confirming the lowest listed price and checking 30-day historical trends.',
    systemAction: 'Located best listed price at ₹67,990 on Amazon with ₹3,200 savings versus retail MSRP.',
    routeTarget: '/product/hp-15-fd0012tu'
  },
  {
    id: 6,
    sceneNumber: '06 / 12',
    title: 'Bank Offer & Effective Price Stacking',
    subtitle: 'Optimizing instant card discounts and exchange value',
    activeAgent: 'Offer & Savings Agent',
    narration: 'The Offer Agent evaluates customer bank card eligibility, stacking a ₹3,000 HDFC Card instant discount and ₹1,000 coupon on top of an estimated ₹8,000 exchange value.',
    systemAction: 'Calculated real estimated effective price: ₹55,990.',
    routeTarget: '/product/hp-15-fd0012tu'
  },
  {
    id: 7,
    sceneNumber: '07 / 12',
    title: 'Multi-Factor AI Match Scoring',
    subtitle: 'Weighted evaluation across 9 hardware & price dimensions',
    activeAgent: 'Ranking Agent',
    narration: 'The Ranking Agent computes a transparent 94/100 AI Match Score by weighting CPU speed, memory bandwidth, thermals, battery life, review sentiment, and effective price.',
    systemAction: 'Scored all 18 candidates with transparent breakdown factors.',
    routeTarget: '/rankings'
  },
  {
    id: 8,
    sceneNumber: '08 / 12',
    title: 'Personalized #1 Recommendation',
    subtitle: 'Clear decision rationale for the top match',
    activeAgent: 'Ranking Agent',
    narration: 'CommercePilot presents HP 15 as the #1 Best Match, providing a clear explanation: "Strong CPU performance, 16GB RAM and 512GB storage make this a strong fit for Python, Jupyter and development within your budget."',
    systemAction: 'Presented #1 Recommendation with actionable decision summary.',
    routeTarget: '/rankings'
  },
  {
    id: 9,
    sceneNumber: '09 / 12',
    title: 'Dynamic 4-Way Side-by-Side Comparison',
    subtitle: 'Evaluating trade-offs against ASUS TUF and Lenovo',
    activeAgent: 'Personalization Agent',
    narration: 'Customer compares the top 4 candidates. The comparison engine highlights winning parameters in green and provides an automated AI verdict on trade-offs (GPU vs Battery vs Portability).',
    systemAction: 'Generated concise comparative trade-off verdict.',
    routeTarget: '/compare'
  },
  {
    id: 10,
    sceneNumber: '10 / 12',
    title: 'Dynamic Re-Ranking on Parameter Shift',
    subtitle: 'User increases Gaming priority → ASUS TUF becomes #1',
    activeAgent: 'Personalization Agent',
    narration: 'When the user boosts the Gaming priority slider, GPU weight dynamically increases. CommercePilot instantly re-ranks the catalog and elevates ASUS TUF Gaming to the #1 spot with a live rationale update.',
    systemAction: 'Autonomous weight adaptation and instant re-ranking.',
    routeTarget: '/rankings'
  },
  {
    id: 11,
    sceneNumber: '11 / 12',
    title: 'Agentic 1-Click Checkout',
    subtitle: 'Pre-selected eligible payment with instant savings',
    activeAgent: 'Checkout Agent',
    narration: 'Customer opens checkout. The AI Checkout Assistant confirms optimal card selection, applies the verified ₹3,000 instant discount, and completes a simulated frictionless transaction.',
    systemAction: 'Order placed at ₹64,990 with 0 transaction drop-off.',
    routeTarget: '/checkout'
  },
  {
    id: 12,
    sceneNumber: '12 / 12',
    title: 'Merchant Growth & Next-Best Action',
    subtitle: 'Transaction transforms into autonomous growth intelligence',
    activeAgent: 'Growth Agent',
    narration: 'The transaction immediately registers on the Merchant Growth Dashboard, logging customer intent path, feeding demand forecast models, and triggering autonomous recovery campaigns.',
    systemAction: 'Merchant dashboard updated: ₹24.8L revenue & 8.7% conversion rate recorded.',
    routeTarget: '/growth'
  }
];

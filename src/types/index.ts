export interface ProductSpecs {
  screenSize: string;
  resolution: string;
  refreshRate: string;
  panelType: string;
  os: string;
  ports: string[];
  batteryWh: number;
  batteryHours: number;
  weightKg: number;
  chargerWattage: number;
  warranty: string;
  color: string;
  releaseYear: number;
}

export interface MarketplaceListing {
  store: 'Amazon' | 'Flipkart' | 'Croma' | 'Reliance Digital' | 'Brand Store';
  price: number;
  originalPrice: number;
  inStock: boolean;
  deliveryDays: number;
  rating: number;
  seller: string;
  directUrl?: string;
  badge?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  store: string;
}

export interface BankOffer {
  id: string;
  bank: 'HDFC Bank' | 'SBI Bank' | 'ICICI Bank' | 'Axis Bank' | 'Kotak' | 'Federal Bank';
  cardType: 'Credit Card' | 'Debit Card' | 'EMI Credit';
  instantDiscount: number;
  minPurchase: number;
  maxDiscount: number;
  terms: string;
  isDemoOffer: boolean;
  code?: string;
}

export interface ReviewTheme {
  theme: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  sampleQuote: string;
}

export interface ReviewSummary {
  totalAnalyzed: number;
  sentimentScore: number; // 0-100
  positivePct: number;
  negativePct: number;
  positiveThemes: ReviewTheme[];
  negativeThemes: ReviewTheme[];
  aiVerdict: string;
  developerRating: number; // out of 10
  gamerRating: number;
  studentRating: number;
}

export interface Product {
  id: string;
  brand: 'Apple' | 'ASUS' | 'Lenovo' | 'HP' | 'Dell' | 'Acer' | 'MSI' | 'Samsung';
  model: string;
  subtitle: string;
  image: string;
  price: number;
  mrp: number;
  processor: string;
  processorScore: number; // 0-100
  gpu: string;
  gpuScore: number; // 0-100
  ram: string; // e.g. "16GB DDR5"
  ramGb: number;
  storage: string; // e.g. "512GB NVMe SSD"
  storageGb: number;
  display: string;
  battery: string;
  weight: string;
  rating: number;
  reviewCount: number;
  category: 'ai_ml' | 'programming' | 'gaming' | 'student' | 'business' | 'creator' | 'ultrabook';
  categories: string[];
  
  // Benchmark & AI Multi-factor Scores
  performanceScore: number;
  valueScore: number;
  aiScore: number; // Weighted Overall Match
  thermalsScore: number;
  batteryScore: number;
  displayScore: number;
  portabilityScore: number;
  
  isAiRecommended?: boolean;
  aiRecommendationReason?: string;
  
  specs: ProductSpecs;
  marketplaces: MarketplaceListing[];
  priceHistory: PriceHistoryPoint[];
  offers: BankOffer[];
  reviewSummary: ReviewSummary;
  stock: number;
}

export interface RankingWeights {
  performance: number;
  ram: number;
  price: number;
  reviews: number;
  thermals: number;
  storage: number;
  display: number;
  battery: number;
  gpu: number;
}

export interface CustomerProfile {
  name: string;
  purpose: string;
  budgetMax: number;
  preferredBrands: string[];
  gamingImportance: 'none' | 'casual' | 'hardcore';
  portabilityImportance: 'low' | 'medium' | 'high';
  batteryImportance: 'normal' | 'high';
  aiMlImportance: boolean;
  priceSensitivity: 'high' | 'medium' | 'low';
  preferredPayment: 'upi' | 'card' | 'emi';
}

export interface CommerceAgent {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'analyzing' | 'completed';
  role: string;
  purpose: string;
  inputs: string[];
  tools: string[];
  recentAction: string;
  lastResult: string;
  successRate: number; // e.g. 99.4
  latencyMs: number;
  iconName: string;
}

export interface LiveAgentEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  details: string;
  category: 'intent' | 'catalog' | 'pricing' | 'reviews' | 'offers' | 'checkout' | 'growth';
  isHighlighted?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOffer?: BankOffer;
  customEffectivePrice: number;
}

export interface CampaignSimulation {
  id: string;
  name: string;
  goal: string;
  audience: string;
  targetCount: number;
  channel: 'WhatsApp + Email' | 'WhatsApp' | 'Email' | 'In-App Push';
  offerType: string;
  durationDays: number;
  budget: number;
  estimatedRoi: number;
  expectedConversionLift: number;
  status: 'draft' | 'simulated' | 'approved' | 'running';
  createdDate: string;
}

export interface DemoScene {
  id: number;
  sceneNumber: string;
  title: string;
  subtitle: string;
  activeAgent: string;
  narration: string;
  customerInput?: string;
  systemAction: string;
  routeTarget?: string;
}

import { Product, BankOffer, ReviewSummary, MarketplaceListing, PriceHistoryPoint } from '../types';

export const DEFAULT_OFFERS: BankOffer[] = [
  {
    id: 'hdfc-cc-instant',
    bank: 'HDFC Bank',
    cardType: 'Credit Card',
    instantDiscount: 3000,
    minPurchase: 45000,
    maxDiscount: 3000,
    terms: 'Instant ₹3,000 discount on HDFC Bank Credit Card non-EMI transactions. Min transaction ₹45,000.',
    isDemoOffer: true,
    code: 'HDFC3000'
  },
  {
    id: 'sbi-cc-instant',
    bank: 'SBI Bank',
    cardType: 'Credit Card',
    instantDiscount: 2500,
    minPurchase: 40000,
    maxDiscount: 2500,
    terms: 'Flat ₹2,500 instant discount on SBI Credit Card transactions.',
    isDemoOffer: true,
    code: 'SBISAVE'
  },
  {
    id: 'icici-cc-instant',
    bank: 'ICICI Bank',
    cardType: 'Credit Card',
    instantDiscount: 2000,
    minPurchase: 35000,
    maxDiscount: 2000,
    terms: 'Instant ₹2,000 off on ICICI Bank Cards and NetBanking.',
    isDemoOffer: true,
    code: 'ICICI2K'
  },
  {
    id: 'axis-cc-instant',
    bank: 'Axis Bank',
    cardType: 'Credit Card',
    instantDiscount: 1500,
    minPurchase: 30000,
    maxDiscount: 1500,
    terms: 'Instant ₹1,500 off on Axis Bank Credit Cards.',
    isDemoOffer: true,
    code: 'AXIS1500'
  }
];

export const generatePriceHistory = (basePrice: number): PriceHistoryPoint[] => {
  const days = [30, 25, 20, 15, 10, 5, 1];
  const variations = [0.05, 0.03, -0.02, 0.04, -0.01, -0.04, 0];
  const stores = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Brand Store'];
  
  return days.map((day, idx) => ({
    date: `Day -${day}`,
    price: Math.round(basePrice * (1 + variations[idx]) / 100) * 100,
    store: stores[idx % stores.length]
  }));
};

export const generateMarketplaces = (basePrice: number): MarketplaceListing[] => {
  return [
    {
      store: 'Amazon',
      price: basePrice,
      originalPrice: Math.round(basePrice * 1.18 / 100) * 100,
      inStock: true,
      deliveryDays: 1,
      rating: 4.4,
      seller: 'Appario Retail / Official',
      badge: 'Best Listed Price'
    },
    {
      store: 'Flipkart',
      price: Math.round((basePrice + (Math.random() > 0.5 ? 990 : -500)) / 100) * 100,
      originalPrice: Math.round(basePrice * 1.2 / 100) * 100,
      inStock: true,
      deliveryDays: 2,
      rating: 4.3,
      seller: 'SuperComNet Tech'
    },
    {
      store: 'Croma',
      price: Math.round((basePrice + 1200) / 100) * 100,
      originalPrice: Math.round(basePrice * 1.15 / 100) * 100,
      inStock: true,
      deliveryDays: 2,
      rating: 4.5,
      seller: 'Tata Croma Electronics'
    },
    {
      store: 'Reliance Digital',
      price: Math.round((basePrice + 800) / 100) * 100,
      originalPrice: Math.round(basePrice * 1.16 / 100) * 100,
      inStock: true,
      deliveryDays: 3,
      rating: 4.2,
      seller: 'Reliance Retail Ltd'
    },
    {
      store: 'Brand Store',
      price: Math.round((basePrice + 1990) / 100) * 100,
      originalPrice: Math.round(basePrice * 1.25 / 100) * 100,
      inStock: true,
      deliveryDays: 2,
      rating: 4.7,
      seller: 'Direct OEM Authorized Store',
      badge: 'Free Extended Warranty'
    }
  ];
};

export const createReviewSummary = (
  positivePct: number,
  aiVerdict: string,
  topPositives: string[],
  topNegatives: string[]
): ReviewSummary => {
  return {
    totalAnalyzed: 1400 + Math.floor(Math.random() * 850),
    sentimentScore: positivePct,
    positivePct: positivePct,
    negativePct: 100 - positivePct - 5,
    positiveThemes: topPositives.map(theme => ({
      theme,
      count: Math.floor(Math.random() * 400) + 120,
      sentiment: 'positive',
      sampleQuote: `Users praise the ${theme.toLowerCase()} for daily workflow.`
    })),
    negativeThemes: topNegatives.map(theme => ({
      theme,
      count: Math.floor(Math.random() * 150) + 30,
      sentiment: 'negative',
      sampleQuote: `Some reviewers noticed ${theme.toLowerCase()} under maximum stress.`
    })),
    aiVerdict,
    developerRating: Math.min(9.8, (positivePct / 10) + 0.3),
    gamerRating: Math.min(9.6, (positivePct / 10) - 0.2),
    studentRating: Math.min(9.9, (positivePct / 10) + 0.5)
  };
};

// Stable curated high-res technology photography for laptops
const LAPTOP_IMAGES = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80'
];

export const PRODUCTS_CATALOG: Product[] = [
  // 1. HP 15 - Highlighted #1 AI Match Under 70K
  {
    id: 'hp-15-fd0012tu',
    brand: 'HP',
    model: 'HP 15 (13th Gen Core i5)',
    subtitle: '13th Gen Intel Core i5-1335U | 16GB DDR4 | 512GB SSD | 15.6" FHD IPS',
    image: LAPTOP_IMAGES[0],
    price: 67990,
    mrp: 79990,
    processor: 'Intel Core i5-1335U (10 Cores, up to 4.6 GHz)',
    processorScore: 89,
    gpu: 'Intel Iris Xe Graphics (Shared 8GB)',
    gpuScore: 68,
    ram: '16GB DDR4 3200MHz',
    ramGb: 16,
    storage: '512GB PCIe NVMe M.2 SSD',
    storageGb: 512,
    display: '15.6" Full HD (1920x1080) Micro-Edge IPS Anti-Glare',
    battery: '41Wh (Up to 8.5 Hours fast charge)',
    weight: '1.59 kg',
    rating: 4.4,
    reviewCount: 1850,
    category: 'ai_ml',
    categories: ['ai_ml', 'programming', 'student', 'best_under_70k', 'best_value'],
    performanceScore: 92,
    valueScore: 95,
    aiScore: 94,
    thermalsScore: 86,
    batteryScore: 81,
    displayScore: 79,
    portabilityScore: 88,
    isAiRecommended: true,
    aiRecommendationReason: 'Strong CPU performance, 16GB RAM and 512GB fast storage make this a top balanced fit for Python, Jupyter notebooks, VS Code, and development within your ₹70,000 budget.',
    specs: {
      screenSize: '15.6 inch',
      resolution: '1920 x 1080',
      refreshRate: '60Hz',
      panelType: 'IPS Anti-glare',
      os: 'Windows 11 Home 64-bit',
      ports: ['1x USB Type-C 5Gbps', '2x USB Type-A 5Gbps', '1x HDMI 1.4b', '1x Headphone/Mic Combo'],
      batteryWh: 41,
      batteryHours: 8.5,
      weightKg: 1.59,
      chargerWattage: 45,
      warranty: '1 Year On-site Manufacturer Warranty',
      color: 'Natural Silver',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(67990),
    priceHistory: generatePriceHistory(67990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      88,
      'Strong performance for programming, Python scripts, and college multitasking. Crisp keyboard and quiet thermals. Display brightness (250 nits) is the primary compromise outdoors.',
      ['CPU Responsiveness', 'Keyboard Comfort', 'Fast Boot Speed', 'Reliable Battery'],
      ['Display Brightness Outdoors', 'Average Webcam in Low Light']
    ),
    stock: 14
  },

  // 2. ASUS TUF Gaming F15 - Best Gaming & GPU Under 75K
  {
    id: 'asus-tuf-f15-rtx3050',
    brand: 'ASUS',
    model: 'ASUS TUF Gaming F15 (RTX 3050)',
    subtitle: 'Intel Core i5-11400H | 16GB DDR4 | 512GB NVMe SSD | RTX 3050 4GB | 144Hz FHD',
    image: LAPTOP_IMAGES[1],
    price: 64990,
    mrp: 89990,
    processor: 'Intel Core i5-11400H (6 Cores, 12 Threads, 4.5 GHz)',
    processorScore: 88,
    gpu: 'NVIDIA GeForce RTX 3050 4GB GDDR6 (75W TGP)',
    gpuScore: 86,
    ram: '16GB DDR4 3200MHz (Expandable to 32GB)',
    ramGb: 16,
    storage: '512GB PCIe 3.0 NVMe SSD + Extra M.2 Slot',
    storageGb: 512,
    display: '15.6" FHD (1920x1080) 144Hz vIPS-level Anti-Glare',
    battery: '48Wh (Up to 5.5 Hours)',
    weight: '2.30 kg',
    rating: 4.5,
    reviewCount: 3240,
    category: 'gaming',
    categories: ['gaming', 'ai_ml', 'best_gaming', 'best_under_70k'],
    performanceScore: 94,
    valueScore: 92,
    aiScore: 91,
    thermalsScore: 88,
    batteryScore: 70,
    displayScore: 85,
    portabilityScore: 65,
    isAiRecommended: false,
    aiRecommendationReason: 'Exceptional GPU acceleration for PyTorch/TensorFlow CUDA models and 1080p high refresh gaming at exceptional price-to-performance.',
    specs: {
      screenSize: '15.6 inch',
      resolution: '1920 x 1080',
      refreshRate: '144Hz',
      panelType: 'vIPS Adaptive-Sync',
      os: 'Windows 11 Home',
      ports: ['1x Thunderbolt 4', '3x USB 3.2 Gen 1 Type-A', '1x HDMI 2.0b', '1x RJ45 LAN', '1x Audio Combo'],
      batteryWh: 48,
      batteryHours: 5.5,
      weightKg: 2.30,
      chargerWattage: 180,
      warranty: '1 Year International Warranty',
      color: 'Graphite Black',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(64990),
    priceHistory: generatePriceHistory(64990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      89,
      'High GPU computing capability with dedicated 4GB VRAM. Solid military-grade chassis and effective dual-fan cooling. Heavier weight and bulky power brick reduce daily portability.',
      ['Gaming Framerates', 'CUDA Acceleration', 'Dual Fan Thermals', '144Hz Smoothness'],
      ['Heavier Weight', 'Battery Life under High Load']
    ),
    stock: 22
  },

  // 3. Apple MacBook Air M2 - Best Battery & Ultrabook
  {
    id: 'apple-macbook-air-m2',
    brand: 'Apple',
    model: 'Apple MacBook Air 13.6" (M2 Chip)',
    subtitle: 'Apple M2 8-Core CPU / 8-Core GPU | 8GB Unified Memory | 256GB SSD | Liquid Retina',
    image: LAPTOP_IMAGES[2],
    price: 89990,
    mrp: 99900,
    processor: 'Apple M2 Chip (8-Core CPU with 4 performance & 4 efficiency)',
    processorScore: 96,
    gpu: 'Apple 8-Core Integrated Neural GPU (16-Core Neural Engine)',
    gpuScore: 84,
    ram: '8GB Unified Memory (100GB/s bandwidth)',
    ramGb: 8,
    storage: '256GB Ultra-fast NVMe SSD',
    storageGb: 256,
    display: '13.6" Liquid Retina (2560x1664) 500 nits Wide color (P3)',
    battery: '52.6Wh (Up to 18 Hours video playback)',
    weight: '1.24 kg',
    rating: 4.8,
    reviewCount: 4120,
    category: 'ultrabook',
    categories: ['ultrabook', 'programming', 'best_battery', 'best_lightweight', 'best_overall'],
    performanceScore: 95,
    valueScore: 88,
    aiScore: 93,
    thermalsScore: 94,
    batteryScore: 99,
    displayScore: 98,
    portabilityScore: 99,
    isAiRecommended: true,
    aiRecommendationReason: 'Best-in-class power efficiency, 18-hour real world battery life, and gorgeous 500-nit Liquid Retina display. Ideal for Python web development and mobile workflows.',
    specs: {
      screenSize: '13.6 inch',
      resolution: '2560 x 1664',
      refreshRate: '60Hz',
      panelType: 'Liquid Retina IPS True Tone',
      os: 'macOS Sequoia',
      ports: ['2x Thunderbolt / USB 4', '1x MagSafe 3', '1x 3.5mm Headphone Jack'],
      batteryWh: 52.6,
      batteryHours: 18,
      weightKg: 1.24,
      chargerWattage: 30,
      warranty: '1 Year Apple Limited Warranty',
      color: 'Midnight Blue / Starlight',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(89990),
    priceHistory: generatePriceHistory(89990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      94,
      'Industry-leading battery life, silent fanless thermal architecture, and unmatched trackpad/keyboard craftsmanship. 8GB base memory limits heavy local Docker/LLM model training.',
      ['18hr Battery Life', '500-nit Gorgeous Screen', 'Fanless Silent Operation', 'Featherweight 1.24kg'],
      ['Base 8GB RAM non-upgradeable', 'Only 2 USB-C Ports']
    ),
    stock: 9
  },

  // 4. Lenovo IdeaPad Slim 3 - Best Student Under 50K
  {
    id: 'lenovo-ideapad-slim3-i5',
    brand: 'Lenovo',
    model: 'Lenovo IdeaPad Slim 3 (12th Gen i5)',
    subtitle: 'Intel Core i5-12450H | 16GB LPDDR5 | 512GB SSD | 15.6" FHD IPS | Backlit KB',
    image: LAPTOP_IMAGES[3],
    price: 49990,
    mrp: 68190,
    processor: 'Intel Core i5-12450H (8 Cores, up to 4.4 GHz)',
    processorScore: 87,
    gpu: 'Intel UHD Graphics',
    gpuScore: 62,
    ram: '16GB LPDDR5 4800MHz',
    ramGb: 16,
    storage: '512GB SSD PCIe NVMe',
    storageGb: 512,
    display: '15.6" FHD (1920x1080) 300 nits IPS Anti-glare',
    battery: '47Wh (Up to 7 Hours + Rapid Charge)',
    weight: '1.62 kg',
    rating: 4.3,
    reviewCount: 1620,
    category: 'student',
    categories: ['student', 'best_under_50k', 'best_value', 'programming'],
    performanceScore: 86,
    valueScore: 97,
    aiScore: 92,
    thermalsScore: 84,
    batteryScore: 78,
    displayScore: 76,
    portabilityScore: 85,
    isAiRecommended: true,
    aiRecommendationReason: 'Phenomenal value under ₹50,000 featuring a full H-series high-performance processor and 16GB modern LPDDR5 memory.',
    specs: {
      screenSize: '15.6 inch',
      resolution: '1920 x 1080',
      refreshRate: '60Hz',
      panelType: 'IPS Anti-glare 300 nits',
      os: 'Windows 11 Home + MS Office 2021',
      ports: ['1x USB-C 3.2 Gen 1 (Power & Display)', '2x USB 3.2 Gen 1', '1x HDMI 1.4', '1x SD Card Reader'],
      batteryWh: 47,
      batteryHours: 7,
      weightKg: 1.62,
      chargerWattage: 65,
      warranty: '2 Year Lenovo Premium Care',
      color: 'Arctic Grey',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(49990),
    priceHistory: generatePriceHistory(49990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      86,
      'Tremendous value with H-series CPU and fast 16GB LPDDR5 memory. Great for college coding, statistical modeling, and general coursework.',
      ['H-series CPU at Low Price', '16GB Fast LPDDR5', 'Military Grade Durability', 'Backlit Keyboard'],
      ['Moderate Speaker Bass', 'Plastic Trackpad Surface']
    ),
    stock: 28
  },

  // 5. Acer Nitro V 15 - Best AI/ML & Gaming Under 80K
  {
    id: 'acer-nitro-v-15-rtx4050',
    brand: 'Acer',
    model: 'Acer Nitro V 15 (RTX 4050 6GB)',
    subtitle: 'Intel Core i5-13420H | 16GB DDR5 | 512GB Gen4 SSD | RTX 4050 6GB GDDR6 | 144Hz',
    image: LAPTOP_IMAGES[4],
    price: 74990,
    mrp: 92999,
    processor: 'Intel Core i5-13420H (8 Cores, 12 Threads, 4.6 GHz)',
    processorScore: 91,
    gpu: 'NVIDIA GeForce RTX 4050 6GB GDDR6 (DLSS 3.5 & Tensor Cores)',
    gpuScore: 92,
    ram: '16GB DDR5 5200MHz (Upgradeable to 32GB)',
    ramGb: 16,
    storage: '512GB PCIe Gen4 NVMe SSD',
    storageGb: 512,
    display: '15.6" Full HD (1920x1080) 144Hz IPS 16:9',
    battery: '57Wh (Up to 6 Hours)',
    weight: '2.10 kg',
    rating: 4.6,
    reviewCount: 2190,
    category: 'ai_ml',
    categories: ['ai_ml', 'gaming', 'best_for_ai', 'best_gaming', 'best_performance'],
    performanceScore: 96,
    valueScore: 94,
    aiScore: 96,
    thermalsScore: 90,
    batteryScore: 72,
    displayScore: 86,
    portabilityScore: 70,
    isAiRecommended: true,
    aiRecommendationReason: 'NVIDIA RTX 4050 with 6GB VRAM provides dedicated 4th-Gen Tensor Cores for local LLM inference (Ollama, Mistral 7B) and deep learning model training.',
    specs: {
      screenSize: '15.6 inch',
      resolution: '1920 x 1080',
      refreshRate: '144Hz',
      panelType: 'IPS Display',
      os: 'Windows 11 Home',
      ports: ['1x Thunderbolt 4', '3x USB 3.2 Gen 1', '1x HDMI 2.1', '1x RJ45 Ethernet', '1x Audio Jack'],
      batteryWh: 57,
      batteryHours: 6,
      weightKg: 2.10,
      chargerWattage: 135,
      warranty: '1 Year Acer International',
      color: 'Obsidian Black with Neon Accents',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(74990),
    priceHistory: generatePriceHistory(74990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      91,
      'The RTX 4050 6GB GPU delivers phenomenal local ML tensor acceleration and modern gaming performance with Ada Lovelace architecture.',
      ['6GB RTX 4050 Tensor Acceleration', 'Dual Fan Cooling NitroSense', 'DDR5 5200MHz Speed', 'Thunderbolt 4 Port'],
      ['Fan noise at Turbo Mode', 'Chunky Bezels']
    ),
    stock: 18
  },

  // 6. Dell Inspiron 14 Plus - Best Creator & Coding Under 1L
  {
    id: 'dell-inspiron-14-plus',
    brand: 'Dell',
    model: 'Dell Inspiron 14 Plus (Intel Evo i7)',
    subtitle: 'Intel Core i7-13700H | 16GB LPDDR5 | 1TB SSD | 14" 2.2K (2240x1400) 100% sRGB',
    image: LAPTOP_IMAGES[5],
    price: 94990,
    mrp: 119990,
    processor: 'Intel Core i7-13700H (14 Cores, 20 Threads, 5.0 GHz)',
    processorScore: 97,
    gpu: 'Intel Iris Xe Graphics (High-bandwidth)',
    gpuScore: 74,
    ram: '16GB LPDDR5 4800MHz',
    ramGb: 16,
    storage: '1TB M.2 PCIe NVMe SSD',
    storageGb: 1000,
    display: '14.0" 2.2K (2240x1400) 16:10 300 nits 100% sRGB ComfortView Plus',
    battery: '64Wh (Up to 10 Hours)',
    weight: '1.66 kg',
    rating: 4.6,
    reviewCount: 980,
    category: 'creator',
    categories: ['creator', 'programming', 'business', 'best_performance', 'best_under_1l'],
    performanceScore: 97,
    valueScore: 89,
    aiScore: 93,
    thermalsScore: 89,
    batteryScore: 85,
    displayScore: 95,
    portabilityScore: 91,
    isAiRecommended: false,
    aiRecommendationReason: '14-core flagship Core i7 CPU with 1TB SSD and a stellar 16:10 2.2K color-accurate panel creates a premier coding & data engineering workstation.',
    specs: {
      screenSize: '14.0 inch',
      resolution: '2240 x 1400',
      refreshRate: '60Hz',
      panelType: 'Anti-Glare 100% sRGB',
      os: 'Windows 11 Pro',
      ports: ['1x Thunderbolt 4 with DP & PD', '2x USB 3.2 Gen 1', '1x HDMI 2.0', '1x MicroSD Card Reader'],
      batteryWh: 64,
      batteryHours: 10,
      weightKg: 1.66,
      chargerWattage: 90,
      warranty: '1 Year Dell Onsite ProSupport',
      color: 'Dark Green / Platinum Silver',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(94990),
    priceHistory: generatePriceHistory(94990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      92,
      'Monstrous CPU compiling speeds with 14 cores, 1TB expansive storage, and a rich 16:10 aspect ratio screen that fits extensive code lines.',
      ['14-Core Compiling Speed', 'Crisp 2.2K 16:10 Screen', 'Massive 1TB Storage', 'Aluminum Precision Build'],
      ['No Dedicated GPU for Heavy 3D', 'Warm under Sustained Load']
    ),
    stock: 11
  },

  // 7. Samsung Galaxy Book4 - Best Lightweight Windows Ultrabook
  {
    id: 'samsung-galaxy-book4-i5',
    brand: 'Samsung',
    model: 'Samsung Galaxy Book4 (Core 5 120U)',
    subtitle: 'Intel Core 5 120U | 16GB LPDDR4X | 512GB SSD | 15.6" FHD AMOLED | 1.55kg',
    image: LAPTOP_IMAGES[6],
    price: 69990,
    mrp: 84990,
    processor: 'Intel Core 5 120U (10 Cores, 12 Threads, 5.0 GHz Turbo)',
    processorScore: 90,
    gpu: 'Intel Graphics',
    gpuScore: 69,
    ram: '16GB LPDDR4X 4266MHz',
    ramGb: 16,
    storage: '512GB NVMe SSD (Expandable Dual Slot)',
    storageGb: 512,
    display: '15.6" Full HD (1920x1080) Anti-glare Super AMOLED display',
    battery: '54Wh (Up to 12 Hours + 45W USB-C Charger)',
    weight: '1.55 kg',
    rating: 4.5,
    reviewCount: 1420,
    category: 'business',
    categories: ['business', 'programming', 'student', 'best_lightweight', 'best_under_70k'],
    performanceScore: 89,
    valueScore: 91,
    aiScore: 90,
    thermalsScore: 92,
    batteryScore: 90,
    displayScore: 92,
    portabilityScore: 93,
    isAiRecommended: false,
    aiRecommendationReason: 'Sleek premium aluminum chassis with Galaxy ecosystem integration, dual SSD expandability, and all-day 12-hour battery life.',
    specs: {
      screenSize: '15.6 inch',
      resolution: '1920 x 1080',
      refreshRate: '60Hz',
      panelType: 'Anti-Glare Display',
      os: 'Windows 11 Home',
      ports: ['2x USB Type-C', '2x USB 3.2', '1x HDMI', '1x MicroSD Slot', '1x RJ45'],
      batteryWh: 54,
      batteryHours: 12,
      weightKg: 1.55,
      chargerWattage: 45,
      warranty: '1 Year Samsung Warranty',
      color: 'Silver Gray',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(69990),
    priceHistory: generatePriceHistory(69990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      89,
      'Sleek industrial design with seamless Galaxy smartphone clipboard sharing, dual SSD slots, and a featherweight universal Type-C charger.',
      ['Galaxy Ecosystem Sync', 'Slim Aluminum Profile', 'Dual SSD Expandability', 'Long Battery Life'],
      ['Speakers lack low end', 'Webcam is 720p']
    ),
    stock: 16
  },

  // 8. Lenovo Legion Pro 5i - Best Ultra High Performance AI & Gaming
  {
    id: 'lenovo-legion-pro-5i-rtx4070',
    brand: 'Lenovo',
    model: 'Lenovo Legion Pro 5i (14th Gen i9 + RTX 4070)',
    subtitle: 'Intel Core i9-14900HX | 32GB DDR5 | 1TB Gen4 SSD | RTX 4070 8GB (140W) | 16" WQXGA 240Hz',
    image: LAPTOP_IMAGES[7],
    price: 169990,
    mrp: 219990,
    processor: 'Intel Core i9-14900HX (24 Cores, 32 Threads, up to 5.8 GHz)',
    processorScore: 99,
    gpu: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (140W TGP, AI Boost)',
    gpuScore: 98,
    ram: '32GB DDR5 5600MHz (Expandable to 64GB)',
    ramGb: 32,
    storage: '1TB PCIe 4.0 NVMe M.2 SSD',
    storageGb: 1000,
    display: '16.0" WQXGA (2560x1600) 240Hz 500 nits 100% sRGB HDR400 G-Sync',
    battery: '80Wh (Up to 6 Hours + Super Rapid Charge Pro)',
    weight: '2.50 kg',
    rating: 4.8,
    reviewCount: 1540,
    category: 'ai_ml',
    categories: ['ai_ml', 'gaming', 'best_for_ai', 'best_performance', 'best_gaming'],
    performanceScore: 99,
    valueScore: 87,
    aiScore: 98,
    thermalsScore: 96,
    batteryScore: 68,
    displayScore: 99,
    portabilityScore: 58,
    isAiRecommended: true,
    aiRecommendationReason: 'Top-tier 24-core workstation grade CPU with 32GB high-speed memory and RTX 4070 140W for extensive deep learning fine-tuning, large simulations, and competitive esports.',
    specs: {
      screenSize: '16.0 inch',
      resolution: '2560 x 1600',
      refreshRate: '240Hz',
      panelType: 'IPS 500 nits HDR400 G-Sync',
      os: 'Windows 11 Home',
      ports: ['2x USB-C 3.2 Gen 2', '4x USB-A 3.2 Gen 1', '1x HDMI 2.1', '1x RJ45 2.5G LAN', '1x Headphone Jack'],
      batteryWh: 80,
      batteryHours: 6,
      weightKg: 2.50,
      chargerWattage: 300,
      warranty: '3 Year Legion Ultimate Support',
      color: 'Onyx Grey',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(169990),
    priceHistory: generatePriceHistory(169990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      95,
      'Uncompromising computing raw power. Coldfront 5.0 vapor chamber thermals keep the 24-core i9 and 140W RTX 4070 boosted under continuous deep learning loads.',
      ['24-Core Computational Beast', '32GB Fast DDR5 Memory', '240Hz 500-nit Gorgeous Screen', 'Coldfront Vapor Chamber'],
      ['Heavy 2.5kg Weight', 'Large 300W Power Adapter']
    ),
    stock: 7
  },

  // 9. Apple MacBook Pro 14" (M3 Pro)
  {
    id: 'apple-macbook-pro-14-m3pro',
    brand: 'Apple',
    model: 'Apple MacBook Pro 14" (M3 Pro Chip)',
    subtitle: 'Apple M3 Pro (11-Core CPU, 14-Core GPU) | 18GB Unified Memory | 512GB SSD | Liquid Retina XDR',
    image: LAPTOP_IMAGES[8],
    price: 194900,
    mrp: 199900,
    processor: 'Apple M3 Pro Chip (11-Core CPU with 5 performance & 6 efficiency)',
    processorScore: 98,
    gpu: 'Apple 14-Core GPU with Hardware Ray Tracing',
    gpuScore: 93,
    ram: '18GB Unified Memory (150GB/s bandwidth)',
    ramGb: 18,
    storage: '512GB PCIe NVMe SSD',
    storageGb: 512,
    display: '14.2" Liquid Retina XDR (3024x1964) 120Hz ProMotion 1600 nits peak',
    battery: '70Wh (Up to 18 Hours)',
    weight: '1.61 kg',
    rating: 4.9,
    reviewCount: 2830,
    category: 'creator',
    categories: ['creator', 'programming', 'ai_ml', 'best_overall', 'best_performance', 'best_battery'],
    performanceScore: 98,
    valueScore: 86,
    aiScore: 96,
    thermalsScore: 97,
    batteryScore: 98,
    displayScore: 100,
    portabilityScore: 92,
    isAiRecommended: true,
    aiRecommendationReason: 'The absolute golden standard for software engineers: 18GB unified memory, 18-hour battery life, and the breathtaking 1600-nit mini-LED Liquid Retina XDR ProMotion panel.',
    specs: {
      screenSize: '14.2 inch',
      resolution: '3024 x 1964',
      refreshRate: '120Hz ProMotion',
      panelType: 'Liquid Retina XDR Mini-LED',
      os: 'macOS Sonoma / Sequoia',
      ports: ['3x Thunderbolt 4', '1x HDMI 2.1', '1x SDXC Card Slot', '1x MagSafe 3', '1x High-impedance Jack'],
      batteryWh: 70,
      batteryHours: 18,
      weightKg: 1.61,
      chargerWattage: 70,
      warranty: '1 Year Apple Global Warranty',
      color: 'Space Black',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(194900),
    priceHistory: generatePriceHistory(194900),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      96,
      'Flawless hardware execution. Exceptional battery endurance even when running local LLMs with MLX or compiling massive codebases simultaneously.',
      ['Liquid Retina XDR Display', '18 Hours True Battery', '18GB Unified RAM for MLX', 'Space Black Anodization'],
      ['Premium Price Point', 'Non-upgradeable Storage']
    ),
    stock: 8
  },

  // 10. MSI Modern 14 - Best Entry Value Under 40K
  {
    id: 'msi-modern-14-c11m',
    brand: 'MSI',
    model: 'MSI Modern 14 (Core i3 11th Gen)',
    subtitle: 'Intel Core i3-1115G4 | 8GB DDR4 | 512GB NVMe SSD | 14" FHD IPS | 1.4kg Light',
    image: LAPTOP_IMAGES[9],
    price: 34990,
    mrp: 49990,
    processor: 'Intel Core i3-1115G4 (2 Cores, 4 Threads, 4.1 GHz)',
    processorScore: 72,
    gpu: 'Intel UHD Graphics',
    gpuScore: 54,
    ram: '8GB DDR4 3200MHz',
    ramGb: 8,
    storage: '512GB NVMe PCIe Gen3 SSD',
    storageGb: 512,
    display: '14.0" Full HD (1920x1080) 60Hz IPS-Level 45% NTSC',
    battery: '39Wh (Up to 6 Hours)',
    weight: '1.40 kg',
    rating: 4.2,
    reviewCount: 840,
    category: 'student',
    categories: ['student', 'best_under_50k', 'best_value', 'best_lightweight'],
    performanceScore: 74,
    valueScore: 96,
    aiScore: 78,
    thermalsScore: 82,
    batteryScore: 74,
    displayScore: 72,
    portabilityScore: 94,
    isAiRecommended: false,
    aiRecommendationReason: 'Ultra-affordable lightweight 1.4kg everyday laptop with 512GB NVMe SSD for budget-conscious students and basic productivity.',
    specs: {
      screenSize: '14.0 inch',
      resolution: '1920 x 1080',
      refreshRate: '60Hz',
      panelType: 'IPS-level Thin Bezel',
      os: 'Windows 11 Home',
      ports: ['1x USB-C 3.2 Gen 2', '2x USB-A 2.0', '1x HDMI', '1x MicroSD Card Reader'],
      batteryWh: 39,
      batteryHours: 6,
      weightKg: 1.40,
      chargerWattage: 65,
      warranty: '1 Year MSI Warranty',
      color: 'Classic Black',
      releaseYear: 2023
    },
    marketplaces: generateMarketplaces(34990),
    priceHistory: generatePriceHistory(34990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      83,
      'Solid entry-level value with quick 512GB SSD storage and 180-degree lay-flat hinge design. Great for document drafting, web browsing, and Zoom calls.',
      ['Featherweight 1.4kg', 'Fast 512GB SSD', '180 Degree Lay-flat Hinge', 'Affordable Price'],
      ['Dual-core CPU limits heavy multitasking', 'Average Speaker Quality']
    ),
    stock: 25
  },

  // 11. ASUS Vivobook 16X (Ryzen 7 5800H + RTX 3050)
  {
    id: 'asus-vivobook-16x-m1603',
    brand: 'ASUS',
    model: 'ASUS Vivobook 16X (Ryzen 7 + RTX 3050)',
    subtitle: 'AMD Ryzen 7 5800H (8 Cores) | 16GB DDR4 | 512GB SSD | RTX 3050 4GB | 16" WUXGA 16:10',
    image: LAPTOP_IMAGES[0],
    price: 68990,
    mrp: 86990,
    processor: 'AMD Ryzen 7 5800H (8 Cores, 16 Threads, up to 4.4 GHz)',
    processorScore: 92,
    gpu: 'NVIDIA GeForce RTX 3050 4GB GDDR6',
    gpuScore: 85,
    ram: '16GB DDR4 3200MHz',
    ramGb: 16,
    storage: '512GB M.2 NVMe PCIe 3.0 SSD',
    storageGb: 512,
    display: '16.0" WUXGA (1920x1200) 16:10 300 nits Anti-glare',
    battery: '50Wh (Up to 7 Hours)',
    weight: '1.80 kg',
    rating: 4.4,
    reviewCount: 1680,
    category: 'programming',
    categories: ['programming', 'ai_ml', 'creator', 'best_under_70k', 'best_value'],
    performanceScore: 93,
    valueScore: 94,
    aiScore: 93,
    thermalsScore: 88,
    batteryScore: 78,
    displayScore: 86,
    portabilityScore: 84,
    isAiRecommended: true,
    aiRecommendationReason: '8-core Ryzen 7 paired with RTX 3050 GPU in a slim 16-inch 16:10 body. Ideal balance of developer screen real estate and ML GPU compute under ₹70K.',
    specs: {
      screenSize: '16.0 inch',
      resolution: '1920 x 1200',
      refreshRate: '60Hz',
      panelType: 'IPS 16:10 300 nits',
      os: 'Windows 11 Home',
      ports: ['1x USB-C 3.2 Gen 1', '2x USB 3.2 Gen 1 Type-A', '1x USB 2.0', '1x HDMI 1.4', '1x Audio Jack'],
      batteryWh: 50,
      batteryHours: 7,
      weightKg: 1.80,
      chargerWattage: 120,
      warranty: '1 Year ASUS Warranty',
      color: 'Indie Black',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(68990),
    priceHistory: generatePriceHistory(68990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      88,
      'Great 16:10 tall workspace for developers with powerful 8-core multicore processing and CUDA GPU capabilities.',
      ['8-Core Ryzen Power', '16:10 Taller Display', 'ErgoSense Keyboard', 'Fingerprint Login'],
      ['60Hz Display Refresh', 'USB-C lacks Power Delivery']
    ),
    stock: 19
  },

  // 12. HP Pavilion Plus 14 (OLED 2.8K)
  {
    id: 'hp-pavilion-plus-14-oled',
    brand: 'HP',
    model: 'HP Pavilion Plus 14 (OLED 2.8K 120Hz)',
    subtitle: 'AMD Ryzen 7 7840U AI | 16GB LPDDR5X | 1TB SSD | 14" 2.8K OLED 120Hz (0.2ms) 500 nits',
    image: LAPTOP_IMAGES[1],
    price: 84990,
    mrp: 99990,
    processor: 'AMD Ryzen 7 7840U with Ryzen AI (8 Cores, 16 Threads, 5.1 GHz)',
    processorScore: 95,
    gpu: 'AMD Radeon 780M RDNA 3 Integrated Graphics',
    gpuScore: 83,
    ram: '16GB LPDDR5X 6400MHz',
    ramGb: 16,
    storage: '1TB PCIe Gen4 NVMe SSD',
    storageGb: 1000,
    display: '14.0" 2.8K (2880x1800) OLED 120Hz HDR 500 nits 100% DCI-P3 IMAX Enhanced',
    battery: '68Wh (Up to 11 Hours)',
    weight: '1.44 kg',
    rating: 4.7,
    reviewCount: 1120,
    category: 'creator',
    categories: ['creator', 'programming', 'best_overall', 'best_lightweight', 'best_for_ai'],
    performanceScore: 94,
    valueScore: 91,
    aiScore: 94,
    thermalsScore: 91,
    batteryScore: 89,
    displayScore: 99,
    portabilityScore: 95,
    isAiRecommended: true,
    aiRecommendationReason: 'Breathtaking 2.8K 120Hz OLED screen with true infinite contrast, Ryzen AI NPU engine, 1TB Gen4 SSD, and ultralight 1.44kg metal build.',
    specs: {
      screenSize: '14.0 inch',
      resolution: '2880 x 1800',
      refreshRate: '120Hz',
      panelType: 'OLED HDR 500 nits 100% DCI-P3',
      os: 'Windows 11 Home',
      ports: ['1x Thunderbolt 4 / USB-C 40Gbps', '1x USB-C 10Gbps', '2x USB-A 10Gbps', '1x HDMI 2.1'],
      batteryWh: 68,
      batteryHours: 11,
      weightKg: 1.44,
      chargerWattage: 65,
      warranty: '1 Year Onsite Warranty',
      color: 'Moonlight Blue',
      releaseYear: 2024
    },
    marketplaces: generateMarketplaces(84990),
    priceHistory: generatePriceHistory(84990),
    offers: DEFAULT_OFFERS,
    reviewSummary: createReviewSummary(
      94,
      'Mesmerizing 2.8K OLED panel with deep inky blacks and vibrant colors. Ryzen 7840U with Radeon 780M offers unmatched integrated graphical performance.',
      ['2.8K 120Hz OLED Display', 'Radeon 780M Graphics', 'Dedicated Ryzen AI NPU', '1TB Fast Storage'],
      ['OLED consumes more battery on white backgrounds', 'Glossy Screen Reflections']
    ),
    stock: 12
  }
];

// Generate an extended realistic catalog of 60+ laptops by expanding realistic variants
const BRANDS: Array<'Apple' | 'ASUS' | 'Lenovo' | 'HP' | 'Dell' | 'Acer' | 'MSI' | 'Samsung'> = [
  'Apple', 'ASUS', 'Lenovo', 'HP', 'Dell', 'Acer', 'MSI', 'Samsung'
];

const PROCESSOR_CONFIGS = [
  { name: 'Intel Core i5-13450HX (10 Cores, 4.6 GHz)', score: 91, tier: 'mid', gpu: 'RTX 4050 6GB', gpuScore: 90, priceRange: [72000, 78000] },
  { name: 'Intel Core i7-13650HX (14 Cores, 4.9 GHz)', score: 95, tier: 'high', gpu: 'RTX 4060 8GB', gpuScore: 94, priceRange: [98000, 115000] },
  { name: 'AMD Ryzen 5 7535HS (6 Cores, 4.55 GHz)', score: 85, tier: 'budget', gpu: 'RTX 2050 4GB', gpuScore: 75, priceRange: [52000, 58000] },
  { name: 'AMD Ryzen 7 7735HS (8 Cores, 4.75 GHz)', score: 92, tier: 'mid', gpu: 'Radeon 680M Graphics', gpuScore: 78, priceRange: [62000, 69000] },
  { name: 'Intel Core i3-1215U (6 Cores, 4.4 GHz)', score: 76, tier: 'entry', gpu: 'Intel Iris Xe Graphics', gpuScore: 60, priceRange: [38000, 44000] },
  { name: 'Intel Core Ultra 7 155H (16 Cores + NPU)', score: 96, tier: 'flagship', gpu: 'Intel Arc Graphics (8 Xe cores)', gpuScore: 86, priceRange: [105000, 128000] },
  { name: 'Intel Core Ultra 5 125H (14 Cores + NPU)', score: 92, tier: 'mid-high', gpu: 'Intel Arc Graphics', gpuScore: 82, priceRange: [79000, 89000] },
  { name: 'AMD Ryzen 9 7940HS (8 Cores, 5.2 GHz)', score: 97, tier: 'flagship', gpu: 'RTX 4070 8GB', gpuScore: 96, priceRange: [135000, 155000] }
];

const MODEL_NAMES_BY_BRAND: Record<string, string[]> = {
  Apple: ['MacBook Air 15" M2', 'MacBook Air 13" M3', 'MacBook Pro 16" M3 Max', 'MacBook Pro 14" M3 Base'],
  ASUS: ['Zenbook 14 OLED', 'Vivobook S 15 OLED', 'ROG Zephyrus G14', 'ROG Strix G16', 'TUF Gaming A15', 'ExpertBook B5'],
  Lenovo: ['ThinkPad E14 Gen 5', 'Yoga Slim 7i Aura', 'IdeaPad Pro 5 Gen 9', 'LOQ 15 Gaming', 'Legion 7i Pro', 'ThinkBook 16 Gen 6'],
  HP: ['Envy x360 14 2-in-1', 'Victus 15 Gaming', 'Victus 16 Gaming', 'Spectre x360 14 OLED', 'ProBook 450 G10', 'OmniBook X AI'],
  Dell: ['XPS 13 9340', 'XPS 14 OLED', 'G15 5530 Gaming', 'Latitude 5440', 'Alienware m16 R2', 'Inspiron 16 5630'],
  Acer: ['Swift Go 14 OLED', 'Predator Helios 16', 'Aspire 5 Slim', 'Swift X 14 AI', 'TravelMate P2', 'Nitro 16 AMD'],
  MSI: ['Katana 15 Gaming', 'Cyborg 15 RTX 4060', 'Prestige 14 AI Studio', 'Stealth 16 AI Studio', 'Thin GF63', 'Modern 15 H'],
  Samsung: ['Galaxy Book4 Pro 14', 'Galaxy Book4 360', 'Galaxy Book4 Ultra RTX 4070', 'Galaxy Book3 Core i7', 'Galaxy Book4 Edge Snapdragon']
};

export const generateFullCatalog = (): Product[] => {
  const catalog = [...PRODUCTS_CATALOG];
  let idCounter = 13;

  for (const brand of BRANDS) {
    const models = MODEL_NAMES_BY_BRAND[brand] || [];
    for (let i = 0; i < models.length; i++) {
      const modelName = models[i];
      const procConfig = PROCESSOR_CONFIGS[(idCounter + i) % PROCESSOR_CONFIGS.length];
      const basePrice = procConfig.priceRange[0] + Math.floor(Math.random() * (procConfig.priceRange[1] - procConfig.priceRange[0]));
      const ramGb = basePrice > 100000 ? 32 : (basePrice > 60000 ? 16 : 8);
      const storageGb = basePrice > 90000 ? 1000 : 512;
      const isGaming = modelName.includes('Gaming') || modelName.includes('ROG') || modelName.includes('Predator') || modelName.includes('Katana') || modelName.includes('LOQ') || modelName.includes('Victus') || modelName.includes('Alienware');
      const isOled = modelName.includes('OLED') || modelName.includes('Spectre') || modelName.includes('Yoga');
      const isMac = brand === 'Apple';

      const perfScore = Math.min(99, Math.round((procConfig.score * 0.5) + (procConfig.gpuScore * 0.35) + (ramGb >= 16 ? 12 : 6)));
      const valueScore = Math.min(98, Math.max(75, Math.round(100 - (basePrice / 2500))));
      const aiScore = Math.round((perfScore * 0.45) + (valueScore * 0.35) + (ramGb >= 16 ? 15 : 8));

      const category: Product['category'] = isGaming ? 'gaming' : (isMac ? 'ultrabook' : (basePrice < 55000 ? 'student' : (basePrice > 95000 ? 'creator' : 'programming')));

      const productCategories: string[] = [category];
      if (basePrice <= 50000) productCategories.push('best_under_50k');
      if (basePrice <= 70000) productCategories.push('best_under_70k');
      if (basePrice <= 100000) productCategories.push('best_under_1l');
      if (isGaming) productCategories.push('best_gaming');
      if (perfScore >= 93) productCategories.push('best_performance');
      if (valueScore >= 92) productCategories.push('best_value');
      if (ramGb >= 16 && procConfig.score >= 88) productCategories.push('best_for_ai');
      if (basePrice < 60000) productCategories.push('best_student');

      catalog.push({
        id: `${brand.toLowerCase()}-${modelName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idCounter}`,
        brand,
        model: `${brand} ${modelName}`,
        subtitle: `${procConfig.name.split('(')[0]} | ${ramGb}GB RAM | ${storageGb}GB SSD | ${isOled ? 'OLED Panel' : 'FHD IPS'}`,
        image: LAPTOP_IMAGES[idCounter % LAPTOP_IMAGES.length],
        price: Math.round(basePrice / 100) * 100,
        mrp: Math.round((basePrice * 1.22) / 100) * 100,
        processor: procConfig.name,
        processorScore: procConfig.score,
        gpu: procConfig.gpu,
        gpuScore: procConfig.gpuScore,
        ram: `${ramGb}GB DDR5 High-Speed RAM`,
        ramGb,
        storage: `${storageGb}GB NVMe PCIe Gen4 SSD`,
        storageGb,
        display: isOled ? `14.5" 2.8K 120Hz OLED 100% DCI-P3` : (isGaming ? `15.6" FHD 144Hz IPS Anti-Glare` : `15.6" FHD 300 nits IPS Anti-Glare`),
        battery: `${basePrice > 90000 ? '75Wh (Up to 12 Hours)' : '50Wh (Up to 7.5 Hours)'}`,
        weight: `${isGaming ? '2.25 kg' : (isMac ? '1.24 kg' : '1.48 kg')}`,
        rating: +(4.2 + (Math.random() * 0.6)).toFixed(1),
        reviewCount: Math.floor(Math.random() * 2400) + 450,
        category,
        categories: productCategories,
        performanceScore: perfScore,
        valueScore,
        aiScore,
        thermalsScore: Math.floor(Math.random() * 15) + 82,
        batteryScore: isMac ? 98 : (isGaming ? 68 : 84),
        displayScore: isOled ? 98 : (isGaming ? 86 : 80),
        portabilityScore: isGaming ? 64 : 92,
        isAiRecommended: aiScore >= 94,
        aiRecommendationReason: `Engineered for high efficiency ${category === 'gaming' ? 'gaming framerates and GPU acceleration' : 'productivity, coding and multitask workflows'}.`,
        specs: {
          screenSize: isOled ? '14.5 inch' : '15.6 inch',
          resolution: isOled ? '2880 x 1800' : '1920 x 1080',
          refreshRate: isGaming ? '144Hz' : (isOled ? '120Hz' : '60Hz'),
          panelType: isOled ? 'OLED Panel' : 'IPS Anti-glare',
          os: isMac ? 'macOS Sequoia' : 'Windows 11 Home',
          ports: ['1x Type-C Fast Charge', '2x USB 3.2 Gen 2', '1x HDMI 2.1', '1x Headphone Jack'],
          batteryWh: basePrice > 90000 ? 75 : 50,
          batteryHours: isMac ? 16 : (isGaming ? 5.5 : 8),
          weightKg: isGaming ? 2.25 : 1.48,
          chargerWattage: isGaming ? 170 : 65,
          warranty: '1 Year OEM Warranty',
          color: brand === 'Apple' ? 'Space Grey' : (brand === 'Lenovo' ? 'Storm Grey' : 'Slate Black'),
          releaseYear: 2024
        },
        marketplaces: generateMarketplaces(basePrice),
        priceHistory: generatePriceHistory(basePrice),
        offers: DEFAULT_OFFERS,
        reviewSummary: createReviewSummary(
          Math.floor(Math.random() * 14) + 82,
          `Solid overall execution for ${category} use cases. Well calibrated thermals and responsive keyboard typing feel.`,
          ['Responsive Multitasking', 'Quiet Fan Noise', 'Sturdy Chassis', 'Fast App Startup'],
          ['Average Webcam in Dim Rooms', 'Stock Speaker Bass']
        ),
        stock: Math.floor(Math.random() * 20) + 5
      });

      idCounter++;
    }
  }

  return catalog;
};

export const ALL_PRODUCTS: Product[] = generateFullCatalog();

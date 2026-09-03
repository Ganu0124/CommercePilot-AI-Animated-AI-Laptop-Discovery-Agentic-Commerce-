export interface RankingCategoryDef {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  filterFn: string; // key for logic
  defaultWeights: {
    performance: number;
    ram: number;
    price: number;
    reviews: number;
    thermals: number;
    storage: number;
    display: number;
    battery: number;
    gpu: number;
  };
}

export const RANKING_CATEGORIES: RankingCategoryDef[] = [
  {
    id: 'best_overall',
    name: 'Best overall',
    slug: 'best-overall',
    description: 'Highest balanced score across computational speed, display fidelity, thermals, and customer satisfaction.',
    icon: 'Sparkles',
    filterFn: 'all',
    defaultWeights: { performance: 25, ram: 15, price: 15, reviews: 15, thermals: 10, storage: 5, display: 5, battery: 5, gpu: 5 }
  },
  {
    id: 'best_value',
    name: 'Best value',
    slug: 'best-value',
    description: 'Maximum performance and hardware capability delivered per Rupee spent.',
    icon: 'Percent',
    filterFn: 'value',
    defaultWeights: { performance: 15, ram: 15, price: 35, reviews: 10, thermals: 5, storage: 5, display: 5, battery: 5, gpu: 5 }
  },
  {
    id: 'best_performance',
    name: 'Best performance',
    slug: 'best-performance',
    description: 'Top-tier multi-threaded processing power and graphical rendering capabilities for demanding workloads.',
    icon: 'Zap',
    filterFn: 'performance',
    defaultWeights: { performance: 35, ram: 20, price: 5, reviews: 10, thermals: 10, storage: 5, display: 5, battery: 5, gpu: 5 }
  },
  {
    id: 'best_for_ai',
    name: 'Best for AI/ML',
    slug: 'best-ai-ml',
    description: 'Optimized for PyTorch, TensorFlow, Tensor Cores, CUDA support, and local LLM inference.',
    icon: 'Brain',
    filterFn: 'ai',
    defaultWeights: { performance: 25, ram: 20, price: 10, reviews: 10, thermals: 10, storage: 5, display: 5, battery: 5, gpu: 10 }
  },
  {
    id: 'programming',
    name: 'Best for programming',
    slug: 'best-programming',
    description: 'High IPC CPU compilation, 16GB+ memory for Docker & IDEs, and tactile keyboard ergonomics.',
    icon: 'Code2',
    filterFn: 'programming',
    defaultWeights: { performance: 25, ram: 25, price: 15, reviews: 10, thermals: 10, storage: 5, display: 5, battery: 5, gpu: 0 }
  },
  {
    id: 'best_gaming',
    name: 'Best gaming',
    slug: 'best-gaming',
    description: 'Dedicated high-wattage GPUs, high refresh rate displays (144Hz+), and dual-fan vapor chambers.',
    icon: 'Gamepad2',
    filterFn: 'gaming',
    defaultWeights: { performance: 20, ram: 15, price: 10, reviews: 10, thermals: 15, storage: 5, display: 10, battery: 0, gpu: 15 }
  },
  {
    id: 'best_student',
    name: 'Best student laptop',
    slug: 'best-student',
    description: 'Affordable, long battery life, robust build, and smooth multitasking for college assignments and coding.',
    icon: 'GraduationCap',
    filterFn: 'student',
    defaultWeights: { performance: 15, ram: 15, price: 25, reviews: 15, thermals: 5, storage: 5, display: 5, battery: 15, gpu: 0 }
  },
  {
    id: 'best_battery',
    name: 'Best battery',
    slug: 'best-battery',
    description: 'All-day 12-18 hour battery life with ultra-efficient processors for untethered mobility.',
    icon: 'BatteryCharging',
    filterFn: 'battery',
    defaultWeights: { performance: 15, ram: 10, price: 10, reviews: 15, thermals: 10, storage: 5, display: 10, battery: 25, gpu: 0 }
  },
  {
    id: 'best_lightweight',
    name: 'Best lightweight',
    slug: 'best-lightweight',
    description: 'Ultra-thin profiles under 1.5kg with premium magnesium/aluminum build.',
    icon: 'Feather',
    filterFn: 'lightweight',
    defaultWeights: { performance: 15, ram: 10, price: 15, reviews: 15, thermals: 10, storage: 5, display: 10, battery: 20, gpu: 0 }
  },
  {
    id: 'best_under_50k',
    name: 'Best under ₹50K',
    slug: 'best-under-50k',
    description: 'Top value laptops priced under ₹50,000 for budget-conscious students and professionals.',
    icon: 'BadgeIndianRupee',
    filterFn: 'under_50k',
    defaultWeights: { performance: 20, ram: 20, price: 25, reviews: 15, thermals: 5, storage: 5, display: 5, battery: 5, gpu: 0 }
  },
  {
    id: 'best_under_70k',
    name: 'Best under ₹70K',
    slug: 'best-under-70k',
    description: 'Sweet spot segment offering 16GB RAM, modern 13th Gen/Ryzen 7 processors, and dedicated graphics options.',
    icon: 'Flame',
    filterFn: 'under_70k',
    defaultWeights: { performance: 25, ram: 20, price: 15, reviews: 10, thermals: 10, storage: 5, display: 5, battery: 5, gpu: 5 }
  },
  {
    id: 'best_under_1l',
    name: 'Best under ₹1L',
    slug: 'best-under-1l',
    description: 'Premium ultrabooks and creator laptops with OLED panels, 1TB SSDs, and high-performance CPUs.',
    icon: 'ShieldCheck',
    filterFn: 'under_1l',
    defaultWeights: { performance: 30, ram: 20, price: 10, reviews: 10, thermals: 10, storage: 5, display: 10, battery: 5, gpu: 0 }
  }
];

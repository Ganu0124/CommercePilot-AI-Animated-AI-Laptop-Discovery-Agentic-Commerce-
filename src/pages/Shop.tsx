import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Check, 
  ChevronDown,
  Layers,
  Cpu
} from 'lucide-react';
import { LaptopCard } from '../components/LaptopCard';
import { useCommerce } from '../context/CommerceContext';

const BRANDS = ['All Brands', 'Apple', 'ASUS', 'Lenovo', 'HP', 'Dell', 'Acer', 'MSI', 'Samsung'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹50,000', min: 0, max: 50000 },
  { label: '₹50,000 - ₹70,000', min: 50000, max: 70000 },
  { label: '₹70,000 - ₹1,00,000', min: 70000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity }
];
const RAM_OPTIONS = ['All RAM', '8GB', '16GB', '32GB'];

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products, searchQuery, setSearchQuery } = useCommerce();

  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number>(0);
  const [selectedRam, setSelectedRam] = useState<string>('All RAM');
  const [sortBy, setSortBy] = useState<'aiScore' | 'priceAsc' | 'priceDesc' | 'performance'>('aiScore');

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    const q = (searchQuery || searchParams.get('q') || '').toLowerCase().trim();
    if (q) {
      list = list.filter(p =>
        p.model.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.processor.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand !== 'All Brands') {
      list = list.filter(p => p.brand === selectedBrand);
    }

    // Price range filter
    const range = PRICE_RANGES[selectedPriceRangeIndex];
    if (range) {
      list = list.filter(p => p.price >= range.min && p.price <= range.max);
    }

    // RAM filter
    if (selectedRam !== 'All RAM') {
      const targetRam = parseInt(selectedRam);
      list = list.filter(p => p.ramGb === targetRam);
    }

    // Sort order
    if (sortBy === 'aiScore') {
      list = list.sort((a, b) => b.aiScore - a.aiScore);
    } else if (sortBy === 'priceAsc') {
      list = list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      list = list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'performance') {
      list = list.sort((a, b) => b.performanceScore - a.performanceScore);
    }

    return list;
  }, [products, searchQuery, searchParams, selectedBrand, selectedPriceRangeIndex, selectedRam, sortBy]);

  const resetAllFilters = () => {
    setSelectedBrand('All Brands');
    setSelectedPriceRangeIndex(0);
    setSelectedRam('All RAM');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
            Verified Multi-Merchant Catalog
          </span>
          <h1 className="text-fluid-title font-light text-ink mt-1">
            Browse All Laptops
          </h1>
          <p className="text-xs text-muted mt-1">
            Tracked across Amazon, Flipkart, Croma, Reliance Digital, and Official Brand Stores.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Natural Search Input */}
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords: e.g. Core i5, RTX 4050, OLED, 16GB RAM..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-bg rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent text-ink"
            />
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-bg text-ink text-xs font-mono rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="aiScore">Sort by: AI Match Score (Highest)</option>
              <option value="priceAsc">Sort by: Price (Lowest First)</option>
              <option value="priceDesc">Sort by: Price (Highest First)</option>
              <option value="performance">Sort by: Performance Benchmark</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
          {/* Brand Filter Dropdown */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="p-1.5 bg-bg text-ink rounded-sm hairline text-xs focus:outline-none"
          >
            {BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Price Range Dropdown */}
          <select
            value={selectedPriceRangeIndex}
            onChange={(e) => setSelectedPriceRangeIndex(Number(e.target.value))}
            className="p-1.5 bg-bg text-ink rounded-sm hairline text-xs focus:outline-none"
          >
            {PRICE_RANGES.map((pr, idx) => (
              <option key={idx} value={idx}>{pr.label}</option>
            ))}
          </select>

          {/* RAM Filter Dropdown */}
          <select
            value={selectedRam}
            onChange={(e) => setSelectedRam(e.target.value)}
            className="p-1.5 bg-bg text-ink rounded-sm hairline text-xs focus:outline-none"
          >
            {RAM_OPTIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {(selectedBrand !== 'All Brands' || selectedPriceRangeIndex !== 0 || selectedRam !== 'All RAM' || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-1 text-accent-deep hover:underline text-xs"
            >
              Reset Filters
            </button>
          )}

          <div className="ml-auto text-muted text-xs">
            Showing <span className="font-semibold text-ink">{filteredProducts.length}</span> laptops
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="surface-card rounded-sm p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-ink">No matching laptops found</p>
          <p className="text-xs text-muted">Try relaxing your budget, brand, or search constraints.</p>
          <button
            onClick={resetAllFilters}
            className="mt-2 py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <LaptopCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

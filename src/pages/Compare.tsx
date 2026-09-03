import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Sparkles, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  ShoppingBag, 
  Star, 
  Award, 
  Cpu, 
  Layers, 
  HardDrive, 
  Battery, 
  Feather,
  TrendingDown
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { ALL_PRODUCTS } from '../data/products';
import { Product } from '../types';

export const Compare: React.FC = () => {
  const { 
    comparisonList, 
    removeFromCompare, 
    clearCompare, 
    addToCompare, 
    addToCart 
  } = useCommerce();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');

  // Fallback defaults if fewer than 2 laptops are chosen
  const displayItems = comparisonList.length > 0 
    ? comparisonList 
    : ALL_PRODUCTS.slice(0, 3); // Prepopulate top 3 for demo walkthrough

  // Helper to determine winning specs among currently compared laptops
  const highestCpuScore = Math.max(...displayItems.map(p => p.processorScore));
  const highestGpuScore = Math.max(...displayItems.map(p => p.gpuScore));
  const highestRam = Math.max(...displayItems.map(p => p.ramGb));
  const highestStorage = Math.max(...displayItems.map(p => p.storageGb));
  const lowestPrice = Math.min(...displayItems.map(p => p.price));
  const highestBatteryHours = Math.max(...displayItems.map(p => p.specs.batteryHours));
  const lowestWeightKg = Math.min(...displayItems.map(p => p.specs.weightKg));
  const highestAiScore = Math.max(...displayItems.map(p => p.aiScore));

  const availableToAdd = ALL_PRODUCTS.filter(
    p => !displayItems.some(item => item.id === p.id) &&
         (p.model.toLowerCase().includes(modalSearch.toLowerCase()) || p.brand.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>4-Way Multivariate Comparison Matrix</span>
            </div>
            <h1 className="text-fluid-title font-light text-ink">
              Side-by-Side Evaluation
            </h1>
            <p className="text-xs text-muted mt-1">
              Winning specifications in each benchmark category are highlighted with green badges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {displayItems.length < 4 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="py-2.5 px-4 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Laptop ({displayItems.length}/4)</span>
              </button>
            )}

            {comparisonList.length > 0 && (
              <button
                onClick={clearCompare}
                className="py-2.5 px-3 bg-bg hover:bg-muted/10 text-muted hover:text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Comparison Verdict Box */}
        <div className="p-4 bg-accent/10 border border-accent/30 rounded-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-deep uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>AI Comparative Trade-off Verdict</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs text-ink leading-relaxed">
            <div className="p-2.5 bg-surface rounded-sm hairline">
              <span className="font-semibold text-accent-deep block font-mono">1. Computational Balance</span>
              <p className="text-muted mt-0.5">
                {displayItems[0]?.model} delivers the highest CPU efficiency and optimal thermal quietness for everyday development.
              </p>
            </div>

            <div className="p-2.5 bg-surface rounded-sm hairline">
              <span className="font-semibold text-accent-deep block font-mono">2. GPU & Graphics Acceleration</span>
              <p className="text-muted mt-0.5">
                {displayItems[1]?.model || displayItems[0]?.model} features the highest dedicated graphical compute power for CUDA models and gaming.
              </p>
            </div>

            <div className="p-2.5 bg-surface rounded-sm hairline">
              <span className="font-semibold text-accent-deep block font-mono">3. Maximum Price Value</span>
              <p className="text-muted mt-0.5">
                The lowest priced alternative provides the highest performance per Rupee spent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="surface-card rounded-md overflow-hidden hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-bg hairline-b">
                <th className="p-4 w-44 text-xs font-mono text-muted uppercase">Specification</th>
                {displayItems.map((p) => (
                  <th key={p.id} className="p-4 w-64 align-top hairline-l">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono text-muted uppercase">{p.brand}</span>
                        {comparisonList.some(item => item.id === p.id) && (
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="text-muted/60 hover:text-red-700 p-1"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="h-28 bg-surface rounded-sm hairline flex items-center justify-center p-2">
                        <img src={p.image} alt={p.model} className="max-h-24 object-contain" />
                      </div>

                      <div>
                        <Link 
                          to={`/product/${p.id}`}
                          className="text-xs font-semibold text-ink line-clamp-1 hover:text-accent-deep"
                        >
                          {p.model}
                        </Link>
                        <div className="text-sm font-mono font-semibold text-ink mt-1">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        className="w-full py-2 bg-ink hover:bg-accent-deep text-surface text-[11px] font-mono font-medium rounded-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-line text-xs font-mono">
              {/* Row 1: AI Match Score */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">AI Match Score</td>
                {displayItems.map((p) => {
                  const isWinner = p.aiScore === highestAiScore;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <span className={`px-2 py-0.5 rounded-sm inline-flex items-center gap-1 ${
                        isWinner ? 'bg-accent/20 text-accent-deep font-bold border border-accent/40' : 'text-ink'
                      }`}>
                        {p.aiScore}/100 {isWinner && '★ Top Match'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Processor / CPU */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">CPU & Benchmark</td>
                {displayItems.map((p) => {
                  const isWinner = p.processorScore === highestCpuScore;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <div className="font-medium text-ink">{p.processor}</div>
                      <span className={`text-[10px] mt-1 inline-block px-1.5 py-0.2 rounded ${
                        isWinner ? 'bg-emerald-800/15 text-emerald-800 font-semibold' : 'text-muted'
                      }`}>
                        Score: {p.processorScore}/100 {isWinner && '(Highest)'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: GPU Graphics */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">GPU Compute</td>
                {displayItems.map((p) => {
                  const isWinner = p.gpuScore === highestGpuScore;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <div className="font-medium text-ink">{p.gpu}</div>
                      <span className={`text-[10px] mt-1 inline-block px-1.5 py-0.2 rounded ${
                        isWinner ? 'bg-emerald-800/15 text-emerald-800 font-semibold' : 'text-muted'
                      }`}>
                        Score: {p.gpuScore}/100 {isWinner && '(Best Graphics)'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: RAM Memory */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">RAM Memory</td>
                {displayItems.map((p) => {
                  const isWinner = p.ramGb === highestRam;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <span className={isWinner ? 'text-emerald-800 font-bold' : 'text-ink'}>
                        {p.ram} {isWinner && '✓'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Storage */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Storage</td>
                {displayItems.map((p) => {
                  const isWinner = p.storageGb === highestStorage;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <span className={isWinner ? 'text-emerald-800 font-bold' : 'text-ink'}>
                        {p.storage} {isWinner && '✓'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Display */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Display & Refresh</td>
                {displayItems.map((p) => (
                  <td key={p.id} className="p-4 hairline-l text-ink">
                    {p.display}
                  </td>
                ))}
              </tr>

              {/* Row 7: Battery Life */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Battery Endurance</td>
                {displayItems.map((p) => {
                  const isWinner = p.specs.batteryHours === highestBatteryHours;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <span className={isWinner ? 'text-emerald-800 font-bold' : 'text-ink'}>
                        {p.specs.batteryHours} Hours ({p.battery}) {isWinner && '(Longest)'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 8: Weight */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Weight</td>
                {displayItems.map((p) => {
                  const isWinner = p.specs.weightKg === lowestWeightKg;
                  return (
                    <td key={p.id} className="p-4 hairline-l">
                      <span className={isWinner ? 'text-emerald-800 font-bold' : 'text-ink'}>
                        {p.weight} {isWinner && '(Lightest)'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 9: Reviews Rating */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Reviews Sentiment</td>
                {displayItems.map((p) => (
                  <td key={p.id} className="p-4 hairline-l text-ink">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>{p.rating} / 5</span>
                      <span className="text-muted">({p.reviewSummary.positivePct}% Positive)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 10: Stackable Bank Discount */}
              <tr className="hover:bg-bg/40">
                <td className="p-4 text-muted font-medium">Bank Savings</td>
                {displayItems.map((p) => (
                  <td key={p.id} className="p-4 hairline-l text-accent-deep">
                    Up to -₹{p.offers[0]?.instantDiscount.toLocaleString('en-IN')} (HDFC/SBI)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Laptop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
          />

          <div className="relative bg-surface rounded-sm hairline max-w-lg w-full p-6 space-y-4 shadow-2xl z-10 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 hairline-b">
              <h3 className="text-sm font-semibold text-ink font-mono uppercase">
                Add Laptop to Comparison
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              placeholder="Search model or brand (e.g. ASUS, Apple, Dell)..."
              className="w-full p-2.5 text-xs bg-bg rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent text-ink"
            />

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {availableToAdd.map((laptop) => (
                <div
                  key={laptop.id}
                  onClick={() => {
                    addToCompare(laptop);
                    setIsAddModalOpen(false);
                  }}
                  className="p-2.5 bg-bg hover:bg-accent/10 rounded-sm hairline hover:border-accent/30 cursor-pointer flex items-center justify-between transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={laptop.image} alt={laptop.model} className="w-8 h-8 object-contain" />
                    <div>
                      <span className="font-semibold text-ink">{laptop.model}</span>
                      <span className="text-[11px] text-muted block">{laptop.processor.split('(')[0]}</span>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-ink">
                    ₹{laptop.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

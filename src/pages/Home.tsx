import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Mic, 
  Award, 
  ShieldCheck, 
  TrendingDown, 
  Cpu, 
  Layers, 
  Tag, 
  CheckCircle2, 
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { AICommerceBrain } from '../components/AICommerceBrain';
import { LaptopCard } from '../components/LaptopCard';
import { LiveAgentTicker } from '../components/LiveAgentTicker';
import { useCommerce } from '../context/CommerceContext';
import { RANKING_CATEGORIES } from '../data/rankingCategories';

const PROMPT_SUGGESTIONS = [
  'AI & Data Science',
  'Programming',
  'Gaming',
  'College',
  'Content Creation',
  'Business',
  'Engineering'
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    setIsVoiceModalOpen, 
    updateProfile 
  } = useCommerce();

  const [promptInput, setPromptInput] = useState<string>(
    'I need a laptop under ₹70,000 for AI and Data Science, Python, Jupyter, VS Code and occasional gaming.'
  );

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      setSearchQuery(promptInput);
      updateProfile({ purpose: promptInput });
      navigate('/rankings');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const fullPrompt = `I need the best laptop for ${suggestion} under ₹70,000 with 16GB RAM`;
    setPromptInput(fullPrompt);
    setSearchQuery(fullPrompt);
    updateProfile({ purpose: suggestion });
    navigate('/rankings');
  };

  // Top 3 Spotlighted Laptops
  const featuredLaptops = products.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Asymmetric Typography & Intent */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Subtitle Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent/10 border border-accent/25 text-accent-deep text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Autonomous Multi-Agent Commerce Engine</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-fluid-hero font-light text-ink tracking-tight">
                Find the laptop<br />
                <span className="font-medium text-accent-deep">that fits you.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-muted max-w-xl font-normal leading-relaxed">
                CommercePilot AI compares performance, reviews, prices and offers across stores, then explains why one laptop fits your needs best.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/ai-finder"
                  className="py-3.5 px-6 rounded-sm bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                  <span>Find my laptop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/rankings"
                  className="py-3.5 px-6 rounded-sm bg-surface hover:bg-muted/10 text-ink text-xs font-semibold uppercase tracking-wider font-mono hairline transition-all duration-200"
                >
                  Explore rankings
                </Link>

                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="py-3.5 px-4 rounded-sm bg-accent/15 border border-accent/30 text-accent-deep text-xs font-mono font-medium hover:bg-accent/25 transition-all flex items-center gap-1.5"
                >
                  <Mic className="w-3.5 h-3.5 text-accent" />
                  <span>Voice Prompt</span>
                </button>
              </div>

              {/* Trust & Guarantee Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  <span>5 Stores Cross-Checked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  <span>Stackable Bank Offers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  <span>No Sponsored Bias</span>
                </div>
              </div>
            </div>

            {/* Right Column: Animated AI Commerce Brain */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <AICommerceBrain />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PROMPT BOX: "Tell AI what you need" */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-card rounded-md p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 hairline-b">
            <div>
              <h2 className="text-fluid-heading font-normal text-ink">
                Tell AI what you need.
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Describe your workload, college subjects, tools, budget or specific game requirements
              </p>
            </div>
            <span className="text-[11px] font-mono text-accent-deep bg-accent/10 px-2.5 py-1 rounded self-start sm:self-auto">
              Natural Language Intent Engine
            </span>
          </div>

          {/* Text Input Form */}
          <form onSubmit={handlePromptSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                placeholder="E.g. I need a laptop under ₹70,000 for Python, Jupyter, VS Code and occasional gaming..."
                className="w-full p-4 text-sm bg-bg rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent text-ink placeholder:text-muted/60 resize-none font-sans"
              />
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="absolute right-3 bottom-3 p-2 bg-surface hover:bg-accent/15 text-accent-deep rounded-sm hairline transition-colors flex items-center gap-1 text-xs font-mono"
                title="Voice input"
              >
                <Mic className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Voice</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-muted font-mono mr-1">Suggestions:</span>
              {PROMPT_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="px-2.5 py-1 rounded-sm bg-bg hover:bg-accent/15 hairline hover:border-accent/30 text-xs text-ink transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all duration-200 flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-surface" />
                <span>Analyze my needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. MULTI-AGENT COMMERCE WORKFLOW (7-Agent Pipeline Overview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent-deep">
              Agentic Intelligence
            </span>
            <h2 className="text-fluid-title font-light text-ink mt-1">
              How CommercePilot Decides
            </h2>
          </div>
          <Link
            to="/agents"
            className="text-xs font-mono text-accent-deep hover:underline flex items-center gap-1"
          >
            Explore all 10 Autonomous Agents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card p-5 rounded-sm space-y-3">
            <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink">1. Intent Extraction</h3>
            <p className="text-xs text-muted leading-relaxed">
              Deconstructs natural user language into hardware parameters: RAM capacity, IPC benchmarks, and budget tolerances.
            </p>
          </div>

          <div className="surface-card p-5 rounded-sm space-y-3">
            <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink">2. Price Intelligence</h3>
            <p className="text-xs text-muted leading-relaxed">
              Scans Amazon, Flipkart, Croma, Reliance Digital, and Brand Stores in real time to locate true price arbitrage.
            </p>
          </div>

          <div className="surface-card p-5 rounded-sm space-y-3">
            <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink">3. Bank & Coupon Stacking</h3>
            <p className="text-xs text-muted leading-relaxed">
              Automatically applies HDFC, SBI, and ICICI instant credit discounts, coupons, and old laptop exchange estimates.
            </p>
          </div>

          <div className="surface-card p-5 rounded-sm space-y-3">
            <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-ink">4. Transparent Ranking</h3>
            <p className="text-xs text-muted leading-relaxed">
              Provides measurable weighted match factors and clear plain-English reasons why one laptop wins over another.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED TOP AI MATCHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent-deep">
              Curated Recommendations
            </span>
            <h2 className="text-fluid-title font-light text-ink mt-1">
              Top AI Matches Today
            </h2>
          </div>
          <Link
            to="/rankings"
            className="text-xs font-mono text-accent-deep hover:underline flex items-center gap-1"
          >
            View all 12 ranking categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLaptops.map((product, idx) => (
            <LaptopCard
              key={product.id}
              product={product}
              rank={idx + 1}
              highlightRank={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* 5. LIVE COMMERCE EVENT STREAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveAgentTicker />
      </section>
    </div>
  );
};

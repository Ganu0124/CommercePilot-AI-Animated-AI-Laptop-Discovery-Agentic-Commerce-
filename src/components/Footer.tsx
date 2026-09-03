import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface hairline-t mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand & Mission Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-surface">
                <Sparkles className="w-3.5 h-3.5 text-surface" />
              </div>
              <span className="font-semibold text-base text-ink tracking-tight">
                CommercePilot <span className="text-xs font-mono font-normal text-muted">AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              Find the right laptop. See the real price. Let AI decide.
              Autonomous multi-agent commerce platform with real-time price intelligence and personalized ranking.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-accent/10 border border-accent/20 text-accent-deep text-[11px] font-mono">
                <Cpu className="w-3 h-3" />
                Track 1: AI Growth & Agentic Commerce
              </span>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
              AI Discovery
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/ai-finder" className="hover:text-ink transition-colors flex items-center gap-1">
                  AI Laptop Finder <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="hover:text-ink transition-colors">
                  AI Match Rankings
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-ink transition-colors">
                  Multi-Store Catalog
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-ink transition-colors">
                  4-Way Specification Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Agentic Commerce */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
              Autonomous Agents
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/agents" className="hover:text-ink transition-colors flex items-center gap-1">
                  10 Commerce Agents Hub <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/growth" className="hover:text-ink transition-colors">
                  Merchant Growth Dashboard
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-ink transition-colors text-accent-deep font-medium">
                  5-Minute Hackathon Demo
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-ink transition-colors">
                  Customer Personalization
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Fintech / Commerce Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
              Intelligence Stack
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Real-time multi-marketplace parity across Amazon, Flipkart, Croma, Reliance Digital, and Brand Stores with instant HDFC, SBI, ICICI bank discount calculations.
            </p>
            <div className="pt-2 text-[11px] font-mono text-muted flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Verified simulated telemetry</span>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="mt-12 pt-6 hairline-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 CommercePilot AI. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Bricolage Grotesque Typography</span>
            <span>•</span>
            <span>Fewer Stone Design Philosophy</span>
            <span>•</span>
            <span className="text-accent-deep font-medium">Multi-Agent Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

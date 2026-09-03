import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Layers, 
  Compass, 
  Search, 
  MessageSquareText, 
  TrendingDown, 
  Tag, 
  Award, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  HeartHandshake 
} from 'lucide-react';
import { COMMERCE_AGENTS } from '../data/agents';
import { AICommerceBrain } from '../components/AICommerceBrain';
import { LiveAgentTicker } from '../components/LiveAgentTicker';
import { CommerceAgent } from '../types';

export const AgentsPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<CommerceAgent>(COMMERCE_AGENTS[0]);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'intent-agent': return Compass;
      case 'product-agent': return Search;
      case 'review-agent': return MessageSquareText;
      case 'price-agent': return TrendingDown;
      case 'offer-agent': return Tag;
      case 'ranking-agent': return Award;
      case 'personalization-agent': return UserCheck;
      case 'checkout-agent': return CreditCard;
      case 'growth-agent': return TrendingUp;
      case 'retention-agent': return HeartHandshake;
      default: return Bot;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
              <Bot className="w-3.5 h-3.5" />
              <span>Multi-Agent Swarm Architecture</span>
            </div>
            <h1 className="text-fluid-title font-light text-ink">
              CommercePilot agents
            </h1>
            <p className="text-xs text-muted mt-1">
              Autonomous specialized AI agents collaborating in real time to discover, evaluate, and transact commerce.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="p-2.5 bg-bg rounded-sm hairline text-center">
              <span className="text-[10px] text-muted block uppercase">Active Swarm</span>
              <span className="font-semibold text-emerald-800">10 / 10 Online</span>
            </div>
            <div className="p-2.5 bg-bg rounded-sm hairline text-center">
              <span className="text-[10px] text-muted block uppercase">Avg Latency</span>
              <span className="font-semibold text-ink">184 ms</span>
            </div>
            <div className="p-2.5 bg-bg rounded-sm hairline text-center">
              <span className="text-[10px] text-muted block uppercase">Precision</span>
              <span className="font-semibold text-accent-deep">99.4%</span>
            </div>
          </div>
        </div>

        {/* Operational Brain Visual Section */}
        <div className="pt-2">
          <AICommerceBrain />
        </div>
      </div>

      {/* 2. Interactive Agent Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-fluid-heading font-light text-ink">
            Autonomous Agent Fleet
          </h2>
          <span className="text-xs font-mono text-muted">
            Click any agent to inspect operational telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMERCE_AGENTS.map((agent) => {
            const IconComp = getAgentIcon(agent.id);
            const isSelected = selectedAgent.id === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`surface-card rounded-sm p-5 space-y-4 cursor-pointer transition-all hover:border-accent/50 ${
                  isSelected ? 'ring-1 ring-accent bg-accent/5' : 'bg-surface'
                }`}
              >
                {/* Agent Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink font-mono">{agent.name}</h3>
                      <span className="text-[10px] font-mono text-muted block">{agent.role}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-800/10 text-emerald-800 border border-emerald-800/20">
                    {agent.status}
                  </span>
                </div>

                {/* Purpose */}
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {agent.purpose}
                </p>

                {/* Recent Action */}
                <div className="p-2.5 bg-bg rounded-sm hairline text-xs space-y-1">
                  <span className="text-[10px] font-mono text-accent-deep font-semibold uppercase block">
                    Recent Action:
                  </span>
                  <p className="text-[11px] text-ink font-mono line-clamp-2">
                    {agent.recentAction}
                  </p>
                </div>

                {/* Telemetry Footer */}
                <div className="pt-2 hairline-t flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>Success: <strong className="text-ink">{agent.successRate}%</strong></span>
                  <span>Latency: <strong className="text-ink">{agent.latencyMs}ms</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Agent Deep-Dive Panel */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 hairline-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-accent/20 flex items-center justify-center text-accent-deep">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink font-mono">
                {selectedAgent.name} Operational Details
              </h3>
              <span className="text-xs text-muted">{selectedAgent.role}</span>
            </div>
          </div>
          <span className="text-xs font-mono text-accent-deep bg-accent/10 px-2.5 py-1 rounded">
            Autonomous Microservice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Inputs & Data Ingestion */}
          <div className="space-y-3">
            <h4 className="font-mono font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent-deep" />
              Inputs & Telemetry Streams
            </h4>
            <div className="space-y-1.5">
              {selectedAgent.inputs.map((inp, idx) => (
                <div key={idx} className="p-2.5 bg-bg rounded-sm hairline font-mono text-ink">
                  • {inp}
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Algorithms */}
          <div className="space-y-3">
            <h4 className="font-mono font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-accent-deep" />
              Assigned Tools & Decision Models
            </h4>
            <div className="space-y-1.5">
              {selectedAgent.tools.map((tool, idx) => (
                <div key={idx} className="p-2.5 bg-bg rounded-sm hairline font-mono text-ink">
                  ⚡ {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Result Summary */}
        <div className="p-4 bg-bg rounded-sm hairline space-y-1">
          <span className="text-[10px] font-mono text-muted uppercase block">Last Verified Result</span>
          <p className="text-xs font-mono text-ink leading-relaxed">
            {selectedAgent.lastResult}
          </p>
        </div>
      </div>

      {/* 4. Live Operational Event Stream */}
      <LiveAgentTicker />
    </div>
  );
};

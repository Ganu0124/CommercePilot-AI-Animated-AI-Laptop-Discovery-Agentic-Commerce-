import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShoppingBag, 
  Sparkles, 
  Users, 
  ArrowUpRight, 
  Play, 
  CheckCircle2, 
  Layers, 
  Send, 
  Bot, 
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { 
  GROWTH_KPIS, 
  GROWTH_OPPORTUNITIES, 
  CUSTOMER_JOURNEY_STEPS, 
  REVENUE_TIMELINE,
  GrowthOpportunity 
} from '../data/growthMetrics';
import { useCommerce } from '../context/CommerceContext';
import { CampaignSimulation } from '../types';

export const GrowthPage: React.FC = () => {
  const { campaigns, approveCampaign, simulateNewCampaign } = useCommerce();

  const [selectedOpp, setSelectedOpp] = useState<GrowthOpportunity | null>(null);
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(1);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState<boolean>(false);

  // New campaign modal form fields
  const [campName, setCampName] = useState('High-Intent Python Developer Blast');
  const [campGoal, setCampGoal] = useState('Boost AI Laptop conversions');
  const [campBudget, setCampBudget] = useState(50000);
  const [campChannel, setCampChannel] = useState<'WhatsApp + Email' | 'WhatsApp' | 'Email' | 'In-App Push'>('WhatsApp + Email');

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateNewCampaign({
      name: campName,
      goal: campGoal,
      budget: campBudget,
      channel: campChannel,
      estimatedRoi: 5.8,
      expectedConversionLift: 18.4,
      status: 'simulated'
    });
    setIsNewCampaignModalOpen(false);
  };

  const currentJourney = CUSTOMER_JOURNEY_STEPS.find(s => s.step === activeJourneyStep) || CUSTOMER_JOURNEY_STEPS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Merchant Growth & Demand Telemetry</span>
            </div>
            <h1 className="text-fluid-title font-light text-ink">
              Growth, guided by AI.
            </h1>
            <p className="text-xs text-muted mt-1">
              Autonomous commerce intelligence turning shopper discovery signals into targeted revenue.
            </p>
          </div>

          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="py-2.5 px-4 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Campaign with AI</span>
          </button>
        </div>

        {/* 2. Key Metrics Grid (Fewer Style Clean Numbers) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-4 bg-bg rounded-sm hairline">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Total Revenue
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-ink font-mono mt-1">
              {GROWTH_KPIS.revenue}
            </div>
            <span className="text-[11px] font-mono text-emerald-800 mt-0.5 block">
              +14.2% MoM
            </span>
          </div>

          <div className="p-4 bg-bg rounded-sm hairline">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Conversion Rate
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-ink font-mono mt-1">
              {GROWTH_KPIS.conversionRate}
            </div>
            <span className="text-[11px] font-mono text-accent-deep mt-0.5 block">
              vs 2.4% industry avg
            </span>
          </div>

          <div className="p-4 bg-bg rounded-sm hairline">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Avg Order Value
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-ink font-mono mt-1">
              {GROWTH_KPIS.avgOrderValue}
            </div>
            <span className="text-[11px] font-mono text-emerald-800 mt-0.5 block">
              +8.1% basket uplift
            </span>
          </div>

          <div className="p-4 bg-bg rounded-sm hairline">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              AI-Assisted Revenue
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-accent-deep font-mono mt-1">
              {GROWTH_KPIS.aiAssistedRevenue}
            </div>
            <span className="text-[11px] font-mono text-muted mt-0.5 block">
              25.8% of total volume
            </span>
          </div>

          <div className="p-4 bg-bg rounded-sm hairline col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Repeat Customers
            </span>
            <div className="text-xl sm:text-2xl font-semibold text-ink font-mono mt-1">
              {GROWTH_KPIS.repeatCustomers}
            </div>
            <span className="text-[11px] font-mono text-emerald-800 mt-0.5 block">
              30-day retention
            </span>
          </div>
        </div>

        {/* Monthly Revenue Progression Chart */}
        <div className="pt-4 hairline-t space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-ink font-semibold uppercase tracking-wider">
              Organic vs AI-Assisted Revenue Growth (₹ Lakhs)
            </span>
            <div className="flex items-center gap-4 text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-muted/40" />
                Organic (₹18.4L)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-accent-deep" />
                AI Assisted (₹6.4L)
              </span>
            </div>
          </div>

          {/* Minimal Bar Chart */}
          <div className="p-4 bg-bg rounded-sm hairline flex items-end justify-between h-36 gap-3">
            {REVENUE_TIMELINE.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end gap-1 justify-center h-24">
                  {/* Organic Bar */}
                  <div
                    style={{ height: `${(item.organic / 20) * 100}%` }}
                    className="w-1/2 max-w-[20px] bg-muted/30 rounded-xs"
                    title={`Organic: ₹${item.organic}L`}
                  />
                  {/* AI Bar */}
                  <div
                    style={{ height: `${(item.aiAssisted / 20) * 100}%` }}
                    className="w-1/2 max-w-[20px] bg-accent-deep rounded-xs"
                    title={`AI Assisted: ₹${item.aiAssisted}L`}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. AI Growth Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-fluid-heading font-light text-ink">
            Autonomous Growth Opportunities
          </h2>
          <span className="text-xs font-mono text-muted">
            Proactively identified from shopper drop-off telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GROWTH_OPPORTUNITIES.map((opp) => (
            <div
              key={opp.id}
              className="surface-card rounded-sm p-5 flex flex-col justify-between space-y-4 hover:border-accent/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent-deep px-2 py-0.5 rounded">
                    {opp.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-800">
                    {opp.expectedImpact}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-ink leading-snug">
                  "{opp.title}"
                </h3>

                <p className="text-xs text-muted leading-relaxed">
                  {opp.description}
                </p>

                <div className="p-3 bg-bg rounded-sm hairline space-y-1">
                  <span className="text-[10px] font-mono text-muted uppercase block">Estimated Pipeline Opportunity</span>
                  <div className="text-base font-semibold text-accent-deep font-mono">
                    {opp.estimatedOpportunity}
                  </div>
                </div>

                <div className="text-xs text-ink">
                  <span className="font-semibold text-accent-deep block font-mono">AI Recommendation:</span>
                  <p className="text-muted mt-0.5">{opp.aiRecommendation}</p>
                </div>
              </div>

              <div className="pt-3 hairline-t flex gap-2">
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="flex-1 py-2 px-3 bg-bg hover:bg-muted/10 hairline text-ink text-xs font-mono rounded-sm transition-colors text-center"
                >
                  Review Action
                </button>
                <button
                  onClick={() => {
                    simulateNewCampaign(opp.campaignDraft);
                    alert(`Campaign "${opp.campaignDraft.name}" simulated! Check the Active Campaigns below.`);
                  }}
                  className="flex-1 py-2 px-3 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold rounded-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Simulate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active & Simulated Autonomous Campaigns */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 hairline-b">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-accent-deep" />
            <h3 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
              Autonomous Campaign Queue ({campaigns.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-muted">Simulated Demo Engine</span>
        </div>

        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 bg-bg rounded-sm hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink font-mono text-sm">{camp.name}</span>
                  <span className={`px-2 py-0.2 rounded-xs font-mono text-[10px] uppercase ${
                    camp.status === 'approved' 
                      ? 'bg-emerald-800/15 text-emerald-800' 
                      : 'bg-amber-800/15 text-amber-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-muted text-[11px]">{camp.audience} • Channel: {camp.channel}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-right font-mono">
                <div>
                  <span className="text-[10px] text-muted block uppercase">Budget</span>
                  <span className="font-semibold text-ink">₹{camp.budget.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase">Est. ROI</span>
                  <span className="font-semibold text-accent-deep">{camp.estimatedRoi}x</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase">Conv. Lift</span>
                  <span className="font-semibold text-emerald-800">+{camp.expectedConversionLift}%</span>
                </div>

                {camp.status !== 'approved' ? (
                  <button
                    onClick={() => approveCampaign(camp.id)}
                    className="py-2 px-3.5 bg-ink hover:bg-accent-deep text-surface font-semibold rounded-sm transition-colors text-[11px]"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Running
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 10-Step Interactive Customer Journey Map */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-deep" />
            <h3 className="text-base font-semibold text-ink">
              10-Step Agentic Commerce Customer Journey
            </h3>
          </div>
          <p className="text-xs text-muted mt-1">
            Click each journey stage to observe how autonomous agents eliminate friction and log merchant growth signals.
          </p>
        </div>

        {/* Step Numbers Ticker */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {CUSTOMER_JOURNEY_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveJourneyStep(s.step)}
              className={`p-2 rounded-sm text-center text-xs font-mono hairline transition-all ${
                activeJourneyStep === s.step
                  ? 'bg-ink text-surface border-ink font-semibold shadow-xs'
                  : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              <div className="text-[10px] opacity-75">{s.step}</div>
              <div className="truncate text-[11px] mt-0.5">{s.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Step Detail Box */}
        <div className="p-5 bg-bg rounded-sm hairline space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent-deep flex items-center justify-center font-mono font-bold text-xs">
                {currentJourney.step}
              </span>
              <h4 className="text-sm font-semibold text-ink font-mono">
                Stage: {currentJourney.name} ({currentJourney.agentRole})
              </h4>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-800/10 px-2 py-0.5 rounded">
              Metric: {currentJourney.conversionMetric}
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            {currentJourney.description}
          </p>

          <div className="p-3 bg-surface rounded-sm hairline space-y-1">
            <span className="text-[10px] font-mono text-accent-deep font-semibold uppercase block">
              Active Agent Action ({currentJourney.agentName}):
            </span>
            <p className="text-xs text-ink font-mono">
              "{currentJourney.aiAction}"
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Builder Modal */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsNewCampaignModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
          />

          <div className="relative bg-surface rounded-sm hairline max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl z-10 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-ink font-mono uppercase">
                  Create Autonomous Campaign with AI
                </h3>
              </div>
              <button onClick={() => setIsNewCampaignModalOpen(false)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-muted block mb-1">Campaign Goal</label>
                <input
                  type="text"
                  value={campGoal}
                  onChange={(e) => setCampGoal(e.target.value)}
                  className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-muted block mb-1">Audience Target</label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted block mb-1">Channel</label>
                  <select
                    value={campChannel}
                    onChange={(e) => setCampChannel(e.target.value as any)}
                    className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none"
                  >
                    <option value="WhatsApp + Email">WhatsApp + Email</option>
                    <option value="WhatsApp">WhatsApp Only</option>
                    <option value="Email">Email Only</option>
                    <option value="In-App Push">In-App Push</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={campBudget}
                    onChange={(e) => setCampBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-accent/10 border border-accent/30 rounded-sm space-y-1">
                <span className="text-accent-deep font-semibold block">AI Projected ROI: 5.8x</span>
                <span className="text-muted block text-[11px]">Expected conversion lift: +18.4% across 2,400 customers</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="flex-1 py-2.5 bg-bg hover:bg-muted/10 text-ink rounded-sm hairline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-ink hover:bg-accent-deep text-surface font-semibold rounded-sm"
                >
                  Simulate Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Bot, 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  Layers, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

const PURPOSES = [
  { id: 'ai_ds', label: 'AI & Data Science', desc: 'Python, Jupyter, VS Code, TensorFlow, PyTorch' },
  { id: 'coding', label: 'Programming', desc: 'Web development, Docker, Java, C++, Mobile apps' },
  { id: 'gaming', label: 'Gaming', desc: 'High FPS esports, AAA titles, high refresh rate' },
  { id: 'college', label: 'College', desc: 'Engineering assignments, coursework, long battery' },
  { id: 'creator', label: 'Content Creation', desc: '4K Video editing, Blender 3D, Photoshop, OLED' },
  { id: 'business', label: 'Business', desc: 'Sleek design, meetings, enterprise security' },
  { id: 'everyday', label: 'Everyday use', desc: 'Browsing, streaming, MS Office, lightweight' }
];

const BUDGETS = [
  { id: 40000, label: '₹40K', desc: 'Entry budget essentials' },
  { id: 50000, label: '₹50K', desc: 'Student sweet spot' },
  { id: 60000, label: '₹60K', desc: 'Core productivity' },
  { id: 70000, label: '₹70K', desc: 'AI & Coding balance' },
  { id: 80000, label: '₹80K', desc: 'Dedicated GPU entry' },
  { id: 100000, label: '₹1L+', desc: 'Premium workstation' }
];

const PRIORITIES = [
  { id: 'cpu', label: 'CPU Performance' },
  { id: 'gpu', label: 'GPU (Graphics)' },
  { id: 'ram', label: 'RAM Memory (16GB+)' },
  { id: 'battery', label: 'Long Battery Life' },
  { id: 'display', label: 'Display (OLED / High Hz)' },
  { id: 'portability', label: 'Portability (Lightweight)' },
  { id: 'build', label: 'Build Quality' },
  { id: 'storage', label: 'Storage (1TB SSD)' },
  { id: 'reviews', label: 'Verified Reviews' },
  { id: 'price', label: 'Maximum Price Value' }
];

const BRANDS = ['Any Brand', 'Apple', 'ASUS', 'Lenovo', 'HP', 'Dell', 'Acer', 'Samsung', 'MSI'];

const AGENT_PIPELINE_STEPS = [
  { id: 'intent', name: 'Intent Agent', role: 'Extracting semantic hardware requirements' },
  { id: 'product', name: 'Product Agent', role: 'Searching & deduplicating 60+ multi-store laptops' },
  { id: 'review', name: 'Review Agent', role: 'Synthesizing 18,000+ verified user feedback points' },
  { id: 'price', name: 'Price Agent', role: 'Comparing Amazon, Flipkart, Croma & Reliance' },
  { id: 'offer', name: 'Offer Agent', role: 'Calculating stackable HDFC/SBI bank discounts' },
  { id: 'ranking', name: 'Ranking Agent', role: 'Computing multi-factor weighted match matrix' },
  { id: 'recommendation', name: 'Recommendation Agent', role: 'Selecting #1 Best Fit with decision explanation' }
];

export const AIFinder: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, updateWeights } = useCommerce();

  const [step, setStep] = useState<number>(1);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('ai_ds');
  const [selectedBudget, setSelectedBudget] = useState<number>(70000);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['cpu', 'ram', 'price']);
  const [selectedBrand, setSelectedBrand] = useState<string>('Any Brand');
  const [preferredOs, setPreferredOs] = useState<'any' | 'windows' | 'mac'>('any');

  // Agent Pipeline Execution State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0);

  const togglePriority = (id: string) => {
    setSelectedPriorities(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setActiveAgentIndex(0);

    // Save profile to context
    const purposeName = PURPOSES.find(p => p.id === selectedPurpose)?.label || 'AI & Data Science';
    updateProfile({
      purpose: purposeName,
      budgetMax: selectedBudget,
      preferredBrands: selectedBrand === 'Any Brand' ? [] : [selectedBrand],
      gamingImportance: selectedPriorities.includes('gpu') ? 'hardcore' : 'casual',
      batteryImportance: selectedPriorities.includes('battery') ? 'high' : 'normal'
    });

    // Custom weight allocation based on priorities
    updateWeights({
      performance: selectedPriorities.includes('cpu') ? 30 : 20,
      ram: selectedPriorities.includes('ram') ? 25 : 15,
      price: selectedPriorities.includes('price') ? 25 : 15,
      battery: selectedPriorities.includes('battery') ? 20 : 5,
      gpu: selectedPriorities.includes('gpu') ? 20 : 5,
      display: selectedPriorities.includes('display') ? 15 : 5
    });
  };

  // Cinematic pipeline stepping
  useEffect(() => {
    if (!isAnalyzing) return;

    if (activeAgentIndex < AGENT_PIPELINE_STEPS.length) {
      const timer = setTimeout(() => {
        setActiveAgentIndex(prev => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        navigate('/rankings');
      }, 600);
      return () => clearTimeout(finishTimer);
    }
  }, [isAnalyzing, activeAgentIndex, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Container Box */}
      <div className="surface-card rounded-md p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Step Indicator / Header */}
        {!isAnalyzing && (
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
              <span>STEP {step} OF 4</span>
              <span>{Math.round((step / 4) * 100)}% COMPLETE</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-bg rounded-full hairline overflow-hidden">
              <div
                style={{ width: `${(step / 4) * 100}%` }}
                className="h-full bg-accent-deep transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* STEP 1: What are you buying it for? */}
        {!isAnalyzing && step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">Step 1</span>
              <h2 className="text-fluid-title font-light text-ink mt-1">
                What are you buying it for?
              </h2>
              <p className="text-xs text-muted mt-1">
                Select your primary workload to calibrate baseline memory and processor scores
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PURPOSES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPurpose(item.id)}
                  className={`p-4 rounded-sm hairline text-left transition-all ${
                    selectedPurpose === item.id
                      ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                      : 'bg-bg hover:bg-surface text-ink/80 hover:border-line'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">{item.label}</span>
                    {selectedPurpose === item.id && (
                      <Check className="w-4 h-4 text-accent-deep" />
                    )}
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 hairline-t">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all flex items-center gap-2"
              >
                <span>Continue to Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: What's your budget? */}
        {!isAnalyzing && step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">Step 2</span>
              <h2 className="text-fluid-title font-light text-ink mt-1">
                What's your maximum budget?
              </h2>
              <p className="text-xs text-muted mt-1">
                We'll factor in instant bank discounts and store coupons to maximize your buying power
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUDGETS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedBudget(item.id)}
                  className={`p-4 rounded-sm hairline text-left transition-all ${
                    selectedBudget === item.id
                      ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                      : 'bg-bg hover:bg-surface text-ink/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-ink font-mono">{item.label}</span>
                    {selectedBudget === item.id && (
                      <Check className="w-4 h-4 text-accent-deep" />
                    )}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all flex items-center gap-2"
              >
                <span>Continue to Priorities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: What's important? */}
        {!isAnalyzing && step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">Step 3</span>
              <h2 className="text-fluid-title font-light text-ink mt-1">
                What's most important to you?
              </h2>
              <p className="text-xs text-muted mt-1">
                Pick up to 4 priorities to customize the AI ranking weights
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {PRIORITIES.map((item) => {
                const isSelected = selectedPriorities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => togglePriority(item.id)}
                    className={`p-3.5 rounded-sm hairline text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                        : 'bg-bg hover:bg-surface text-ink/80'
                    }`}
                  >
                    <span className="text-xs font-medium text-ink">{item.label}</span>
                    <div className={`w-4 h-4 rounded-xs hairline flex items-center justify-center ${
                      isSelected ? 'bg-accent text-surface' : 'bg-surface'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all flex items-center gap-2"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Any preferences? */}
        {!isAnalyzing && step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">Step 4</span>
              <h2 className="text-fluid-title font-light text-ink mt-1">
                Any specific preferences?
              </h2>
              <p className="text-xs text-muted mt-1">
                Narrow by manufacturer or operating system if you have specific requirements
              </p>
            </div>

            <div className="space-y-4">
              {/* Brand Selector */}
              <div>
                <label className="text-xs font-mono text-muted uppercase block mb-2">Preferred Brand</label>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all hairline ${
                        selectedBrand === brand
                          ? 'bg-accent text-surface border-accent'
                          : 'bg-bg hover:bg-surface text-ink'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* OS Selector */}
              <div>
                <label className="text-xs font-mono text-muted uppercase block mb-2">Operating System</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'any', label: 'Any OS (Windows / macOS)' },
                    { id: 'windows', label: 'Windows Only' },
                    { id: 'mac', label: 'macOS (Apple Silicon)' }
                  ].map((os) => (
                    <button
                      key={os.id}
                      type="button"
                      onClick={() => setPreferredOs(os.id as any)}
                      className={`p-3 rounded-sm text-xs font-medium text-center hairline transition-all ${
                        preferredOs === os.id
                          ? 'bg-accent/15 border-accent text-ink font-semibold'
                          : 'bg-bg hover:bg-surface text-ink'
                      }`}
                    >
                      {os.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleStartAnalysis}
                className="py-3.5 px-8 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-surface" />
                <span>Run 7-Agent Commerce Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CINEMATIC 7-AGENT ANALYSIS PIPELINE */}
        {isAnalyzing && (
          <div className="py-8 space-y-8 text-center animate-in fade-in duration-300">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center text-accent-deep mx-auto">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-light text-ink">
                AI is analyzing your requirements...
              </h3>
              <p className="text-xs text-muted">
                Coordinating multi-agent research across 5 stores and benchmark matrices
              </p>
            </div>

            {/* 7 Agents List */}
            <div className="max-w-lg mx-auto space-y-2.5 text-left">
              {AGENT_PIPELINE_STEPS.map((agent, index) => {
                const isDone = index < activeAgentIndex;
                const isCurrent = index === activeAgentIndex;
                const isWaiting = index > activeAgentIndex;

                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-sm hairline transition-all flex items-center justify-between text-xs ${
                      isCurrent
                        ? 'bg-accent/20 border-accent shadow-xs scale-[1.02]'
                        : isDone
                        ? 'bg-surface border-line/60 opacity-90'
                        : 'bg-bg/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        ) : (
                          <span className="text-muted">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-ink font-mono">{agent.name}</span>
                        <p className="text-[11px] text-muted">{agent.role}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${
                      isDone 
                        ? 'bg-emerald-800/10 text-emerald-800' 
                        : isCurrent 
                        ? 'bg-accent text-surface animate-pulse' 
                        : 'text-muted'
                    }`}>
                      {isDone ? 'Complete' : isCurrent ? 'Analyzing...' : 'Waiting'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  RefreshCw,
  Search,
  Sliders,
  Star,
  Scale,
  ShoppingBag,
  Tag,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Terminal,
  Atom,
  Palette,
  Stethoscope,
  BookOpen,
  Binary,
  Briefcase,
  Zap,
  Info
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { trackEvent } from '../lib/posthog';
import {
  EDUCATION_CATEGORIES,
  DEGREE_SPECIALIZATIONS,
  WORKLOAD_OPTIONS,
  HARDWARE_OPTIONS,
  BUDGET_TIERS,
  calculateLaptopRecommendations,
  RecommendedLaptopItem,
  RecommendationScores
} from '../data/courseLaptopIntelligence';

const AGENT_PIPELINE_STEPS = [
  { id: 'intent', name: 'Course Intent Agent', role: 'Mapping Indian academic curriculum to hardware baselines' },
  { id: 'specialization', name: 'Specialization Agent', role: 'Calibrating compiler, simulation & compute requirements' },
  { id: 'workload', name: 'Workload Matrix Agent', role: 'Allocating dedicated GPU, VRAM & multi-core thread weights' },
  { id: 'product', name: 'Catalog Engine Agent', role: 'Scanning & filtering 60+ verified laptops across 5 retailers' },
  { id: 'price', name: 'Price & Offer Agent', role: 'Factoring HDFC/SBI bank discounts & coupon redemptions' },
  { id: 'ranking', name: 'Multi-Factor Decision Agent', role: 'Synthesizing Course Fit, Performance & Value scores' },
  { id: 'recommendation', name: 'Recommendation Agent', role: 'Classifying Top 5 Archetypes (#1 Best Match to Budget Choice)' }
];

export const AIFinder: React.FC = () => {
  const navigate = useNavigate();
  const { products, updateProfile, updateWeights, addToCompare, isInCompare, addToCart } = useCommerce();

  // 6-step flow: 1 Education -> 2 Specialization -> 3 Workload -> 4 Hardware -> 5 Budget -> 6 Results
  const [step, setStep] = useState<number>(1);

  // Step 1: Education
  const [selectedCategory, setSelectedCategory] = useState<string>('computer_applications');
  const [selectedCourse, setSelectedCourse] = useState<string>('MCA');
  const [courseSearch, setCourseSearch] = useState<string>('');

  // Step 2: Specialization
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('AI & ML');

  // Step 3: Workload (multi-select)
  const [selectedWorkloads, setSelectedWorkloads] = useState<string[]>([
    'basic_programming',
    'advanced_programming',
    'data_science',
    'machine_learning'
  ]);

  // Step 4: Hardware
  const [selectedRam, setSelectedRam] = useState<string>('16 GB');
  const [selectedStorage, setSelectedStorage] = useState<string>('512 GB SSD');
  const [selectedGpu, setSelectedGpu] = useState<string>('RTX 3050');
  const [selectedCpu, setSelectedCpu] = useState<string>('Intel Core i5');
  const [selectedDisplaySize, setSelectedDisplaySize] = useState<string>('15.6"');
  const [selectedRefreshRate, setSelectedRefreshRate] = useState<string>('120Hz');
  const [batteryPriority, setBatteryPriority] = useState<string>('Balanced');
  const [portability, setPortability] = useState<string>('Balanced');

  // Step 5: Budget
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<string>('60k_70k');
  const [customBudget, setCustomBudget] = useState<number>(70000);

  // Cinematic Analysis & Step 6 Results State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0);
  const [recommendedResults, setRecommendedResults] = useState<{
    topFive: RecommendedLaptopItem[];
    overallMatchAvg: number;
    overallScores: RecommendationScores;
  } | null>(null);

  // Dynamically derive available specializations for selected course
  const currentSpecializations = useMemo(() => {
    if (DEGREE_SPECIALIZATIONS[selectedCourse]) {
      return DEGREE_SPECIALIZATIONS[selectedCourse];
    }
    // Fallback: search key matching
    const match = Object.keys(DEGREE_SPECIALIZATIONS).find(k => 
      selectedCourse.toLowerCase().includes(k.toLowerCase()) || 
      k.toLowerCase().includes(selectedCourse.toLowerCase())
    );
    if (match) return DEGREE_SPECIALIZATIONS[match];
    
    return [
      'Core Curriculum & Foundations',
      'Advanced Applied Computing',
      'Data Analytics & Modeling',
      'Project Work & Research',
      'Industry Internship Workloads'
    ];
  }, [selectedCourse]);

  // Auto-select valid specialization when course changes
  useEffect(() => {
    if (currentSpecializations.length > 0 && !currentSpecializations.includes(selectedSpecialization)) {
      setSelectedSpecialization(currentSpecializations[0]);
    }
  }, [currentSpecializations, selectedSpecialization]);

  // Handle course selection
  const handleSelectCourse = (courseName: string, categoryId: string) => {
    setSelectedCourse(courseName);
    setSelectedCategory(categoryId);
  };

  // Toggle workload multi-select
  const toggleWorkload = (workloadId: string) => {
    setSelectedWorkloads(prev => 
      prev.includes(workloadId)
        ? prev.filter(id => id !== workloadId)
        : [...prev, workloadId]
    );
  };

  // Handle budget tier change
  const handleBudgetTierSelect = (tierId: string, maxAmount: number) => {
    setSelectedBudgetTier(tierId);
    setCustomBudget(maxAmount);
  };

  // Trigger analysis and proceed to Step 6
  const handleRunRecommendation = () => {
    setIsAnalyzing(true);
    setActiveAgentIndex(0);

    const activeCategory = EDUCATION_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Engineering';

    // Telemetry
    trackEvent('ai_finder_recommendation_requested', {
      course: selectedCourse,
      category: activeCategory,
      specialization: selectedSpecialization,
      workload_count: selectedWorkloads.length,
      budget: customBudget,
      ram: selectedRam,
      gpu: selectedGpu
    });

    // Update global commerce profile & weights
    updateProfile({
      purpose: `${selectedCourse} (${selectedSpecialization})`,
      budgetMax: customBudget,
      gamingImportance: selectedWorkloads.includes('gaming') ? 'hardcore' : (selectedGpu.includes('RTX') ? 'casual' : 'none'),
      batteryImportance: batteryPriority.toLowerCase().includes('high') ? 'high' : 'normal'
    });

    // Weight allocation reflecting education priorities
    updateWeights({
      performance: selectedWorkloads.some(w => ['deep_learning', 'generative_ai', 'advanced_programming'].includes(w)) ? 30 : 20,
      gpu: selectedGpu.includes('RTX') || selectedWorkloads.some(w => ['3d_cad', 'gaming', 'video_editing'].includes(w)) ? 25 : 10,
      ram: parseInt(selectedRam) >= 16 ? 20 : 10,
      battery: batteryPriority.toLowerCase().includes('high') ? 20 : 10,
      price: 15,
      display: 10
    });
  };

  // Cinematic pipeline stepping
  useEffect(() => {
    if (!isAnalyzing) return;

    if (activeAgentIndex < AGENT_PIPELINE_STEPS.length) {
      const timer = setTimeout(() => {
        setActiveAgentIndex(prev => prev + 1);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        // Calculate recommendations
        const activeCategory = EDUCATION_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Engineering';
        const results = calculateLaptopRecommendations(
          {
            category: activeCategory,
            course: selectedCourse,
            specialization: selectedSpecialization,
            workloads: selectedWorkloads,
            ram: selectedRam,
            storage: selectedStorage,
            gpu: selectedGpu,
            cpu: selectedCpu,
            displaySize: selectedDisplaySize,
            refreshRate: selectedRefreshRate,
            batteryPriority,
            portability,
            budgetMax: customBudget
          },
          products
        );

        setRecommendedResults(results);
        setIsAnalyzing(false);
        setStep(6);
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [
    isAnalyzing, 
    activeAgentIndex, 
    selectedCategory, 
    selectedCourse, 
    selectedSpecialization, 
    selectedWorkloads, 
    selectedRam, 
    selectedStorage, 
    selectedGpu, 
    selectedCpu, 
    selectedDisplaySize, 
    selectedRefreshRate, 
    batteryPriority, 
    portability, 
    customBudget, 
    products
  ]);

  // Current category data
  const currentCategoryData = useMemo(() => {
    return EDUCATION_CATEGORIES.find(c => c.id === selectedCategory) || EDUCATION_CATEGORIES[0];
  }, [selectedCategory]);

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) {
      return currentCategoryData.courses;
    }
    const q = courseSearch.toLowerCase();
    return currentCategoryData.courses.filter(course => 
      course.toLowerCase().includes(q)
    );
  }, [courseSearch, currentCategoryData]);

  // Render Category Icon helper
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      case 'Atom': return <Atom className="w-4 h-4" />;
      case 'Palette': return <Palette className="w-4 h-4" />;
      case 'Stethoscope': return <Stethoscope className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Binary': return <Binary className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Main Container */}
      <div className="surface-card rounded-md p-5 sm:p-10 shadow-xs space-y-8 hairline">
        
        {/* Step Indicator & Header (Visible when not analyzing) */}
        {!isAnalyzing && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-xs bg-accent/15 text-accent-deep border border-accent/20">
                  STEP {step} OF 6
                </span>
                <span className="text-ink/70">
                  {step === 1 && 'Education & Degree Path'}
                  {step === 2 && 'Academic Specialization'}
                  {step === 3 && 'Technical Workloads'}
                  {step === 4 && 'Hardware Preferences'}
                  {step === 5 && 'Budget & Spending Range'}
                  {step === 6 && 'AI Match Results'}
                </span>
              </div>
              <span>{Math.round((step / 6) * 100)}% COMPLETE</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-bg rounded-full hairline overflow-hidden">
              <div
                style={{ width: `${(step / 6) * 100}%` }}
                className="h-full bg-accent-deep transition-all duration-300"
              />
            </div>

            {/* Main Header Title & Subtitle */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-ink tracking-tight font-sans">
                What are you buying it for?
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed font-sans max-w-2xl">
                Select your course, workload and technical requirements so AI can recommend the right laptop for you.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: SELECT YOUR EDUCATION / CAREER PATH                                */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
                  Step 1 • Education & Career Discipline
                </span>
                <span className="text-[11px] font-mono text-muted">
                  9 Categories • 60+ Recognized Degrees
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-normal text-ink mt-1">
                Select your primary education or career path
              </h2>
            </div>

            {/* Horizontal Category Pill Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none hairline-b">
              {EDUCATION_CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCourseSearch('');
                    }}
                    className={`px-3 py-2 rounded-xs text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 hairline ${
                      isActive
                        ? 'bg-ink text-surface border-ink shadow-xs'
                        : 'bg-bg/80 hover:bg-surface text-ink/80'
                    }`}
                  >
                    {renderCategoryIcon(cat.iconName)}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Description & Filter Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg/50 p-3 rounded-xs hairline">
              <div>
                <span className="text-xs font-semibold text-ink">{currentCategoryData.name}</span>
                <p className="text-[11px] text-muted">{currentCategoryData.description}</p>
              </div>

              {/* Search bar within courses */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder={`Filter ${currentCategoryData.name} courses...`}
                  className="w-full bg-surface text-ink text-xs pl-8 pr-3 py-1.5 rounded-xs hairline outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredCourses.map((courseName) => {
                const isSelected = selectedCourse === courseName;
                return (
                  <button
                    key={courseName}
                    onClick={() => handleSelectCourse(courseName, selectedCategory)}
                    className={`p-3.5 rounded-xs hairline text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                        : 'bg-surface hover:bg-bg/90 text-ink/80 hover:border-line'
                    }`}
                  >
                    <span className="text-xs font-medium text-ink pr-2">{courseName}</span>
                    <div className={`w-4 h-4 rounded-xs hairline flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-accent text-surface' : 'bg-bg'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 1 Footer Action */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <div className="text-xs text-muted">
                Selected: <span className="font-semibold text-ink">{selectedCourse}</span>
              </div>
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2"
              >
                <span>Continue to Specialization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SELECT YOUR SPECIALIZATION (DYNAMIC)                              */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
                Step 2 • Contextual Specialization
              </span>
              <h2 className="text-lg sm:text-xl font-normal text-ink mt-1">
                Select your track in <span className="font-semibold text-accent-deep">{selectedCourse}</span>
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                AI dynamically adapts compiler, rendering and simulation hardware targets for this specific field.
              </p>
            </div>

            {/* Specialization Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSpecializations.map((spec) => {
                const isSelected = selectedSpecialization === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`p-4 rounded-xs hairline text-left transition-all ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                        : 'bg-surface hover:bg-bg/80 text-ink/80 hover:border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-ink">{spec}</span>
                      <div className={`w-4 h-4 rounded-xs hairline flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-accent text-surface' : 'bg-bg'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted mt-1.5 font-mono">
                      Targeted for {selectedCourse} • {spec} academic & industry projects
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Step 2 Footer Navigation */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2"
              >
                <span>Continue to Workload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SELECT YOUR WORKLOAD (MULTI-SELECT)                               */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
                  Step 3 • Technical Workload Selection
                </span>
                <span className="text-xs font-mono text-muted bg-bg px-2 py-0.5 rounded-xs hairline">
                  {selectedWorkloads.length} Selected
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-normal text-ink mt-1">
                What workloads will you run on this laptop?
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Select all applicable workloads so AI balances your CPU multi-threading, GPU tensor power, and memory buffers.
              </p>
            </div>

            {/* Workloads Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {WORKLOAD_OPTIONS.map((item) => {
                const isSelected = selectedWorkloads.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleWorkload(item.id)}
                    className={`p-3.5 rounded-xs hairline text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                        : 'bg-surface hover:bg-bg/80 text-ink/80'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <span className="text-xs font-semibold text-ink block">{item.label}</span>
                      <p className="text-[11px] text-muted leading-tight">{item.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-xs hairline flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-accent text-surface' : 'bg-bg'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 3 Footer Navigation */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2"
              >
                <span>Continue to Hardware</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SELECT YOUR REQUIRED HARDWARE                                      */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 4 && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
                Step 4 • Hardware Specification Preferences
              </span>
              <h2 className="text-lg sm:text-xl font-normal text-ink mt-1">
                Customize your required hardware configuration
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Fine-tune RAM memory, dedicated graphics card, processor family, display refresh and chassis weight.
              </p>
            </div>

            <div className="space-y-6">
              
              {/* RAM Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold">
                    RAM Memory Capacity
                  </label>
                  <span className="text-[11px] font-mono text-muted">Selected: {selectedRam}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {HARDWARE_OPTIONS.ram.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRam(r.value)}
                      className={`p-2.5 rounded-xs hairline text-center transition-all ${
                        selectedRam === r.value
                          ? 'bg-accent/15 border-accent text-ink font-semibold ring-1 ring-accent'
                          : 'bg-surface hover:bg-bg/80 text-ink/80'
                      }`}
                    >
                      <span className="text-xs font-mono block">{r.label}</span>
                      <span className="text-[10px] text-muted block mt-0.5">{r.num >= 16 ? 'Recommended' : 'Basic'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold">
                    Storage Capacity (SSD)
                  </label>
                  <span className="text-[11px] font-mono text-muted">Selected: {selectedStorage}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HARDWARE_OPTIONS.storage.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStorage(s.value)}
                      className={`p-2.5 rounded-xs hairline text-center transition-all ${
                        selectedStorage === s.value
                          ? 'bg-accent/15 border-accent text-ink font-semibold ring-1 ring-accent'
                          : 'bg-surface hover:bg-bg/80 text-ink/80'
                      }`}
                    >
                      <span className="text-xs font-mono block">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* GPU Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold">
                    Graphics Processing Unit (GPU)
                  </label>
                  <span className="text-[11px] font-mono text-muted">Selected: {selectedGpu}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {HARDWARE_OPTIONS.gpu.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setSelectedGpu(g.value)}
                      className={`p-2.5 rounded-xs hairline text-left transition-all ${
                        selectedGpu === g.value
                          ? 'bg-accent/15 border-accent text-ink font-semibold ring-1 ring-accent'
                          : 'bg-surface hover:bg-bg/80 text-ink/80'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-ink">{g.label}</span>
                      <span className="text-[10px] text-muted block mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CPU Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold">
                    Central Processing Unit (CPU)
                  </label>
                  <span className="text-[11px] font-mono text-muted">Selected: {selectedCpu}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HARDWARE_OPTIONS.cpu.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedCpu(c.value)}
                      className={`p-2.5 rounded-xs hairline text-left transition-all ${
                        selectedCpu === c.value
                          ? 'bg-accent/15 border-accent text-ink font-semibold ring-1 ring-accent'
                          : 'bg-surface hover:bg-bg/80 text-ink/80'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-ink">{c.label}</span>
                      <span className="text-[10px] text-muted block mt-0.5">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display & Refresh Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Size */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold block">
                    Display Screen Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HARDWARE_OPTIONS.displaySize.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDisplaySize(d.value)}
                        className={`p-2 rounded-xs hairline text-center transition-all ${
                          selectedDisplaySize === d.value
                            ? 'bg-accent/15 border-accent text-ink font-semibold'
                            : 'bg-surface hover:bg-bg/80 text-ink/80'
                        }`}
                      >
                        <span className="text-xs font-mono block">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Refresh Rate */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold block">
                    Display Refresh Rate
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {HARDWARE_OPTIONS.refreshRate.map(hz => (
                      <button
                        key={hz.value}
                        onClick={() => setSelectedRefreshRate(hz.value)}
                        className={`p-2 rounded-xs hairline text-center transition-all ${
                          selectedRefreshRate === hz.value
                            ? 'bg-accent/15 border-accent text-ink font-semibold'
                            : 'bg-surface hover:bg-bg/80 text-ink/80'
                        }`}
                      >
                        <span className="text-xs font-mono block">{hz.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Battery & Portability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Battery Priority */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold block">
                    Battery Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {HARDWARE_OPTIONS.batteryPriority.map(b => (
                      <button
                        key={b.value}
                        onClick={() => setBatteryPriority(b.value)}
                        className={`p-2.5 rounded-xs hairline text-center transition-all ${
                          batteryPriority === b.value
                            ? 'bg-accent/15 border-accent text-ink font-semibold'
                            : 'bg-surface hover:bg-bg/80 text-ink/80'
                        }`}
                      >
                        <span className="text-xs font-mono block">{b.label}</span>
                        <span className="text-[10px] text-muted block mt-0.5">{b.desc.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portability */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-ink uppercase tracking-wider font-semibold block">
                    Portability Form Factor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HARDWARE_OPTIONS.portability.map(p => (
                      <button
                        key={p.value}
                        onClick={() => setPortability(p.value)}
                        className={`p-2.5 rounded-xs hairline text-center transition-all ${
                          portability === p.value
                            ? 'bg-accent/15 border-accent text-ink font-semibold'
                            : 'bg-surface hover:bg-bg/80 text-ink/80'
                        }`}
                      >
                        <span className="text-xs font-mono block">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Step 4 Footer Navigation */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(3)}
                className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(5)}
                className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2"
              >
                <span>Continue to Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: BUDGET SELECTOR & SLIDER                                          */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase tracking-wider">
                Step 5 • Maximum Budget & Offers
              </span>
              <h2 className="text-lg sm:text-xl font-normal text-ink mt-1">
                What is your target budget?
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                CommercePilot AI factors in instant bank discounts (HDFC, SBI, ICICI) and coupon stacking to find real effective prices.
              </p>
            </div>

            {/* Budget Preset Tiers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BUDGET_TIERS.map((tier) => {
                const isSelected = selectedBudgetTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleBudgetTierSelect(tier.id, tier.max)}
                    className={`p-3.5 rounded-xs hairline text-left transition-all ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent'
                        : 'bg-surface hover:bg-bg/80 text-ink/80'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold text-ink font-mono block">
                      {tier.label}
                    </span>
                    <span className="text-[11px] text-muted block mt-0.5">
                      {tier.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Interactive Budget Slider */}
            <div className="bg-bg/60 p-5 rounded-xs hairline space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-ink uppercase tracking-wider font-semibold">
                  Custom Budget Slider
                </span>
                <div className="text-lg sm:text-xl font-semibold font-mono text-accent-deep">
                  ₹{customBudget.toLocaleString('en-IN')}
                </div>
              </div>

              <input
                type="range"
                min="35000"
                max="250000"
                step="5000"
                value={customBudget}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomBudget(val);
                  setSelectedBudgetTier('custom');
                }}
                className="w-full h-1.5 bg-line rounded-lg appearance-none cursor-pointer accent-accent-deep"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                <span>₹35,000 (Entry)</span>
                <span>₹70,000 (Sweet Spot)</span>
                <span>₹1,50,000 (Pro Workstation)</span>
                <span>₹2,50,000+ (Flagship)</span>
              </div>
            </div>

            {/* Step 5 Footer Navigation with "Find my best laptops" */}
            <div className="flex items-center justify-between pt-4 hairline-t">
              <button
                onClick={() => setStep(4)}
                className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleRunRecommendation}
                className="py-3.5 px-8 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-surface" />
                <span>Find my best laptops</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CINEMATIC 7-AGENT ANALYSIS PIPELINE                                        */}
        {/* ========================================================================= */}
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
                Coordinating multi-agent research for {selectedCourse} ({selectedSpecialization})
              </p>
            </div>

            {/* 7 Agents List */}
            <div className="max-w-lg mx-auto space-y-2.5 text-left">
              {AGENT_PIPELINE_STEPS.map((agent, index) => {
                const isDone = index < activeAgentIndex;
                const isCurrent = index === activeAgentIndex;

                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-xs hairline transition-all flex items-center justify-between text-xs ${
                      isCurrent
                        ? 'bg-accent/20 border-accent shadow-xs scale-[1.01]'
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

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs ${
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

        {/* ========================================================================= */}
        {/* STEP 6: AI RECOMMENDATION RESULTS (TOP 5 RANKED)                           */}
        {/* ========================================================================= */}
        {!isAnalyzing && step === 6 && recommendedResults && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Score Banner */}
            <div className="bg-surface rounded-xs p-5 sm:p-6 hairline space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hairline-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-xs bg-emerald-800/10 text-emerald-800 border border-emerald-800/20 text-xs font-mono font-semibold">
                      AI RECOMMENDATION GENERATED
                    </span>
                    <span className="text-xs font-mono text-muted">
                      Budget Target: ₹{customBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-light text-ink mt-1 font-sans">
                    Best Laptops for <span className="font-normal text-accent-deep">{selectedCourse}</span>
                  </h2>
                  <p className="text-xs text-muted">
                    Specialization: {selectedSpecialization} • {selectedWorkloads.length} technical workloads calibrated
                  </p>
                </div>

                {/* Match percentage gauge */}
                <div className="flex items-center gap-3 bg-bg/80 px-4 py-2.5 rounded-xs hairline self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-muted uppercase block">Overall Match</span>
                    <span className="text-2xl font-bold font-mono text-accent-deep">
                      {recommendedResults.overallMatchAvg}%
                    </span>
                  </div>
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
              </div>

              {/* Sub-scores metrics row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {[
                  { label: 'Course Fit', score: recommendedResults.overallScores.courseFit },
                  { label: 'Performance', score: recommendedResults.overallScores.performance },
                  { label: 'GPU Fit', score: recommendedResults.overallScores.gpuFit },
                  { label: 'RAM Fit', score: recommendedResults.overallScores.ramFit },
                  { label: 'Battery', score: recommendedResults.overallScores.battery },
                  { label: 'Value', score: recommendedResults.overallScores.value }
                ].map((metric) => (
                  <div key={metric.label} className="bg-bg/60 p-2.5 rounded-xs hairline text-center">
                    <span className="text-[10px] font-mono text-muted block">{metric.label}</span>
                    <span className="text-sm font-mono font-semibold text-ink mt-0.5 block">
                      {metric.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP 5 RECOMMENDED LAPTOPS CARDS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-ink font-sans">
                    BEST LAPTOPS FOR YOU
                  </h3>
                  <p className="text-xs text-muted">
                    Top 5 curated archetypes ranked specifically for your requirements
                  </p>
                </div>
                <button
                  onClick={() => navigate('/rankings')}
                  className="text-xs font-mono text-accent-deep hover:underline flex items-center gap-1"
                >
                  <span>View All 60+ Rankings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top 5 Cards List */}
              <div className="space-y-4">
                {recommendedResults.topFive.map((item, index) => {
                  const p = item.product;
                  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                  const isCompared = isInCompare(p.id);

                  return (
                    <div 
                      key={p.id}
                      className={`surface-card rounded-xs p-5 hairline transition-all hover:border-accent/40 ${
                        index === 0 ? 'ring-1 ring-accent/30 bg-surface' : 'bg-surface'
                      }`}
                    >
                      {/* Top Rank Badge & AI Fit Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 hairline-b mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xs hairline flex items-center gap-1.5 ${
                            index === 0 
                              ? 'bg-ink text-surface border-ink' 
                              : index === 1 
                              ? 'bg-accent/20 text-accent-deep border-accent/30'
                              : 'bg-bg text-ink'
                          }`}>
                            {item.rankBadge}
                          </span>
                          <span className="text-xs text-muted font-sans hidden sm:inline">
                            {item.rankTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-xs bg-accent/15 text-accent-deep border border-accent/25">
                            AI Match: {item.scores.overallMatch}%
                          </span>
                        </div>
                      </div>

                      {/* Main Laptop Content: Image + Details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Image Thumbnail */}
                        <div className="md:col-span-3 flex items-center justify-center bg-bg/50 p-3 rounded-xs hairline">
                          <img
                            src={p.image}
                            alt={p.model}
                            className="max-h-28 sm:max-h-32 object-contain"
                            loading="lazy"
                          />
                        </div>

                        {/* Middle Details & Specs */}
                        <div className="md:col-span-6 space-y-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-muted uppercase">{p.brand}</span>
                              <div className="flex items-center text-amber-700 text-[11px] font-mono">
                                <Star className="w-3 h-3 fill-amber-700 mr-0.5" />
                                <span>{p.rating}</span>
                                <span className="text-muted ml-1">({p.reviewCount})</span>
                              </div>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-ink font-sans">
                              {p.model}
                            </h4>
                            <p className="text-xs text-muted line-clamp-1">{p.subtitle}</p>
                          </div>

                          {/* Hardware Spec Grid Badges */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono text-ink/80">
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline line-clamp-1">
                              CPU: {p.processor.split('(')[0]}
                            </span>
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline line-clamp-1">
                              GPU: {p.gpu.split('(')[0]}
                            </span>
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline">
                              RAM: {p.ram}
                            </span>
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline">
                              SSD: {p.storage}
                            </span>
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline line-clamp-1">
                              Display: {p.display.split(' ')[0]} {p.specs.panelType}
                            </span>
                            <span className="bg-bg/80 px-2 py-1 rounded-xs hairline">
                              Weight: {p.specs.weightKg} kg
                            </span>
                          </div>

                          {/* Justification note */}
                          <div className="bg-bg/40 p-2.5 rounded-xs hairline text-[11px] text-muted leading-relaxed">
                            <span className="font-semibold text-ink/90">Why it fits: </span>
                            {item.justification}
                          </div>
                        </div>

                        {/* Right Pricing & Interactive Action Buttons */}
                        <div className="md:col-span-3 flex flex-col justify-between space-y-3 pt-2 md:pt-0 md:hairline-l md:pl-5">
                          {/* Price Display */}
                          <div>
                            <span className="text-[10px] font-mono text-muted uppercase block">Effective Price</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-xl font-bold font-mono text-ink">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs line-through text-muted font-mono">
                                ₹{p.mrp.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-800 font-medium block mt-0.5">
                              {discount}% Off (Save ₹{(p.mrp - p.price).toLocaleString('en-IN')})
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-1.5 w-full">
                            <button
                              onClick={() => addToCart(p, p.offers[0])}
                              className="w-full py-2 px-3 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold rounded-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to cart</span>
                            </button>

                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => {
                                  if (isCompared) {
                                    navigate('/compare');
                                  } else {
                                    addToCompare(p);
                                  }
                                }}
                                className={`py-1.5 px-2 text-xs font-mono rounded-xs hairline transition-colors flex items-center justify-center gap-1 ${
                                  isCompared
                                    ? 'bg-accent/20 text-accent-deep border-accent'
                                    : 'bg-bg hover:bg-surface text-ink'
                                }`}
                              >
                                <Scale className="w-3 h-3" />
                                <span>{isCompared ? 'Compared' : 'Compare'}</span>
                              </button>

                              <button
                                onClick={() => navigate(`/price-intelligence/${p.id}`)}
                                className="py-1.5 px-2 bg-bg hover:bg-surface text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center justify-center gap-1"
                              >
                                <Tag className="w-3 h-3" />
                                <span>View offers</span>
                              </button>
                            </div>

                            <button
                              onClick={() => navigate(`/product/${p.id}`)}
                              className="w-full py-1.5 px-2 bg-transparent hover:bg-bg text-muted hover:text-ink text-[11px] font-mono text-center rounded-xs transition-colors flex items-center justify-center gap-1"
                            >
                              <span>View full specifications</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Reset / Re-run row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 hairline-t">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-xs hairline transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust Course & Hardware Criteria</span>
              </button>

              <button
                onClick={() => navigate('/rankings')}
                className="py-3 px-6 bg-accent-deep hover:bg-ink text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-xs transition-all flex items-center gap-2"
              >
                <span>Explore Full 60+ Laptop Dynamic Ranking Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIFinder;

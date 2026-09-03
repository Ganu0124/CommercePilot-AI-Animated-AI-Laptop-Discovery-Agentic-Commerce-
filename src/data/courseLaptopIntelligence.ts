import { Product } from '../types';

export interface EducationCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  courses: string[];
}

export const EDUCATION_CATEGORIES: EducationCategory[] = [
  {
    id: 'engineering',
    name: 'Engineering',
    iconName: 'Cpu',
    description: 'Technical computing, simulations, code synthesis & CAD',
    courses: [
      'Computer Science Engineering',
      'Artificial Intelligence & Machine Learning',
      'Artificial Intelligence & Data Science',
      'Data Science',
      'Information Technology',
      'Software Engineering',
      'Cyber Security',
      'Computer Engineering',
      'Electronics & Communication Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Robotics & Automation',
      'Biomedical Engineering',
      'Aerospace Engineering',
      'Chemical Engineering'
    ]
  },
  {
    id: 'commerce_management',
    name: 'Commerce & Management',
    iconName: 'TrendingUp',
    description: 'Business analysis, financial modeling, presentations & operations',
    courses: [
      'B.Com',
      'BBA',
      'MBA',
      'Finance',
      'Marketing',
      'Business Analytics',
      'Human Resources',
      'International Business',
      'Operations Management'
    ]
  },
  {
    id: 'computer_applications',
    name: 'Computer Applications',
    iconName: 'Terminal',
    description: 'Applied computing, web frameworks, mobile apps & devops',
    courses: [
      'BCA',
      'MCA',
      'Computer Applications',
      'Software Development',
      'Cloud Computing',
      'Application Development'
    ]
  },
  {
    id: 'science_technology',
    name: 'Science & Technology',
    iconName: 'Atom',
    description: 'Statistical computing, mathematical models & data science',
    courses: [
      'B.Sc Computer Science',
      'B.Sc Data Science',
      'B.Sc Artificial Intelligence',
      'B.Sc Information Technology',
      'M.Sc Computer Science',
      'M.Sc Data Science',
      'M.Sc Artificial Intelligence',
      'Statistics',
      'Mathematics'
    ]
  },
  {
    id: 'design_media',
    name: 'Design & Media',
    iconName: 'Palette',
    description: 'High-gamut color accuracy, 3D rendering, video timelines & VFX',
    courses: [
      'Graphic Design',
      'UI/UX Design',
      'Animation',
      '3D Design',
      'Video Editing',
      'VFX',
      'Architecture',
      'Fashion Design'
    ]
  },
  {
    id: 'medical_healthcare',
    name: 'Medical & Healthcare',
    iconName: 'Stethoscope',
    description: 'Research databases, clinical imagery, documentation & endurance',
    courses: [
      'MBBS',
      'BDS',
      'Pharmacy',
      'Nursing',
      'Biotechnology',
      'Biomedical Science',
      'Healthcare Management'
    ]
  },
  {
    id: 'law_humanities',
    name: 'Law & Humanities',
    iconName: 'BookOpen',
    description: 'Long-form reading, documentation, legal databases & battery longevity',
    courses: [
      'LLB',
      'BA',
      'MA',
      'Law Technology',
      'Digital Humanities'
    ]
  },
  {
    id: 'research_advanced',
    name: 'Research & Advanced Computing',
    iconName: 'Binary',
    description: 'Deep neural models, tensor computations, CUDA acceleration & papers',
    courses: [
      'Machine Learning',
      'Deep Learning',
      'Generative AI',
      'Computer Vision',
      'NLP',
      'Robotics',
      'Research Computing'
    ]
  },
  {
    id: 'other',
    name: 'Other & Everyday',
    iconName: 'Briefcase',
    description: 'Everyday multitasking, office suites, freelance work & portability',
    courses: [
      'General College',
      'Office & Productivity',
      'Professional Work',
      'Freelancing',
      'Startup / Business',
      'Everyday Use'
    ]
  }
];

export const DEGREE_SPECIALIZATIONS: Record<string, string[]> = {
  // Computer Applications
  'MCA': [
    'Software Development',
    'AI & ML',
    'Data Science',
    'Cloud Computing',
    'Cyber Security',
    'Full Stack Development',
    'Mobile Development',
    'Database Management'
  ],
  'BCA': [
    'Programming',
    'Web Development',
    'Data Science',
    'AI & ML',
    'Cyber Security',
    'Cloud Computing',
    'Application Development'
  ],
  'Computer Applications': [
    'Full Stack Development',
    'Database Administration',
    'Mobile App Dev',
    'Web Technologies',
    'DevOps'
  ],
  'Software Development': [
    'Frontend & Web Systems',
    'Backend & Microservices',
    'Full Stack Engineering',
    'Mobile Application (iOS/Android)',
    'Cloud Native Architecture'
  ],
  'Cloud Computing': [
    'AWS / Azure Architecture',
    'DevOps & Kubernetes',
    'Site Reliability Engineering',
    'Cloud Security',
    'Serverless Microservices'
  ],
  'Application Development': [
    'Cross-Platform Mobile (Flutter/React Native)',
    'Enterprise Java/Spring',
    'Modern Web Applications',
    'API Engineering'
  ],

  // Commerce & Management
  'MBA': [
    'Finance',
    'Marketing',
    'Business Analytics',
    'HR',
    'Operations',
    'Entrepreneurship'
  ],
  'BBA': [
    'Business Analytics',
    'Digital Marketing',
    'Finance & Accounting',
    'Human Resources',
    'Supply Chain & Retail'
  ],
  'B.Com': [
    'Financial Accounting',
    'Banking & Insurance',
    'Taxation & Auditing',
    'Financial Analysis',
    'E-Commerce Operations'
  ],
  'Finance': [
    'Financial Modeling (Excel)',
    'Equity Research & Valuation',
    'FinTech & Algorithmic Trading',
    'Corporate Finance',
    'Risk Management'
  ],
  'Marketing': [
    'Growth & Performance Marketing',
    'Brand Analytics & Consumer Research',
    'Social Media & Content Strategy',
    'Product Marketing'
  ],
  'Business Analytics': [
    'PowerBI & Tableau Dashboards',
    'SQL & Data Warehousing',
    'Predictive Modeling with Python',
    'Executive Decision Support'
  ],
  'Human Resources': [
    'People Analytics',
    'Talent Acquisition Systems',
    'HR Operations & Compliance',
    'Organizational Psychology'
  ],
  'International Business': [
    'Global Supply Chains',
    'Trade Compliance & Tariffs',
    'Cross-Border E-Commerce',
    'Foreign Exchange Analysis'
  ],
  'Operations Management': [
    'Logistics & Supply Optimization',
    'ERP Systems (SAP/Oracle)',
    'Lean Six Sigma Simulation',
    'Procurement & Inventory'
  ],

  // Engineering
  'Computer Science Engineering': [
    'Programming',
    'AI & ML',
    'Data Science',
    'Cyber Security',
    'Cloud Computing',
    'Web Development',
    'Software Engineering',
    'Systems'
  ],
  'Artificial Intelligence & Machine Learning': [
    'Deep Neural Networks',
    'Natural Language Processing',
    'Computer Vision & Object Detection',
    'Reinforcement Learning',
    'MLOps & Edge Deployment'
  ],
  'Artificial Intelligence & Data Science': [
    'Big Data & Spark',
    'Predictive Machine Learning',
    'Data Pipelines & ETL',
    'Statistical Modeling',
    'BI & Visualizations'
  ],
  'Data Science': [
    'Python & Pandas Analytics',
    'Deep Learning Models',
    'Data Engineering & SQL',
    'Scientific Visualizations',
    'Time Series Forecasting'
  ],
  'Information Technology': [
    'Enterprise Networking',
    'Web & Full Stack Engineering',
    'Cloud Infrastructure',
    'Cyber Defense & Security',
    'Database Architecture'
  ],
  'Software Engineering': [
    'Agile & System Architecture',
    'Microservices & Docker',
    'Full Stack Web',
    'Automated Testing & QA',
    'Distributed Systems'
  ],
  'Cyber Security': [
    'Ethical Hacking & Penetration Testing',
    'Network Vulnerability Analysis',
    'Virtualization & Lab Environments',
    'Malware Analysis & Forensics',
    'Cryptographic Protocols'
  ],
  'Computer Engineering': [
    'Computer Architecture',
    'Operating System Kernels',
    'Embedded Firmware & C/C++',
    'Hardware-Software Co-Design',
    'Microprocessor Design'
  ],
  'Electronics & Communication Engineering': [
    'Embedded Systems',
    'IoT',
    'VLSI',
    'MATLAB',
    'Signal Processing',
    'Robotics'
  ],
  'Mechanical Engineering': [
    'CAD',
    'Simulation',
    'MATLAB',
    'SolidWorks',
    'AutoCAD',
    'Engineering Analysis'
  ],
  'Electrical Engineering': [
    'Power Systems Simulation',
    'MATLAB / Simulink',
    'Circuit Design (SPICE)',
    'Control Systems & Drives',
    'Renewable Grid Automation'
  ],
  'Civil Engineering': [
    'Structural Analysis (STAAD.Pro)',
    'AutoCAD & Civil 3D',
    'Building Information Modeling (BIM)',
    'GIS & Survey Mapping',
    'Project Scheduling (Primavera)'
  ],
  'Robotics & Automation': [
    'ROS (Robot Operating System)',
    'Computer Vision & Kinematics',
    'Motion Planning & SLAM',
    'Mechatronic Prototyping',
    'Industrial PLC Programming'
  ],
  'Biomedical Engineering': [
    'Medical Image Processing (DICOM)',
    'Bio-signal Processing (EEG/ECG)',
    'Biomechanics Modeling',
    'Biosensor Simulation'
  ],
  'Aerospace Engineering': [
    'CFD Aerodynamics Simulation',
    'Propulsion Modeling',
    'Structural Finite Element Analysis (FEA)',
    'CAD Aircraft Design',
    'Flight Dynamics & Control'
  ],
  'Chemical Engineering': [
    'Process Simulation (Aspen Plus)',
    'Computational Fluid Dynamics',
    'Thermodynamic Modeling',
    'Reaction Engineering Analysis'
  ],

  // Science & Technology
  'B.Sc Computer Science': [
    'C++ / Java Core Programming',
    'Web Development',
    'Database Systems',
    'Linux & Scripting',
    'Computer Graphics'
  ],
  'B.Sc Data Science': [
    'Python & R Data Analytics',
    'Statistical Machine Learning',
    'SQL Analytics',
    'Visualization Libraries'
  ],
  'B.Sc Artificial Intelligence': [
    'Foundational AI Concepts',
    'Python for Neural Nets',
    'Computer Vision Basics',
    'NLP Fundamentals'
  ],
  'B.Sc Information Technology': [
    'Network Administration',
    'Web Architecture',
    'IT Support & Security',
    'Database Design'
  ],
  'M.Sc Computer Science': [
    'Advanced Algorithms',
    'Distributed Computing',
    'AI & Soft Computing',
    'Network Security'
  ],
  'M.Sc Data Science': [
    'Big Data Architectures',
    'Deep Learning Specialization',
    'Bayesian Statistics',
    'Applied Econometrics'
  ],
  'M.Sc Artificial Intelligence': [
    'Generative Modeling & LLMs',
    'Advanced Computer Vision',
    'Robotic AI & Perception',
    'Autonomous Navigation'
  ],
  'Statistics': [
    'R & SAS Statistical Computing',
    'SPSS & Stata Modeling',
    'Monte Carlo Simulations',
    'Survey Analysis & Sampling'
  ],
  'Mathematics': [
    'MATLAB / Mathematica',
    'Numerical Analysis',
    'LaTeX Academic Typesetting',
    'Algorithmic Cryptography'
  ],

  // Design & Media
  'Graphic Design': [
    'Photoshop & Illustrator Branding',
    'Print & Vector Media',
    'Typography & Layout Design',
    'Social Media Asset Creation'
  ],
  'UI/UX Design': [
    'Figma & Design Systems',
    'Interactive Prototyping',
    'User Research & Wireframing',
    'Web & App Design'
  ],
  'Animation': [
    '2D Character Animation',
    '3D Character Rigging & Motion',
    'Blender & Maya Workflows',
    'Motion Graphics (After Effects)'
  ],
  '3D Design': [
    'Blender 3D Modeling',
    'Unreal Engine & Realtime 3D',
    'Product Rendering (KeyShot)',
    'Substance Painter Texturing'
  ],
  'Video Editing': [
    '4K Timeline Scrubbing (Premiere / DaVinci)',
    'Color Grading & LUT Workflows',
    'Multi-cam Audio/Video Sync',
    'YouTube & High-Bitrate Exports'
  ],
  'VFX': [
    'Nuke Node Compositing',
    'After Effects FX & Particle Systems',
    'Green Screen Keying & Matchmoving',
    '3D FX Simulation (Houdini)'
  ],
  'Architecture': [
    'Autodesk Revit BIM Modeling',
    'AutoCAD Floorplans & Elevations',
    'Lumion / Twinmotion 3D Walkthroughs',
    'Rhino & Grasshopper Parametric'
  ],
  'Fashion Design': [
    'CLO 3D Garment Simulation',
    'Pattern Making & Vector Sketching',
    'Textile Rendering & Moodboards',
    'Lookbook Layout & Portfolio'
  ],

  // Medical & Healthcare
  'MBBS': [
    'Medical Study Modules & Histology Atlas',
    'Case Presentation & Research Reading',
    'Telemedicine & Health Records',
    'Long-battery On-call Portability'
  ],
  'BDS': [
    'Dental Anatomy & 3D Oral Scans',
    'Clinical Documentation',
    'Patient Records & Case Studies'
  ],
  'Pharmacy': [
    'Medicinal Chemistry Molecular Modeling',
    'Pharmacovigilance Database Tools',
    'Research Publications & Data'
  ],
  'Nursing': [
    'Hospital Information Systems',
    'Patient Care Documentation',
    'Study Materials & Video Lectures'
  ],
  'Biotechnology': [
    'Bioinformatics & BLAST Alignments',
    'Molecular Docking (PyMOL/AutoDock)',
    'Gene Expression Analysis',
    'Bioprocess Simulation'
  ],
  'Biomedical Science': [
    'Histopathology Image Analysis',
    'Clinical Trial Data Management',
    'Epidemiological Statistics'
  ],
  'Healthcare Management': [
    'Hospital Operations Analytics',
    'Healthcare ERP Systems',
    'Compliance & Patient Data Privacy'
  ],

  // Law & Humanities
  'LLB': [
    'Legal Research (SCC Online / Manupatra)',
    'Document Drafting & Contracts',
    'Moot Court Preparation & Briefs',
    'Long Battery for Courtrooms & Library'
  ],
  'BA': [
    'Academic Writing & Literature Review',
    'Digital Archives & Field Research',
    'Presentations & Essay Composition'
  ],
  'MA': [
    'Postgraduate Thesis Drafting',
    'Qualitative Data Analysis (NVivo)',
    'Historical Document Archiving'
  ],
  'Law Technology': [
    'Legal AI & Document Summarization',
    'Smart Contracts & E-Discovery',
    'Cyber Law Compliance & Forensic Evidence'
  ],
  'Digital Humanities': [
    'Text Mining & Corpus Linguistics',
    'Cultural GIS Mapping',
    'Digital Archiving & Metadata Systems'
  ],

  // Research & Advanced Computing
  'Machine Learning': [
    'Scikit-learn, XGBoost & LightGBM',
    'TensorFlow / PyTorch Workstations',
    'CUDA GPU Training Pipelines',
    'Feature Engineering on Large Datasets'
  ],
  'Deep Learning': [
    'Convolutional Neural Networks (CNNs)',
    'Transformer Architectures & Attention',
    'Distributed GPU Training with Accelerate',
    'High VRAM Model Inference'
  ],
  'Generative AI': [
    'Local LLM Inference (Ollama/vLLM)',
    'LoRA & QLoRA Fine-tuning',
    'Diffusion Models & Image Generation',
    'LangChain & Vector RAG Architectures'
  ],
  'Computer Vision': [
    'OpenCV & Real-time Video Feeds',
    'YOLOv8 / Detection & Tracking',
    '3D Point Cloud Processing',
    'Autonomous Vehicle Perception'
  ],
  'NLP': [
    'Hugging Face Transformers',
    'Tokenization & Embeddings',
    'Fine-tuning BERT / Llama models',
    'Semantic Search & Translation'
  ],
  'Robotics': [
    'ROS2 Navigation & Gazebo Simulation',
    'Kinematic & Dynamic Modeling',
    'Autonomous Path Planning',
    'Sensor Fusion (LiDAR, Camera, IMU)'
  ],
  'Research Computing': [
    'High-Performance Computing (HPC) Clusters',
    'JupyterLab & Remote SSH Workstations',
    'LaTeX Paper Compilation & Overleaf',
    'Large Matrix Computations'
  ],

  // Other
  'General College': [
    'Lecture Notes & Assignment Prep',
    'Web Browsing & YouTube Streams',
    'MS Office & PDF Annotations',
    'Lightweight Campus Portability'
  ],
  'Office & Productivity': [
    'Advanced Spreadsheets & Pivot Tables',
    'Zoom / Teams Video Conferencing',
    'Document Workflows & Cloud Sync',
    'Silent Fan & Reliable Keyboard'
  ],
  'Professional Work': [
    'Multitask Dual-Screen Output',
    'Enterprise Security & BitLocker',
    'Business Presentation Decks',
    'All-Day Battery Endurance'
  ],
  'Freelancing': [
    'Client Video Calls & Remote Desktops',
    'Rapid Task Switching & Productivity',
    'Portfolio Management & Billing',
    'Premium Display for Content'
  ],
  'Startup / Business': [
    'Pitch Decks & Investor Financials',
    'SaaS Management & Metrics',
    'Lightweight Travel Readiness',
    'Premium Sleek Aesthetics'
  ],
  'Everyday Use': [
    'Web Browsing & Media Consumption',
    'Home Finance & Streaming',
    'Photo Management',
    'Quiet Comfort'
  ]
};

export const WORKLOAD_OPTIONS = [
  { id: 'basic_programming', label: 'Basic Programming', desc: 'Python, C, C++, Java introductory coursework', category: 'coding' },
  { id: 'web_development', label: 'Web Development', desc: 'React, Node.js, Next.js, HTML/CSS, Tailwind', category: 'coding' },
  { id: 'advanced_programming', label: 'Advanced Programming', desc: 'Docker, Microservices, Spring Boot, Go, Rust', category: 'coding' },
  { id: 'data_science', label: 'Data Science', desc: 'Pandas, NumPy, Jupyter, PowerBI, BigQuery, SQL', category: 'ai' },
  { id: 'machine_learning', label: 'Machine Learning', desc: 'Scikit-learn, XGBoost, Model Training, Hyperparams', category: 'ai' },
  { id: 'deep_learning', label: 'Deep Learning', desc: 'PyTorch, TensorFlow, CNNs, GPU Backprop', category: 'ai' },
  { id: 'generative_ai', label: 'Generative AI', desc: 'Local LLMs, Ollama, LoRA Fine-Tuning, Stable Diffusion', category: 'ai' },
  { id: 'computer_vision', label: 'Computer Vision', desc: 'OpenCV, YOLO, Image Segmentation, Real-time feeds', category: 'ai' },
  { id: 'nlp', label: 'NLP', desc: 'Transformers, Embeddings, Tokenizers, Language Models', category: 'ai' },
  { id: 'cloud_computing', label: 'Cloud Computing', desc: 'AWS/GCP CLIs, Kubernetes, Terraform, Virtual Machines', category: 'infra' },
  { id: 'cyber_security', label: 'Cyber Security', desc: 'Kali Linux VMs, Wireshark, Metasploit, Burp Suite', category: 'infra' },
  { id: '3d_cad', label: '3D / CAD', desc: 'AutoCAD, SolidWorks, Blender, Revit, 3D Rendering', category: 'creative' },
  { id: 'video_editing', label: 'Video Editing', desc: '4K Premiere Pro, DaVinci Resolve, After Effects, Final Cut', category: 'creative' },
  { id: 'gaming', label: 'Gaming', desc: 'AAA Titles, High FPS Esports, Ray Tracing, 144Hz+', category: 'performance' },
  { id: 'office_productivity', label: 'Office & Productivity', desc: 'MS Office, Google Workspace, Multi-tab Research, Zoom', category: 'productivity' }
];

export const HARDWARE_OPTIONS = {
  ram: [
    { value: '8 GB', num: 8, label: '8 GB', desc: 'Entry-level everyday productivity' },
    { value: '16 GB', num: 16, label: '16 GB', desc: 'Recommended baseline for coding & multitasking' },
    { value: '24 GB', num: 24, label: '24 GB', desc: 'Smooth heavy workloads & creative work' },
    { value: '32 GB', num: 32, label: '32 GB', desc: 'Heavy AI, Docker containers & simulations' },
    { value: '64 GB', num: 64, label: '64 GB', desc: 'Extreme workstation & local LLM capacity' }
  ],
  storage: [
    { value: '256 GB SSD', num: 256, label: '256 GB SSD', desc: 'Basic coursework & cloud storage' },
    { value: '512 GB SSD', num: 512, label: '512 GB SSD', desc: 'Recommended sweet spot for students' },
    { value: '1 TB SSD', num: 1024, label: '1 TB SSD', desc: 'Heavy datasets, multiple OS & games' },
    { value: '2 TB SSD', num: 2048, label: '2 TB SSD', desc: 'Large 4K libraries & high-res assets' }
  ],
  gpu: [
    { value: 'No dedicated GPU', type: 'none', label: 'No dedicated GPU', desc: 'Silent, lightweight, longer battery' },
    { value: 'Integrated GPU', type: 'integrated', label: 'Integrated GPU (Intel Iris / AMD Radeon)', desc: 'Efficient graphics for coding & everyday tasks' },
    { value: 'RTX 2050', type: 'rtx2050', label: 'NVIDIA RTX 2050 (4GB)', desc: 'Entry GPU for casual gaming & basic CUDA' },
    { value: 'RTX 3050', type: 'rtx3050', label: 'NVIDIA RTX 3050 (4GB/6GB)', desc: 'Great value for CAD, video editing & ML models' },
    { value: 'RTX 4050', type: 'rtx4050', label: 'NVIDIA RTX 4050 (6GB)', desc: 'Modern Ada Lovelace architecture with DLSS 3' },
    { value: 'RTX 4060', type: 'rtx4060', label: 'NVIDIA RTX 4060 (8GB)', desc: 'Excellent 8GB VRAM for AI training & high FPS' },
    { value: 'RTX 4070', type: 'rtx4070', label: 'NVIDIA RTX 4070 (8GB)', desc: 'High-end performance for complex 3D & AI' },
    { value: 'RTX 4080', type: 'rtx4080', label: 'NVIDIA RTX 4080 (12GB)', desc: 'Enthusiast workstation computing' },
    { value: 'RTX 4090', type: 'rtx4090', label: 'NVIDIA RTX 4090 (16GB)', desc: 'Ultimate desktop replacement computing' }
  ],
  cpu: [
    { value: 'Intel Core i3', family: 'intel', label: 'Intel Core i3', desc: 'Entry dual/quad core tasks' },
    { value: 'Intel Core i5', family: 'intel', label: 'Intel Core i5', desc: 'Balanced 10-core performance' },
    { value: 'Intel Core i7', family: 'intel', label: 'Intel Core i7', desc: 'High-tier multi-threaded power' },
    { value: 'Intel Core i9', family: 'intel', label: 'Intel Core i9', desc: 'Extreme computing power' },
    { value: 'AMD Ryzen 5', family: 'amd', label: 'AMD Ryzen 5', desc: 'High efficiency 6-core processing' },
    { value: 'AMD Ryzen 7', family: 'amd', label: 'AMD Ryzen 7', desc: '8-core workstation powerhouse' },
    { value: 'AMD Ryzen 9', family: 'amd', label: 'AMD Ryzen 9', desc: 'Top-tier creator & gaming CPU' },
    { value: 'Apple M-series', family: 'apple', label: 'Apple M-series (M2 / M3 / M4)', desc: 'Industry-leading battery life & unified memory' }
  ],
  displaySize: [
    { value: '14"', label: '14" Compact', desc: 'Maximum portability for travel & classrooms' },
    { value: '15.6"', label: '15.6" Standard', desc: 'Classic balanced screen real estate' },
    { value: '16"', label: '16" Modern 16:10', desc: 'Expanded vertical workspace for coding & spreadsheets' },
    { value: '17"', label: '17" Workstation', desc: 'Immersive desktop replacement display' }
  ],
  refreshRate: [
    { value: '60Hz', label: '60Hz Standard', desc: 'Saves battery for office & programming' },
    { value: '90Hz', label: '90Hz Smooth', desc: 'Noticeably fluid UI navigation' },
    { value: '120Hz', label: '120Hz Fast', desc: 'Crisp motion for creator panels & OLED' },
    { value: '144Hz', label: '144Hz Esports', desc: 'Classic gaming baseline with zero tear' },
    { value: '165Hz', label: '165Hz Pro', desc: 'Ultra-low response gaming rate' },
    { value: '240Hz', label: '240Hz Extreme', desc: 'Tournament grade esports refresh' }
  ],
  batteryPriority: [
    { value: 'Low', label: 'Low', desc: 'Desk bound, mostly plugged in with AC adapter' },
    { value: 'Balanced', label: 'Balanced', desc: '6-8 hours for college classes and meetings' },
    { value: 'High', label: 'High Priority', desc: '10-16+ hours all-day untethered endurance' }
  ],
  portability: [
    { value: 'Desktop replacement', label: 'Desktop replacement', desc: '2.2+ kg, heavy cooling, stationary power' },
    { value: 'Balanced', label: 'Balanced', desc: '1.6 - 2.0 kg, easy backpack fit' },
    { value: 'Lightweight', label: 'Lightweight', desc: '1.3 - 1.5 kg, comfortable campus walking' },
    { value: 'Ultra portable', label: 'Ultra portable', desc: '< 1.3 kg, featherweight sleek thin-and-light' }
  ]
};

export const BUDGET_TIERS = [
  { id: 'under_40k', label: 'Under ₹40,000', max: 40000, desc: 'Essential entry laptops' },
  { id: '40k_50k', label: '₹40,000 - ₹50,000', max: 50000, desc: 'Student sweet spot' },
  { id: '50k_60k', label: '₹50,000 - ₹60,000', max: 60000, desc: 'Mid-range productivity' },
  { id: '60k_70k', label: '₹60,000 - ₹70,000', max: 70000, desc: 'Balanced AI & coding baseline' },
  { id: '70k_80k', label: '₹70,000 - ₹80,000', max: 80000, desc: 'Dedicated RTX GPU entry' },
  { id: '80k_100k', label: '₹80,000 - ₹1,00,000', max: 100000, desc: 'High performance & Apple M-series' },
  { id: '100k_150k', label: '₹1,00,000 - ₹1,50,000', max: 150000, desc: 'Pro workstations & RTX 4060/4070' },
  { id: 'above_150k', label: 'Above ₹1,50,000', max: 250000, desc: 'Flagship studio & extreme creator tier' }
];

export interface RecommendationScores {
  overallMatch: number;
  courseFit: number;
  performance: number;
  gpuFit: number;
  ramFit: number;
  battery: number;
  value: number;
}

export interface RecommendedLaptopItem {
  product: Product;
  rankBadge: string;
  rankTitle: string;
  scores: RecommendationScores;
  justification: string;
}

export interface UserPreferencesPayload {
  category: string;
  course: string;
  specialization: string;
  workloads: string[];
  ram: string;
  storage: string;
  gpu: string;
  cpu: string;
  displaySize: string;
  refreshRate: string;
  batteryPriority: string;
  portability: string;
  budgetMax: number;
}

/**
 * Intelligent Multi-Factor Recommendation Scoring Engine
 * Analyzes Course + Specialization + Workloads + Hardware + Budget against Product Catalog
 */
export function calculateLaptopRecommendations(
  prefs: UserPreferencesPayload,
  products: Product[]
): {
  topFive: RecommendedLaptopItem[];
  overallMatchAvg: number;
  overallScores: RecommendationScores;
} {
  const {
    category,
    course,
    specialization,
    workloads,
    ram,
    storage,
    gpu,
    cpu,
    batteryPriority,
    portability,
    budgetMax
  } = prefs;

  // Determine technical intent demands
  const needsDedicatedGpu =
    workloads.some(w => ['deep_learning', 'generative_ai', 'computer_vision', '3d_cad', 'video_editing', 'gaming'].includes(w)) ||
    ['Mechanical Engineering', 'Aerospace Engineering', 'Civil Engineering', 'Animation', 'VFX', '3D Design', 'Architecture'].includes(course) ||
    ['Deep Learning', 'CAD', 'SolidWorks', 'Unreal Engine', '3D Maya/Houdini'].includes(specialization);

  const needsHighRam =
    workloads.some(w => ['deep_learning', 'generative_ai', 'advanced_programming', 'cyber_security', '3d_cad'].includes(w)) ||
    ['MCA', 'Machine Learning', 'Data Science', 'Deep Learning'].includes(course) ||
    ['32 GB', '64 GB'].includes(ram);

  const isLightweightOfficeCourse =
    ['Commerce & Management', 'Law & Humanities', 'Medical & Healthcare'].includes(category) ||
    ['MBA', 'BBA', 'B.Com', 'LLB', 'General College', 'Office & Productivity'].includes(course);

  // Score each product individually
  const scored = products.map(product => {
    // 1. Course Fit (0 - 100)
    let courseFit = 75;
    if (needsDedicatedGpu) {
      if (product.gpu.includes('RTX') || product.gpuScore >= 75) {
        courseFit += 22;
      } else {
        courseFit -= 20;
      }
    }

    if (isLightweightOfficeCourse) {
      if (product.brand === 'Apple' || product.specs.weightKg <= 1.5 || product.batteryScore >= 85) {
        courseFit += 20;
      }
      if (product.specs.weightKg > 2.1) {
        courseFit -= 15;
      }
    }

    if (needsHighRam) {
      if (product.ramGb >= 16) courseFit += 12;
      if (product.ramGb >= 32) courseFit += 8;
      if (product.ramGb < 16) courseFit -= 15;
    }
    courseFit = Math.min(99, Math.max(55, courseFit));

    // 2. Performance Score (0 - 100)
    let performance = product.performanceScore || 85;
    if (cpu && product.processor.toLowerCase().includes(cpu.toLowerCase().split(' ')[0])) {
      performance += 6;
    }
    performance = Math.min(99, Math.max(60, performance));

    // 3. GPU Fit Score (0 - 100)
    let gpuFit = 70;
    if (gpu === 'No dedicated GPU' || gpu.includes('Integrated')) {
      gpuFit = product.gpu.includes('Iris') || product.gpu.includes('Radeon') || product.brand === 'Apple' ? 95 : 75;
    } else if (gpu.includes('RTX')) {
      const targetModel = gpu.replace('NVIDIA ', '').trim();
      if (product.gpu.includes(targetModel)) {
        gpuFit = 98;
      } else if (product.gpu.includes('RTX')) {
        gpuFit = 88;
      } else {
        gpuFit = 50;
      }
    } else {
      gpuFit = product.gpuScore || 70;
    }
    gpuFit = Math.min(99, Math.max(50, gpuFit));

    // 4. RAM Fit Score (0 - 100)
    let ramFit = 70;
    const targetRamGb = parseInt(ram) || 16;
    if (product.ramGb >= targetRamGb) {
      ramFit = 96;
    } else if (product.ramGb >= 16) {
      ramFit = 85;
    } else {
      ramFit = 65;
    }

    // 5. Battery Score (0 - 100)
    let battery = product.batteryScore || 75;
    if (batteryPriority === 'High Priority' || batteryPriority === 'High') {
      battery = product.brand === 'Apple' ? 98 : Math.min(95, battery + 10);
    }

    // 6. Value for Money Score (0 - 100)
    let value = product.valueScore || 85;
    if (product.price <= budgetMax) {
      const budgetDelta = (budgetMax - product.price) / budgetMax;
      if (budgetDelta >= 0 && budgetDelta <= 0.25) {
        value += 8; // Optimal utilization of budget
      } else if (budgetDelta > 0.25) {
        value += 12; // Massive savings
      }
    } else {
      // Over budget penalty
      const overPct = (product.price - budgetMax) / budgetMax;
      value -= Math.round(overPct * 40);
    }
    value = Math.min(99, Math.max(45, value));

    // 7. Portability adjustment
    if (portability === 'Ultra portable' || portability === 'Lightweight') {
      if (product.specs.weightKg <= 1.45) courseFit += 5;
      if (product.specs.weightKg > 2.0) courseFit -= 8;
    }

    // Overall Weighted Match
    const overallMatch = Math.min(
      99,
      Math.max(
        50,
        Math.round(
          courseFit * 0.28 +
          performance * 0.24 +
          gpuFit * 0.16 +
          ramFit * 0.14 +
          battery * 0.08 +
          value * 0.10
        )
      )
    );

    return {
      product,
      scores: {
        overallMatch,
        courseFit,
        performance,
        gpuFit,
        ramFit,
        battery,
        value
      }
    };
  });

  // Sort by overall match descending
  const sorted = [...scored].sort((a, b) => b.scores.overallMatch - a.scores.overallMatch);

  // Distinct selection for the Top 5 Archetypes:
  // #1 Best Match (highest overall match within or near budget)
  const bestMatchCandidate = sorted.find(s => s.product.price <= budgetMax * 1.1) || sorted[0];

  // #2 Strong Alternative (distinct model with highest remaining match)
  const strongAltCandidate = sorted.find(s => 
    s.product.id !== bestMatchCandidate.product.id && 
    s.product.brand !== bestMatchCandidate.product.brand &&
    s.product.price <= budgetMax * 1.15
  ) || sorted.find(s => s.product.id !== bestMatchCandidate.product.id) || sorted[1];

  // #3 Best Value (highest value score within budget)
  const remainingForValue = sorted.filter(s => 
    s.product.id !== bestMatchCandidate.product.id && 
    s.product.id !== strongAltCandidate.product.id &&
    s.product.price <= budgetMax
  );
  const bestValueCandidate = remainingForValue.sort((a, b) => b.scores.value - a.scores.value)[0] || sorted[2];

  // #4 Best Performance (highest performance score)
  const remainingForPerf = sorted.filter(s => 
    s.product.id !== bestMatchCandidate.product.id && 
    s.product.id !== strongAltCandidate.product.id &&
    s.product.id !== bestValueCandidate.product.id
  );
  const bestPerfCandidate = remainingForPerf.sort((a, b) => b.scores.performance - a.scores.performance)[0] || sorted[3];

  // #5 Budget Choice (lowest price with acceptable course fit >= 70)
  const remainingForBudget = sorted.filter(s => 
    s.product.id !== bestMatchCandidate.product.id && 
    s.product.id !== strongAltCandidate.product.id &&
    s.product.id !== bestValueCandidate.product.id &&
    s.product.id !== bestPerfCandidate.product.id &&
    s.product.price <= budgetMax * 0.85
  );
  const budgetChoiceCandidate = remainingForBudget.sort((a, b) => a.product.price - b.product.price)[0] || sorted[4] || sorted[sorted.length - 1];

  const topFive: RecommendedLaptopItem[] = [
    {
      product: bestMatchCandidate.product,
      rankBadge: '#1 Best Match',
      rankTitle: 'Optimal Choice for Your Academic & Workload Profile',
      scores: bestMatchCandidate.scores,
      justification: `Highest multi-factor match for ${course}${specialization ? ` (${specialization})` : ''}. Calibrated CPU, RAM (${bestMatchCandidate.product.ram}), and thermals perfectly balance your technical workloads within budget.`
    },
    {
      product: strongAltCandidate.product,
      rankBadge: '#2 Strong Alternative',
      rankTitle: 'Top Performing Cross-Brand Alternative',
      scores: strongAltCandidate.scores,
      justification: `Offers comparable computing power with alternative display panel and chassis engineering from ${strongAltCandidate.product.brand}.`
    },
    {
      product: bestValueCandidate.product,
      rankBadge: '#3 Best Value',
      rankTitle: 'Highest Price-to-Performance Ratio',
      scores: bestValueCandidate.scores,
      justification: `Delivers maximum spec output per rupee with ₹${(bestValueCandidate.product.mrp - bestValueCandidate.product.price).toLocaleString('en-IN')} in store and bank offer savings.`
    },
    {
      product: bestPerfCandidate.product,
      rankBadge: '#4 Best Performance',
      rankTitle: 'Peak Compute & Benchmark Powerhouse',
      scores: bestPerfCandidate.scores,
      justification: `Engineered for heavy multi-core throughput, raw clock speeds (${bestPerfCandidate.product.processor}), and high GPU rendering headroom.`
    },
    {
      product: budgetChoiceCandidate.product,
      rankBadge: '#5 Budget Choice',
      rankTitle: 'Most Affordable Qualified Configuration',
      scores: budgetChoiceCandidate.scores,
      justification: `At ₹${budgetChoiceCandidate.product.price.toLocaleString('en-IN')}, this meets essential requirements for ${course} while leaving the maximum financial savings in your pocket.`
    }
  ];

  const overallScores: RecommendationScores = {
    overallMatch: topFive[0].scores.overallMatch,
    courseFit: topFive[0].scores.courseFit,
    performance: topFive[0].scores.performance,
    gpuFit: topFive[0].scores.gpuFit,
    ramFit: topFive[0].scores.ramFit,
    battery: topFive[0].scores.battery,
    value: topFive[0].scores.value
  };

  const overallMatchAvg = topFive[0].scores.overallMatch;

  return {
    topFive,
    overallMatchAvg,
    overallScores
  };
}

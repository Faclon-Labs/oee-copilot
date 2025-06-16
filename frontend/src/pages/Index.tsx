import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, Brain, ChevronDown, Send, ArrowLeft, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { DataService, Machine, SearchResult } from '@/services/dataService';

// Initialize the data service
const dataService = DataService.getInstance();

// Realistic Manufacturing Data
const realtimeData = {
  currentStatus: {
    machine: "RUNNING",
    operator: "Rajesh Kumar",
    shift: "Day Shift (6:00 AM - 2:00 PM)",
    job: "Bearing Assembly - BA-2024-156",
    runningDuration: "3h 47m",
    outputRate: 156,
    targetRate: 150,
    efficiency: 104,
    quality: "All checks passing",
    temperature: 78,
    vibration: "Within limits",
    toolWear: 67,
    nextMaintenance: "Due in 4 days"
  },
  dailyProduction: [
    { hour: '06:00', actual: 120, target: 150, cumulative: 120 },
    { hour: '07:00', actual: 145, target: 150, cumulative: 265 },
    { hour: '08:00', actual: 158, target: 150, cumulative: 423 },
    { hour: '09:00', actual: 162, target: 150, cumulative: 585 },
    { hour: '10:00', actual: 149, target: 150, cumulative: 734 },
    { hour: '11:00', actual: 156, target: 150, cumulative: 890 },
    { hour: '12:00', actual: 148, target: 150, cumulative: 1038 },
    { hour: '13:00', actual: 163, target: 150, cumulative: 1201 },
    { hour: '14:00', actual: 157, target: 150, cumulative: 1358 }
  ]
};

const oeeData = {
  current: {
    overall: 87.2,
    availability: 92.5,
    performance: 89.1,
    quality: 95.8,
    targetOEE: 85.0
  },
  trend: [
    { date: '2024-01-15', oee: 82.3, availability: 89.1, performance: 87.2, quality: 94.1 },
    { date: '2024-01-16', oee: 84.1, availability: 91.2, performance: 88.1, quality: 95.2 },
    { date: '2024-01-17', oee: 86.2, availability: 93.1, performance: 89.3, quality: 96.1 },
    { date: '2024-01-18', oee: 85.8, availability: 92.8, performance: 88.9, quality: 95.8 },
    { date: '2024-01-19', oee: 87.2, availability: 92.5, performance: 89.1, quality: 95.8 }
  ],
  shiftComparison: [
    { shift: 'Day (6AM-2PM)', oee: 87.2, availability: 92.5, performance: 89.1, quality: 95.8 },
    { shift: 'Evening (2PM-10PM)', oee: 84.1, availability: 89.3, performance: 87.8, quality: 94.2 },
    { shift: 'Night (10PM-6AM)', oee: 79.6, availability: 86.1, performance: 85.2, quality: 92.8 }
  ],
  operatorPerformance: [
    { operator: 'Rajesh K.', efficiency: 104, oee: 87.2, shifts: 'Day', experience: '5 years' },
    { operator: 'Dinesh S.', efficiency: 96, oee: 84.1, shifts: 'Evening', experience: '3 years' },
    { operator: 'Suresh M.', efficiency: 89, oee: 79.6, shifts: 'Night', experience: '2 years' },
    { operator: 'Ramesh P.', efficiency: 101, oee: 86.8, shifts: 'Day', experience: '4 years' }
  ]
};

const downtimeData = {
  todayBreakdown: [
    { cause: 'Process Setting', duration: 18, percentage: 50, color: '#ff6b6b' },
    { cause: 'Tool Change', duration: 12, percentage: 33.3, color: '#4ecdc4' },
    { cause: 'Material Loading', duration: 6, percentage: 16.7, color: '#45b7d1' }
  ],
  weeklyTrend: [
    { day: 'Mon', planned: 8, unplanned: 2, maintenance: 1 },
    { day: 'Tue', planned: 6, unplanned: 4, maintenance: 0 },
    { day: 'Wed', planned: 8, unplanned: 1, maintenance: 2 },
    { day: 'Thu', planned: 7, unplanned: 3, maintenance: 1 },
    { day: 'Fri', planned: 8, unplanned: 2, maintenance: 0 },
    { day: 'Sat', planned: 5, unplanned: 1, maintenance: 3 },
    { day: 'Today', planned: 6, unplanned: 3, maintenance: 0 }
  ],
  rootCauses: [
    { issue: 'Process Setting Delays', frequency: 45, impact: 'High', trend: 'Increasing' },
    { issue: 'Tool Wear', frequency: 32, impact: 'Medium', trend: 'Stable' },
    { issue: 'Material Shortage', frequency: 18, impact: 'High', trend: 'Decreasing' },
    { issue: 'Operator Training Gap', frequency: 28, impact: 'Medium', trend: 'Increasing' }
  ]
};

const qualityData = {
  defectTypes: [
    { type: 'Welding Crack', count: 12, percentage: 40, cost: 2400 },
    { type: 'Dimension Issue', count: 8, percentage: 26.7, cost: 1600 },
    { type: 'Surface Finish', count: 6, percentage: 20, cost: 1200 },
    { type: 'Material Defect', count: 4, percentage: 13.3, cost: 800 }
  ],
  qualityTrend: [
    { date: '2024-01-15', passed: 94.1, rejected: 5.9, rework: 3.2 },
    { date: '2024-01-16', passed: 95.2, rejected: 4.8, rework: 2.8 },
    { date: '2024-01-17', passed: 96.1, rejected: 3.9, rework: 2.1 },
    { date: '2024-01-18', passed: 95.8, rejected: 4.2, rework: 2.5 },
    { date: '2024-01-19', passed: 95.8, rejected: 4.2, rework: 2.4 }
  ]
};

// Chart Components
const OEEChart = ({ data }: { data: any[] }) => (
  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[70, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="oee" stroke="#3b82f6" strokeWidth={3} name="OEE %" />
        <Line type="monotone" dataKey="availability" stroke="#10b981" strokeWidth={2} name="Availability %" />
        <Line type="monotone" dataKey="performance" stroke="#f59e0b" strokeWidth={2} name="Performance %" />
        <Line type="monotone" dataKey="quality" stroke="#8b5cf6" strokeWidth={2} name="Quality %" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ProductionChart = ({ data }: { data: any[] }) => (
  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="target" stackId="1" stroke="#94a3b8" fill="#e2e8f0" name="Target" />
        <Area type="monotone" dataKey="actual" stackId="2" stroke="#3b82f6" fill="#3b82f6" name="Actual" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const DowntimeChart = ({ data }: { data: any[] }) => (
  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="duration"
          label={({ name, percentage }) => `${name}: ${percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const ShiftComparisonChart = ({ data }: { data: any[] }) => (
  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="shift" />
        <YAxis domain={[70, 100]} />
        <Tooltip />
        <Bar dataKey="oee" fill="#3b82f6" name="OEE %" />
        <Bar dataKey="availability" fill="#10b981" name="Availability %" />
        <Bar dataKey="performance" fill="#f59e0b" name="Performance %" />
        <Bar dataKey="quality" fill="#8b5cf6" name="Quality %" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const WeeklyDowntimeChart = ({ data }: { data: any[] }) => (
  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="planned" stackId="a" fill="#10b981" name="Planned Downtime" />
        <Bar dataKey="unplanned" stackId="a" fill="#ef4444" name="Unplanned Downtime" />
        <Bar dataKey="maintenance" stackId="a" fill="#f59e0b" name="Maintenance" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ParetoChart = ({ data, title }: { data: any[]; title: string }) => (
  <div className="mt-4 h-80">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={title === 'Downtime' ? 'cause' : 'type'}
          angle={-45} 
          textAnchor="end" 
          height={80}
          interval={0}
        />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'Cumulative %') return [`${value}%`, name];
            return [value, name];
          }}
        />
        <Bar 
          yAxisId="left" 
          dataKey={title === 'Downtime' ? 'duration' : 'count'}
          fill="#3b82f6" 
          name={title === 'Downtime' ? 'Duration (min)' : 'Count'}
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="cumulativePercentage" 
          stroke="#ef4444" 
          strokeWidth={3}
          name="Cumulative %"
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  theme: string;
  questions: string[];
  suggestions: string[];
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chart?: React.ReactNode;
}

const categories: Category[] = [
  {
    id: 'live-data',
    title: 'Live Data',
    icon: Activity,
    theme: 'from-emerald-500 to-teal-500',
    questions: [
      "What is the current machine status?",
      "Show me live production rate",
      "Who is the current operator on duty?",
      "Current shift performance vs target",
      "Real-time OEE score for this shift"
    ],
    suggestions: ["What is current machine status?", "Show live production rate"]
  },
  {
    id: 'kpi-analysis',
    title: 'KPI Analysis',
    icon: BarChart3,
    theme: 'from-blue-500 to-indigo-500',
    questions: [
      "Calculate overall OEE for today",
      "Show availability, performance, and quality breakdown",
      "Compare OEE across different shifts",
      "Which operator has the highest efficiency?",
      "Cycle time performance vs standard targets"
    ],
    suggestions: ["Calculate overall OEE", "Compare shift performance"]
  },
  {
    id: 'root-cause',
    title: 'Root Cause & Improvement',
    icon: Brain,
    theme: 'from-purple-500 to-pink-500',
    questions: [
      "Why was there frequent downtime during recent shifts?",
      "Root cause analysis for mold change delays",
      "What causes flash defects?",
      "Suggest improvements to reduce cycle time",
      "Which machine needs immediate attention?",
      "Downtime analysis with top reasons",
      "Rejection analysis with defect breakdown"
    ],
    suggestions: ["Analyze downtime patterns", "What causes flash defects?"]
  }
];

const rotatingQuestions = [
  "What's our current OEE score?",
  "Which machine has the best performance?",
  "What's causing the mold change delays?",
  "How can we reduce cycle time?",
  "Which operator is most efficient?",
  "Show me today's production targets"
];

// Enhanced Loading Animation Component
const LoadingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState([0, 0, 0]);

  useEffect(() => {
    const steps = [
      { delay: 0, duration: 800, label: 'Connecting to production systems' },
      { delay: 900, duration: 1000, label: 'Analyzing machine data' },
      { delay: 2000, duration: 600, label: 'Generating insights' }
    ];

    steps.forEach((step, index) => {
      // Start each step after its delay
      setTimeout(() => {
        setCurrentStep(index);
        
        // Animate progress bar filling
        let progress = 0;
        const increment = 100 / (step.duration / 50); // Update every 50ms
        
        const progressInterval = setInterval(() => {
          progress += increment;
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
          }
          
          setStepProgress(prev => {
            const newProgress = [...prev];
            newProgress[index] = Math.min(progress, 100);
            return newProgress;
          });
        }, 50);
      }, step.delay);
    });

    // Cleanup function
    return () => {
      setCurrentStep(0);
      setStepProgress([0, 0, 0]);
    };
  }, []);

  const steps = [
    { 
      label: 'Connecting to production systems', 
      color: 'green',
      icon: '🔗',
      bgColor: 'bg-green-500',
      progressColor: 'from-green-400 to-green-500'
    },
    { 
      label: 'Analyzing machine data', 
      color: 'blue',
      icon: '⚙️',
      bgColor: 'bg-blue-500',
      progressColor: 'from-blue-400 to-blue-500'
    },
    { 
      label: 'Generating insights', 
      color: 'purple',
      icon: '🧠',
      bgColor: 'bg-purple-500',
      progressColor: 'from-purple-400 to-purple-500'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
            <Brain className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">OEE AI Assistant</h4>
            <p className="text-xs text-gray-500">Analyzing production data...</p>
          </div>
        </div>
        
        {/* Main Loading Animation */}
        <div className="space-y-4">
          {/* AI Thinking Animation */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="relative">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-r-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-2">Processing your query...</div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>

          {/* Sequential Data Analysis Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  currentStep >= index 
                    ? 'bg-gray-50 border border-gray-200' 
                    : 'bg-gray-25 opacity-60'
                }`}
              >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentStep >= index 
                    ? `${step.bgColor} animate-pulse` 
                    : 'bg-gray-300'
                }`}>
                  {stepProgress[index] === 100 && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>
                
                <span className={`text-sm transition-colors duration-300 ${
                  currentStep >= index ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}>
                  {step.icon} {step.label}
                </span>
                
                <div className="ml-auto">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${step.progressColor} rounded-full transition-all duration-300 ease-out`}
                      style={{ 
                        width: `${stepProgress[index]}%`,
                        transform: stepProgress[index] > 0 ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left'
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round(stepProgress[index])}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Manufacturing Themed Animation */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
            <div className="relative">
              {/* Rotating Gears */}
              <div className="w-12 h-12 border-4 border-gray-300 rounded-full relative">
                <div className="absolute inset-1 border-2 border-blue-400 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-600 animate-pulse" />
                </div>
              </div>
              
              {/* Orbiting Data Points */}
              <div className="absolute -inset-4">
                <div className="relative w-20 h-20">
                  <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-spin" style={{ 
                    top: '0px', 
                    left: '50%', 
                    transformOrigin: '50% 40px',
                    animationDuration: '3s'
                  }}></div>
                  <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-spin" style={{ 
                    top: '50%', 
                    right: '0px', 
                    transformOrigin: '-40px 50%',
                    animationDuration: '3s',
                    animationDelay: '1s'
                  }}></div>
                  <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-spin" style={{ 
                    bottom: '0px', 
                    left: '50%', 
                    transformOrigin: '50% -40px',
                    animationDuration: '3s',
                    animationDelay: '2s'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Indicator */}
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-2">
              AI Analysis in Progress - Step {Math.min(currentStep + 1, 3)} of 3
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStep + 1) / 3) * 100}%`
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {currentStep === 0 && 'Establishing connection...'}
              {currentStep === 1 && 'Processing data streams...'}
              {currentStep === 2 && 'Finalizing analysis...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Remove the SmoothStreamingText component and replace with a simple component that shows full content
const InstantResponseText = ({ content }: { content: string }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content }}
      className="leading-relaxed animate-fade-in"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6'
      }}
    />
  );
};

// Follow-up Prompts Component
const FollowUpPrompts = ({ lastQuery, onPromptClick }: { 
  lastQuery: string; 
  onPromptClick: (prompt: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show follow-up prompts after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const generateFollowUpPrompts = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    // Context-aware follow-up questions based on the original query
    if (lowerQuery.includes('status') || lowerQuery.includes('current')) {
      return [
        "What caused the recent downtime?",
        "Which operator is performing best today?",
        "Show me the cycle time breakdown"
      ];
    }
    
    if (lowerQuery.includes('oee') || lowerQuery.includes('efficiency')) {
      return [
        "Compare OEE across different shifts",
        "Which machine has the best OEE score?",
        "What's the biggest factor affecting OEE?"
      ];
    }
    
    if (lowerQuery.includes('maintenance') || lowerQuery.includes('problem') || lowerQuery.includes('downtime')) {
      return [
        "What are the root causes of mold change delays?",
        "Which problems occur most frequently?",
        "How much production time was lost?"
      ];
    }
    
    if (lowerQuery.includes('quality') || lowerQuery.includes('defect')) {
      return [
        "What's causing the flash defects?",
        "Which operator has the best quality record?",
        "Show me the defect trend analysis"
      ];
    }
    
    if (lowerQuery.includes('operator') || lowerQuery.includes('performance')) {
      return [
        "Compare all operators' performance",
        "Which shift performs best?",
        "Show operator efficiency rankings"
      ];
    }
    
    if (lowerQuery.includes('production') || lowerQuery.includes('output')) {
      return [
        "How can we reduce cycle time?",
        "Show me production vs targets",
        "What are the peak production hours?"
      ];
    }
    
    // Default follow-up questions for general queries
    return [
      "What's the current overall equipment effectiveness?",
      "Which machines need immediate attention?",
      "How do different shifts compare?"
    ];
  };

  const followUpPrompts = generateFollowUpPrompts(lastQuery);

  if (!isVisible) return null;

  return (
    <div className="mt-4 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs">💡</span>
          </div>
          <h4 className="font-semibold text-blue-900">Continue exploring with these questions:</h4>
        </div>
        
        <div className="grid gap-2">
          {followUpPrompts.slice(0, 3).map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className="text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">
                  {prompt}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-center">
          <button 
            onClick={() => {
              const randomPrompts = followUpPrompts.slice(3);
              if (randomPrompts.length > 0) {
                const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
                onPromptClick(randomPrompt);
              }
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Or try a different question →
          </button>
        </div>
      </div>
    </div>
  );
};

// Smart Conversation Suggestions Component
const ConversationSuggestions = ({ conversationHistory, onSuggestionClick }: {
  conversationHistory: Message[];
  onSuggestionClick: (suggestion: string) => void;
}) => {
  const generateSmartSuggestions = (): string[] => {
    const topics = conversationHistory.map(msg => msg.content.toLowerCase());
    const hasDiscussed = (topic: string) => topics.some(content => content.includes(topic));
    
    const suggestions: string[] = [];
    
    // Progressive conversation flow
    if (!hasDiscussed('oee')) {
      suggestions.push("What's our overall OEE performance?");
    }
    
    if (hasDiscussed('oee') && !hasDiscussed('downtime')) {
      suggestions.push("What's causing our downtime issues?");
    }
    
    if (hasDiscussed('downtime') && !hasDiscussed('operator')) {
      suggestions.push("Compare operator performance across shifts");
    }
    
    // Advanced analysis suggestions
    if (conversationHistory.length > 2) {
      suggestions.push(
        "Which machine needs immediate attention?",
        "Show me the top 3 improvement opportunities"
      );
    }
    
    return suggestions.slice(0, 3);
  };

  const suggestions = generateSmartSuggestions();
  
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
      <div className="text-xs text-purple-700 font-medium mb-2">💭 Smart suggestions based on our conversation:</div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1 bg-white text-xs text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Message Component with Follow-up Prompts
const MessageBubble = ({ message, isLoading, isLast, onFollowUpClick, conversationHistory }: { 
  message: Message; 
  isLoading?: boolean; 
  isLast?: boolean;
  onFollowUpClick?: (prompt: string) => void;
  conversationHistory?: Message[];
}) => {
  const [showChart, setShowChart] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  useEffect(() => {
    if (message.chart && !isLoading) {
      const timer = setTimeout(() => setShowChart(true), 500);
      return () => clearTimeout(timer);
    }
  }, [message.chart, isLoading]);

  const handleExportPDF = () => {
    setExportStatus('Preparing PDF...');
    
    // Generate a title based on message content
    const title = message.content.includes('OEE') ? 'OEE Analysis Report' :
                  message.content.includes('Downtime') ? 'Downtime Analysis Report' :
                  message.content.includes('Rejection') ? 'Quality Analysis Report' :
                  message.content.includes('Status') ? 'Machine Status Report' :
                  'Production Analysis Report';
    
    setTimeout(() => {
      exportToPDF(message.content, title);
      setExportStatus('PDF Generated');
      setTimeout(() => setExportStatus(''), 3000);
    }, 500);
  };

  if (message.type === 'user') {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl px-6 py-4 shadow-lg">
        <p className="text-white font-medium">{message.content}</p>
      </div>
    );
  }

  // Show loading animation if isLoading is true
  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative">
      {exportStatus && (
        <div className="absolute -top-8 right-0 bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium animate-fade-in whitespace-nowrap">
          ✓ {exportStatus}
        </div>
      )}
      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">OEE AI Assistant</h4>
                <p className="text-xs text-gray-500">Analysis complete</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
              disabled={!!exportStatus}
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
          
          <InstantResponseText content={message.content} />
          
          {message.chart && showChart && (
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 animate-slide-up">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-700">Interactive Data Visualization</span>
                <div className="ml-auto">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Live Data</span>
                </div>
              </div>
              <div className="transform transition-all duration-700 ease-out">
                {message.chart}
              </div>
            </div>
          )}
          
          {/* Show follow-up prompts only for the last assistant message */}
          {isLast && onFollowUpClick && (
            <>
              <FollowUpPrompts 
                lastQuery={conversationHistory?.filter(m => m.type === 'user').pop()?.content || ''} 
                onPromptClick={onFollowUpClick}
              />
              {conversationHistory && conversationHistory.length > 2 && (
                <ConversationSuggestions 
                  conversationHistory={conversationHistory}
                  onSuggestionClick={onFollowUpClick}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Response Card Component
const ResponseCard = ({ icon, title, children, className = "" }: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm ${className}`}>
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const MetricCard = ({ label, value, target, status, trend }: {
  label: string;
  value: string | number;
  target?: string | number;
  status?: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}) => {
  const statusColors = {
    good: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    critical: 'bg-red-50 text-red-700 border-red-200'
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️', 
    stable: '→'
  };

  return (
    <div className={`p-3 rounded-lg border ${status ? statusColors[status] : 'bg-gray-50 border-gray-200'}`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{value}{typeof value === 'number' && '%'}</div>
        <div className="text-right">
          {target && <div className="text-xs text-gray-500">Target: {target}</div>}
          {trend && <div className="text-lg">{trendIcons[trend]}</div>}
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ priority, title, impact, timeline }: {
  priority: 'high' | 'medium' | 'low';
  title: string;
  impact: string;
  timeline: string;
}) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-start p-3 bg-gray-50 rounded-lg mb-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${priorityColors[priority]}`}>
        {priority.toUpperCase()}
      </span>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">Impact: {impact}</div>
        <div className="text-sm text-blue-600">Timeline: {timeline}</div>
      </div>
    </div>
  );
};

// Modern Response Formatter
const ModernResponseFormatter = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 12);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowCards(true), 200);
    }
  }, [currentIndex, content]);

  return (
    <div className="space-y-4">
      <div 
        dangerouslySetInnerHTML={{ __html: displayedContent }}
        className="leading-relaxed"
      />
      {currentIndex < content.length && (
        <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-1"></span>
      )}
      {showCards && (
        <div className="animate-fade-in">
          {/* Cards will be rendered here based on response type */}
        </div>
      )}
    </div>
  );
};

// Conversation Summary Component
const ConversationSummary = ({ messages }: { messages: Message[] }) => {
  if (messages.length < 4) return null; // Show only after 2+ exchanges

  const userQueries = messages.filter(m => m.type === 'user').map(m => m.content);
  const topics = userQueries.map(query => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('status') || lowerQuery.includes('current')) return 'Status';
    if (lowerQuery.includes('oee') || lowerQuery.includes('efficiency')) return 'OEE';
    if (lowerQuery.includes('maintenance') || lowerQuery.includes('downtime')) return 'Maintenance';
    if (lowerQuery.includes('quality') || lowerQuery.includes('defect')) return 'Quality';
    if (lowerQuery.includes('operator') || lowerQuery.includes('performance')) return 'Performance';
    if (lowerQuery.includes('production') || lowerQuery.includes('output')) return 'Production';
    return 'Analysis';
  });

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-xs">📊</span>
        </div>
        <h4 className="font-semibold text-gray-900">Conversation Summary</h4>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {index + 1}. {topic}
            </span>
            {index < topics.length - 1 && (
              <span className="text-gray-400">→</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-600">
        {userQueries.length} questions asked • Comprehensive analysis in progress
      </div>
    </div>
  );
};

// PDF Export Function
const exportToPDF = (content: string, title: string = 'OEE Analysis Report') => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  // Clean up the HTML content for PDF
  const cleanContent = content
    .replace(/class="/g, 'style="')
    .replace(/className="/g, 'style="')
    .replace(/bg-gradient-to-r from-[\w-]+ to-[\w-]+/g, 'background: linear-gradient(to right, #3b82f6, #1d4ed8)')
    .replace(/bg-[\w-]+/g, 'background-color: #f8fafc')
    .replace(/text-[\w-]+/g, 'color: #1f2937')
    .replace(/border-[\w-]+/g, 'border-color: #e5e7eb')
    .replace(/rounded-[\w-]+/g, 'border-radius: 8px')
    .replace(/p-[\w-]+/g, 'padding: 16px')
    .replace(/m-[\w-]+/g, 'margin: 16px')
    .replace(/mb-[\w-]+/g, 'margin-bottom: 16px')
    .replace(/mt-[\w-]+/g, 'margin-top: 16px')
    .replace(/grid-cols-[\w-]+/g, 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))')
    .replace(/flex/g, 'display: flex')
    .replace(/font-bold/g, 'font-weight: bold')
    .replace(/font-semibold/g, 'font-weight: 600')
    .replace(/text-[\w-]+/g, 'font-size: 14px');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #3b82f6;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        .content {
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background-color: #f8fafc;
        }
        .text-center {
          text-align: center;
        }
        .font-bold {
          font-weight: bold;
        }
        .text-2xl {
          font-size: 24px;
        }
        .text-lg {
          font-size: 18px;
        }
        .text-sm {
          font-size: 12px;
        }
        .text-xs {
          font-size: 10px;
        }
        .mb-3 {
          margin-bottom: 12px;
        }
        .mb-4 {
          margin-bottom: 16px;
        }
        .mb-6 {
          margin-bottom: 24px;
        }
        .p-4 {
          padding: 16px;
        }
        .p-6 {
          padding: 24px;
        }
        .bg-red-50 {
          background-color: #fef2f2;
        }
        .bg-green-50 {
          background-color: #f0fdf4;
        }
        .bg-blue-50 {
          background-color: #eff6ff;
        }
        .bg-yellow-50 {
          background-color: #fefce8;
        }
        .text-red-600 {
          color: #dc2626;
        }
        .text-green-600 {
          color: #16a34a;
        }
        .text-blue-600 {
          color: #2563eb;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .text-gray-900 {
          color: #111827;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin: 5px 0;
        }
        @media print {
          body {
            margin: 0;
            padding: 15px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>OEE AI Copilot - Smart Production Assistant</p>
      </div>
      <div class="content">
        ${cleanContent}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

const Index = () => {
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Rotating questions animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % rotatingQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateResponse = (question: string): { content: string; chart?: React.ReactNode } => {
    const searchResults = dataService.getRelevantData(question);
    const machine = searchResults.primaryMachine;
    const fleetStats = searchResults.fleetStats;
    const queryIntent = searchResults.queryIntent;
    const lowerQuestion = question.toLowerCase();

    // Specific question handlers for better relevance
    
    // Live production rate queries
    if (lowerQuestion.includes('live production') || lowerQuestion.includes('production rate')) {
      return {
        content: `
          <!-- Live Production Rate Analysis -->
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-6">
            <div class="flex items-center mb-4">
              <div class="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <h2 class="text-2xl font-bold text-gray-900">Live Production Rate - ${machine.name || 'Unknown Machine'}</h2>
              <span class="ml-auto px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ${(machine.realtimeData?.outputRate || 0) >= (machine.realtimeData?.targetRate || 1) ? '✓ On Target' : '⚠ Below Target'}
              </span>
            </div>
            <p class="text-gray-700 text-lg">Current output: <span class="font-bold text-green-600">${machine.realtimeData?.outputRate || 0} units/hour</span> vs target of <span class="font-bold text-blue-600">${machine.realtimeData?.targetRate || 0} units/hour</span></p>
            <p class="text-gray-600 mt-2">Cycle time: <span class="font-bold">${machine.realtimeData?.cycleTime || 0}s</span> (Target: ${machine.realtimeData?.targetCycleTime || 0}s) | Efficiency: <span class="font-bold">${machine.realtimeData?.efficiency || 0}%</span></p>
          </div>

          <!-- Hourly Production Breakdown -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Hourly Production</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              ${(machine.dailyProduction || []).slice(-6).map(hour => `
                <div class="p-3 ${(hour.actual || 0) >= (hour.target || 1) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-lg border">
                  <div class="text-sm text-gray-600">${hour.hour || 'N/A'}</div>
                  <div class="text-xl font-bold ${(hour.actual || 0) >= (hour.target || 1) ? 'text-green-600' : 'text-red-600'}">${hour.actual || 0}</div>
                  <div class="text-xs text-gray-500">Target: ${hour.target || 0}</div>
                  <div class="text-xs text-gray-500">Cycle: ${hour.cycleTime || 0}s</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Production Factors -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Production Factors</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Current Mold:</span>
                  <span class="font-bold text-gray-900">${machine.currentMold || 'No mold'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Material:</span>
                  <span class="font-bold text-gray-900">${machine.material || 'No material'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Injection Pressure:</span>
                  <span class="font-bold text-gray-900">${machine.realtimeData?.injectionPressure || 0} bar</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Cavity Count:</span>
                  <span class="font-bold text-gray-900">${machine.realtimeData?.cavityCount || 0} cavities</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Shot Weight:</span>
                  <span class="font-bold text-gray-900">${machine.realtimeData?.shotWeight || 0}g</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Material Temp:</span>
                  <span class="font-bold text-gray-900">${machine.realtimeData?.materialTemperature || 0}°C</span>
                </div>
              </div>
            </div>
          </div>
        `,
        chart: <ProductionChart data={machine.dailyProduction || []} />
      };
    }

    // Operator performance queries
    if (lowerQuestion.includes('operator') && (lowerQuestion.includes('best') || lowerQuestion.includes('highest') || lowerQuestion.includes('efficient'))) {
      const allMachines = dataService.getAllMachines();
      const operatorPerformance = allMachines.map(m => ({
        name: m.operator || 'Unknown',
        machine: m.name || 'Unknown Machine',
        efficiency: m.realtimeData?.efficiency || 0,
        oee: m.oeeData?.current?.overall || 0,
        outputRate: m.realtimeData?.outputRate || 0,
        shift: m.shift || 'Unknown',
        status: m.status || 'Unknown'
      })).sort((a, b) => b.efficiency - a.efficiency);

      return {
        content: `
          <!-- Operator Performance Ranking -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
            <div class="text-4xl font-bold text-blue-600 mb-3">👨‍🔧 Operator Performance Analysis</div>
            <p class="text-gray-700 text-lg">Ranking operators by efficiency and OEE performance</p>
          </div>

          <!-- Top Performer -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-yellow-600 text-lg">🥇</span>
              </span>
              Top Performer: ${operatorPerformance[0]?.name || 'No data'}
            </h3>
            <div class="grid md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-3xl font-bold text-green-600">${operatorPerformance[0]?.efficiency || 0}%</div>
                <div class="text-sm text-gray-600">Efficiency</div>
              </div>
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-3xl font-bold text-blue-600">${operatorPerformance[0]?.oee || 0}%</div>
                <div class="text-sm text-gray-600">OEE Score</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-3xl font-bold text-purple-600">${operatorPerformance[0]?.outputRate || 0}</div>
                <div class="text-sm text-gray-600">Units/Hour</div>
              </div>
              <div class="text-center p-4 bg-orange-50 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">${operatorPerformance[0]?.shift?.split(' ')[0] || 'Unknown'}</div>
                <div class="text-sm text-gray-600">Shift</div>
              </div>
            </div>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-700">Machine: <span class="font-medium">${operatorPerformance[0]?.machine || 'Unknown'}</span> | Status: <span class="font-medium text-green-600">${operatorPerformance[0]?.status || 'Unknown'}</span></div>
            </div>
          </div>

          <!-- Complete Operator Ranking -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">Complete Operator Ranking</h4>
            <div class="space-y-3">
              ${operatorPerformance.map((op, index) => `
                <div class="flex items-center justify-between p-3 ${index === 0 ? 'bg-green-50 border border-green-200' : index === operatorPerformance.length - 1 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'} rounded-lg">
                  <div class="flex items-center space-x-3">
                    <span class="w-8 h-8 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : index === 2 ? 'bg-orange-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ${index + 1}
                    </span>
                    <div>
                      <div class="font-medium text-gray-900">${op.name}</div>
                      <div class="text-sm text-gray-600">${op.machine} - ${op.shift?.split(' ')[0] || 'Unknown'} Shift</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold ${op.efficiency > 85 ? 'text-green-600' : op.efficiency > 70 ? 'text-yellow-600' : 'text-red-600'}">${op.efficiency}%</div>
                    <div class="text-sm text-gray-500">Efficiency</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `,
        chart: <OEEChart data={machine.oeeData?.trend || []} />
      };
    }

    // Cycle time performance queries
    if (lowerQuestion.includes('cycle time') && (lowerQuestion.includes('performance') || lowerQuestion.includes('vs') || lowerQuestion.includes('target'))) {
      const allMachines = dataService.getAllMachines();
      const cycleTimeData = allMachines.map(m => ({
        name: m.name || 'Unknown',
        current: m.realtimeData?.cycleTime || 0,
        target: m.realtimeData?.targetCycleTime || 0,
        variance: ((m.realtimeData?.cycleTime || 0) - (m.realtimeData?.targetCycleTime || 0)),
        efficiency: m.realtimeData?.efficiency || 0,
        status: m.status || 'Unknown'
      })).filter(m => m.current > 0);

      return {
        content: `
          <!-- Cycle Time Performance Analysis -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 mb-6">
            <div class="text-4xl font-bold text-orange-600 mb-3">⏱️ Cycle Time Performance</div>
            <p class="text-gray-700 text-lg">Analysis of cycle time performance vs standard targets across all machines</p>
          </div>

          <!-- Cycle Time Summary -->
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">${Math.round(cycleTimeData.reduce((sum, m) => sum + m.current, 0) / cycleTimeData.length) || 0}s</div>
              <div class="text-sm text-gray-600 mb-2">Average Cycle Time</div>
              <div class="text-xs text-gray-500">Across ${cycleTimeData.length} active machines</div>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">${Math.round(cycleTimeData.reduce((sum, m) => sum + m.target, 0) / cycleTimeData.length) || 0}s</div>
              <div class="text-sm text-gray-600 mb-2">Average Target</div>
              <div class="text-xs text-gray-500">Standard targets</div>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div class="text-3xl font-bold ${cycleTimeData.filter(m => m.variance <= 0).length > cycleTimeData.length / 2 ? 'text-green-600' : 'text-red-600'} mb-2">${cycleTimeData.filter(m => m.variance <= 0).length}</div>
              <div class="text-sm text-gray-600 mb-2">Machines On Target</div>
              <div class="text-xs text-gray-500">Meeting or beating targets</div>
            </div>
          </div>

          <!-- Machine-wise Cycle Time Performance -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Machine-wise Cycle Time Performance</h3>
            <div class="space-y-4">
              ${cycleTimeData.map(machine => `
                <div class="p-4 border border-gray-200 rounded-lg">
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <div class="font-medium text-gray-900">${machine.name}</div>
                      <div class="text-sm text-gray-600">Status: ${machine.status}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold ${machine.variance <= 0 ? 'text-green-600' : 'text-red-600'}">${machine.current}s</div>
                      <div class="text-sm text-gray-500">Target: ${machine.target}s</div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex-1">
                      <div class="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span class="${machine.variance <= 0 ? 'text-green-600' : 'text-red-600'}">${machine.variance > 0 ? '+' : ''}${machine.variance}s vs target</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-${machine.variance <= 0 ? 'green' : 'red'}-500 h-2 rounded-full" style="width: ${Math.min(100, (machine.target / machine.current) * 100)}%"></div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-600">
                      Efficiency: <span class="font-medium">${machine.efficiency}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `,
        chart: <ProductionChart data={machine.dailyProduction || []} />
      };
    }

    // Downtime analysis with Pareto chart
    if (lowerQuestion.includes('downtime analysis') || lowerQuestion.includes('downtime') && lowerQuestion.includes('top reasons')) {
      // Generate comprehensive downtime data for fleet
      const allMachines = dataService.getAllMachines();
      const downtimeReasons = [
        { cause: 'Mold Change', duration: 145, count: 12, color: '#ef4444' },
        { cause: 'Process Setting', duration: 98, count: 18, color: '#f97316' },
        { cause: 'Material Loading', duration: 76, count: 15, color: '#eab308' },
        { cause: 'Tool Change', duration: 54, count: 8, color: '#22c55e' },
        { cause: 'Quality Check', duration: 43, count: 22, color: '#3b82f6' },
        { cause: 'Machine Setup', duration: 32, count: 6, color: '#8b5cf6' },
        { cause: 'Material Shortage', duration: 28, count: 4, color: '#ec4899' },
        { cause: 'Maintenance', duration: 21, count: 3, color: '#6b7280' }
      ];

      // Calculate Pareto analysis
      const totalDuration = downtimeReasons.reduce((sum, reason) => sum + reason.duration, 0);
      let cumulativePercentage = 0;
      const paretoData = downtimeReasons.map(reason => {
        const percentage = (reason.duration / totalDuration) * 100;
        cumulativePercentage += percentage;
        return {
          ...reason,
          percentage: percentage.toFixed(1),
          cumulativePercentage: parseFloat(cumulativePercentage.toFixed(1))
        };
      });

      // Top 6 causes for Pareto chart (80/20 rule)
      const top6Causes = paretoData.slice(0, 6);

      return {
        content: `
          <!-- Downtime Analysis Header -->
          <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 mb-6">
            <div class="text-4xl font-bold text-red-600 mb-3">📊 Downtime Analysis - Pareto Chart</div>
            <p class="text-gray-700 text-lg">Fleet-wide downtime analysis with top reasons and improvement opportunities</p>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">${totalDuration} min</div>
                <div class="text-sm text-gray-600">Total Downtime</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${allMachines.length}</div>
                <div class="text-sm text-gray-600">Machines Analyzed</div>
              </div>
            </div>
          </div>

          <!-- Pareto Analysis Summary -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-red-600 text-lg">🎯</span>
              </span>
              Pareto Analysis - 80/20 Rule Applied
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 class="font-semibold text-red-900 mb-3">Critical Few (Top 3 Causes)</h4>
                <div class="space-y-2">
                  ${top6Causes.slice(0, 3).map((cause, index) => `
                    <div class="flex items-center justify-between p-2 bg-white rounded">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${cause.color}"></div>
                        <span class="text-sm font-medium">${cause.cause}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-bold text-red-600">${cause.duration} min</div>
                        <div class="text-xs text-gray-500">${cause.percentage}%</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div class="mt-3 p-2 bg-red-100 rounded text-center">
                  <span class="text-sm font-bold text-red-800">
                    ${top6Causes.slice(0, 3).reduce((sum, cause) => sum + parseFloat(cause.percentage), 0).toFixed(1)}% of total downtime
                  </span>
                </div>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-3">Trivial Many (Remaining Causes)</h4>
                <div class="space-y-2">
                  ${top6Causes.slice(3).map((cause, index) => `
                    <div class="flex items-center justify-between p-2 bg-white rounded">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${cause.color}"></div>
                        <span class="text-sm">${cause.cause}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-600">${cause.duration} min</div>
                        <div class="text-xs text-gray-500">${cause.percentage}%</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Ranking Table -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Complete Downtime Ranking</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gradient-to-r from-gray-50 to-blue-50">
                    <th class="text-left p-3 font-semibold text-gray-900">Rank</th>
                    <th class="text-left p-3 font-semibold text-gray-900">Cause</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Duration (min)</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Frequency</th>
                    <th class="text-center p-3 font-semibold text-gray-900">% of Total</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Cumulative %</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  ${paretoData.map((cause, index) => `
                    <tr class="${index < 3 ? 'bg-red-50' : index < 6 ? 'bg-yellow-50' : 'bg-gray-50'}">
                      <td class="p-3">
                        <span class="w-6 h-6 ${index < 3 ? 'bg-red-500' : index < 6 ? 'bg-yellow-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ${index + 1}
                        </span>
                      </td>
                      <td class="p-3">
                        <div class="flex items-center space-x-2">
                          <div class="w-3 h-3 rounded-full" style="background-color: ${cause.color}"></div>
                          <span class="font-medium">${cause.cause}</span>
                        </div>
                      </td>
                      <td class="p-3 text-center font-bold text-${index < 3 ? 'red' : index < 6 ? 'yellow' : 'gray'}-600">${cause.duration}</td>
                      <td class="p-3 text-center">${cause.count}</td>
                      <td class="p-3 text-center font-medium">${cause.percentage}%</td>
                      <td class="p-3 text-center">
                        <div class="flex items-center space-x-2">
                          <span class="font-medium">${cause.cumulativePercentage}%</span>
                          <div class="w-16 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-blue-500 rounded-full" style="width: ${cause.cumulativePercentage}%"></div>
                          </div>
                        </div>
                      </td>
                      <td class="p-3 text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${
                          index < 3 ? 'bg-red-100 text-red-800' : 
                          index < 6 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }">
                          ${index < 3 ? 'CRITICAL' : index < 6 ? 'MEDIUM' : 'LOW'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Improvement Recommendations -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-green-600 text-lg">💡</span>
              </span>
              Targeted Improvement Recommendations
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="p-4 border-l-4 border-red-500 bg-red-50">
                  <h4 class="font-semibold text-red-900 mb-2">🥇 Priority 1: Mold Change (${paretoData[0].duration} min)</h4>
                  <ul class="text-sm text-red-800 space-y-1">
                    <li>• Implement SMED (Single Minute Exchange of Die) techniques</li>
                    <li>• Prepare molds in parallel during production runs</li>
                    <li>• Standardize mold change procedures</li>
                    <li>• <strong>Potential savings: 30-50% reduction (43-72 min)</strong></li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 class="font-semibold text-orange-900 mb-2">🥈 Priority 2: Process Setting (${paretoData[1].duration} min)</h4>
                  <ul class="text-sm text-orange-800 space-y-1">
                    <li>• Create standardized process parameter sheets</li>
                    <li>• Implement digital process control systems</li>
                    <li>• Train operators on optimal settings</li>
                    <li>• <strong>Potential savings: 40-60% reduction (39-59 min)</strong></li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h4 class="font-semibold text-yellow-900 mb-2">🥉 Priority 3: Material Loading (${paretoData[2].duration} min)</h4>
                  <ul class="text-sm text-yellow-800 space-y-1">
                    <li>• Install automated material handling systems</li>
                    <li>• Pre-stage materials during production</li>
                    <li>• Optimize material flow layout</li>
                    <li>• <strong>Potential savings: 35-50% reduction (27-38 min)</strong></li>
                  </ul>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 class="font-semibold text-green-900 mb-2">🔧 Tool Change Optimization</h4>
                  <ul class="text-sm text-green-800 space-y-1">
                    <li>• Implement predictive maintenance</li>
                    <li>• Use tool condition monitoring</li>
                    <li>• Schedule changes during planned downtime</li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 class="font-semibold text-blue-900 mb-2">🔍 Quality Check Efficiency</h4>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Implement inline quality control</li>
                    <li>• Use statistical process control (SPC)</li>
                    <li>• Automate quality measurements</li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 class="font-semibold text-purple-900 mb-2">⚙️ Machine Setup Standardization</h4>
                  <ul class="text-sm text-purple-800 space-y-1">
                    <li>• Create standard work instructions</li>
                    <li>• Implement visual management</li>
                    <li>• Cross-train operators</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h4 class="font-semibold text-green-900 mb-2">📈 Expected Overall Impact</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">109-169 min</div>
                  <div class="text-sm text-gray-600">Potential Time Savings</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">25-40%</div>
                  <div class="text-sm text-gray-600">Downtime Reduction</div>
                </div>
              </div>
            </div>
          </div>
        `,
        chart: <ParetoChart data={top6Causes} title="Downtime" />
      };
    }

    // Rejection analysis with defect breakdown
    if (lowerQuestion.includes('rejection analysis') || (lowerQuestion.includes('rejection') && lowerQuestion.includes('defect breakdown'))) {
      // Generate comprehensive rejection/defect data for injection molding
      const defectTypes = [
        { type: 'Flash', count: 156, percentage: 28.5, color: '#ef4444' },
        { type: 'Short Shot', count: 134, percentage: 24.5, color: '#f97316' },
        { type: 'Sink Marks', count: 98, percentage: 17.9, color: '#eab308' },
        { type: 'Warpage', count: 76, percentage: 13.9, color: '#22c55e' },
        { type: 'Weld Lines', count: 45, percentage: 8.2, color: '#3b82f6' },
        { type: 'Gate Marks', count: 23, percentage: 4.2, color: '#8b5cf6' },
        { type: 'Burn Marks', count: 15, percentage: 2.7, color: '#ec4899' }
      ];

      const totalDefects = defectTypes.reduce((sum, defect) => sum + defect.count, 0);
      
      // Calculate cumulative percentages for Pareto
      let cumulativePercentage = 0;
      const paretoDefects = defectTypes.map(defect => {
        cumulativePercentage += defect.percentage;
        return {
          ...defect,
          cumulativePercentage: parseFloat(cumulativePercentage.toFixed(1))
        };
      });

      return {
        content: `
          <!-- Rejection Analysis Header -->
          <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 mb-6">
            <div class="text-4xl font-bold text-red-600 mb-3">🔍 Rejection Analysis - Defect Breakdown</div>
            <p class="text-gray-700 text-lg">Comprehensive quality analysis with defect types and root cause solutions</p>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">${totalDefects}</div>
                <div class="text-sm text-gray-600">Total Defects</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${((totalDefects / (totalDefects + 4500)) * 100).toFixed(1)}%</div>
                <div class="text-sm text-gray-600">Rejection Rate</div>
              </div>
            </div>
          </div>

          <!-- Pareto Analysis for Defects -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-red-600 text-lg">📊</span>
              </span>
              Defect Pareto Analysis - Focus Areas
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 class="font-semibold text-red-900 mb-3">Critical Defects (Top 3 - 70.9%)</h4>
                <div class="space-y-2">
                  ${paretoDefects.slice(0, 3).map((defect, index) => `
                    <div class="flex items-center justify-between p-2 bg-white rounded">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${defect.color}"></div>
                        <span class="text-sm font-medium">${defect.type}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-bold text-red-600">${defect.count}</div>
                        <div class="text-xs text-gray-500">${defect.percentage}%</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 class="font-semibold text-yellow-900 mb-3">Secondary Issues (Remaining 29.1%)</h4>
                <div class="space-y-2">
                  ${paretoDefects.slice(3).map((defect, index) => `
                    <div class="flex items-center justify-between p-2 bg-white rounded">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${defect.color}"></div>
                        <span class="text-sm">${defect.type}</span>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-medium text-gray-600">${defect.count}</div>
                        <div class="text-xs text-gray-500">${defect.percentage}%</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Defect Ranking -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Complete Defect Ranking & Analysis</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gradient-to-r from-gray-50 to-pink-50">
                    <th class="text-left p-3 font-semibold text-gray-900">Rank</th>
                    <th class="text-left p-3 font-semibold text-gray-900">Defect Type</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Count</th>
                    <th class="text-center p-3 font-semibold text-gray-900">% of Total</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Cumulative %</th>
                    <th class="text-center p-3 font-semibold text-gray-900">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  ${paretoDefects.map((defect, index) => `
                    <tr class="${index < 3 ? 'bg-red-50' : 'bg-gray-50'}">
                      <td class="p-3">
                        <span class="w-6 h-6 ${index < 3 ? 'bg-red-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center text-sm font-bold">
                          ${index + 1}
                        </span>
                      </td>
                      <td class="p-3">
                        <div class="flex items-center space-x-2">
                          <div class="w-3 h-3 rounded-full" style="background-color: ${defect.color}"></div>
                          <span class="font-medium">${defect.type}</span>
                        </div>
                      </td>
                      <td class="p-3 text-center font-bold text-${index < 3 ? 'red' : 'gray'}-600">${defect.count}</td>
                      <td class="p-3 text-center font-medium">${defect.percentage}%</td>
                      <td class="p-3 text-center">
                        <div class="flex items-center space-x-2">
                          <span class="font-medium">${defect.cumulativePercentage}%</span>
                          <div class="w-16 h-2 bg-gray-200 rounded-full">
                            <div class="h-2 bg-pink-500 rounded-full" style="width: ${defect.cumulativePercentage}%"></div>
                          </div>
                        </div>
                      </td>
                      <td class="p-3 text-center">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${
                          index < 3 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }">
                          ${index < 3 ? 'CRITICAL' : 'MEDIUM'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Root Cause Solutions -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 text-lg">🔧</span>
              </span>
              Root Cause Solutions for Top Defects
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="p-4 border-l-4 border-red-500 bg-red-50">
                  <h4 class="font-semibold text-red-900 mb-2">🥇 Flash (${paretoDefects[0].count} defects)</h4>
                  <div class="text-sm text-red-800 space-y-1">
                    <div><strong>Root Causes:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Excessive injection pressure</li>
                      <li>• Insufficient mold clamping force</li>
                      <li>• Worn mold parting surfaces</li>
                    </ul>
                    <div class="mt-2"><strong>Solutions:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Reduce injection pressure by 10-15%</li>
                      <li>• Check and adjust clamping force</li>
                      <li>• Inspect and refurbish mold surfaces</li>
                    </ul>
                  </div>
                </div>
                
                <div class="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <h4 class="font-semibold text-orange-900 mb-2">🥈 Short Shot (${paretoDefects[1].count} defects)</h4>
                  <div class="text-sm text-orange-800 space-y-1">
                    <div><strong>Root Causes:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Insufficient injection pressure</li>
                      <li>• Low material temperature</li>
                      <li>• Blocked flow channels</li>
                    </ul>
                    <div class="mt-2"><strong>Solutions:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Increase injection pressure gradually</li>
                      <li>• Optimize material temperature profile</li>
                      <li>• Clean and inspect flow channels</li>
                    </ul>
                  </div>
                </div>
                
                <div class="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                  <h4 class="font-semibold text-yellow-900 mb-2">🥉 Sink Marks (${paretoDefects[2].count} defects)</h4>
                  <div class="text-sm text-yellow-800 space-y-1">
                    <div><strong>Root Causes:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Insufficient cooling time</li>
                      <li>• Thick wall sections</li>
                      <li>• Low holding pressure</li>
                    </ul>
                    <div class="mt-2"><strong>Solutions:</strong></div>
                    <ul class="ml-4 space-y-1">
                      <li>• Extend cooling time by 15-20%</li>
                      <li>• Optimize wall thickness design</li>
                      <li>• Increase holding pressure</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 class="font-semibold text-green-900 mb-2">🔧 Warpage Solutions</h4>
                  <ul class="text-sm text-green-800 space-y-1">
                    <li>• Balance cooling channel design</li>
                    <li>• Reduce internal stress with lower injection speed</li>
                    <li>• Optimize gate location and size</li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 class="font-semibold text-blue-900 mb-2">🔍 Weld Line Prevention</h4>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Optimize gate location to minimize flow fronts</li>
                    <li>• Increase injection speed in critical areas</li>
                    <li>• Raise mold and material temperatures</li>
                  </ul>
                </div>
                
                <div class="p-4 border-l-4 border-purple-500 bg-purple-50">
                  <h4 class="font-semibold text-purple-900 mb-2">⚙️ Gate & Burn Mark Solutions</h4>
                  <ul class="text-sm text-purple-800 space-y-1">
                    <li>• Adjust gate size and design</li>
                    <li>• Reduce injection speed near gates</li>
                    <li>• Improve mold venting systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Process Optimization Recommendations -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-green-600 text-lg">⚙️</span>
              </span>
              Process Parameter Optimization
            </h3>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="font-semibold text-blue-900 mb-3">Injection Parameters</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Pressure:</span>
                    <span class="font-medium">1200-1400 bar</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Speed:</span>
                    <span class="font-medium">80-120 mm/s</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Temperature:</span>
                    <span class="font-medium">220-260°C</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Hold Time:</span>
                    <span class="font-medium">8-12 sec</span>
                  </div>
                </div>
              </div>
              
              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 class="font-semibold text-green-900 mb-3">Cooling Optimization</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Mold Temp:</span>
                    <span class="font-medium">40-80°C</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Cooling Time:</span>
                    <span class="font-medium">15-25 sec</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Water Flow:</span>
                    <span class="font-medium">6-8 L/min</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Channel Design:</span>
                    <span class="font-medium">Balanced</span>
                  </div>
                </div>
              </div>
              
              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 class="font-semibold text-purple-900 mb-3">Quality Control</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Inspection:</span>
                    <span class="font-medium">Every 10 parts</span>
                  </div>
                  <div class="flex justify-between">
                    <span>SPC Charts:</span>
                    <span class="font-medium">Real-time</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Maintenance:</span>
                    <span class="font-medium">Preventive</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Training:</span>
                    <span class="font-medium">Monthly</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h4 class="font-semibold text-green-900 mb-2">📈 Expected Quality Improvement</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">218-388</div>
                  <div class="text-sm text-gray-600">Defect Reduction</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">40-70%</div>
                  <div class="text-sm text-gray-600">Quality Improvement</div>
                </div>
              </div>
            </div>
          </div>
        `,
        chart: <ParetoChart data={paretoDefects.slice(0, 6)} title="Rejection" />
      };
    }

    // Status queries - prioritize based on search results
    if (lowerQuestion.includes('status') || lowerQuestion.includes('current machine') || queryIntent === 'status') {
      return {
        content: `
          <!-- Executive Summary Card -->
          <div class="bg-gradient-to-r from-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-50 to-blue-50 rounded-xl p-6 border border-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-200 mb-6">
            <div class="flex items-center mb-4">
              <div class="w-4 h-4 bg-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-500 rounded-full ${machine.status === 'RUNNING' ? 'animate-pulse' : ''} mr-3"></div>
              <h2 class="text-2xl font-bold text-gray-900">${machine.name || 'Unknown Machine'}: ${machine.status || 'Unknown Status'}</h2>
              <span class="ml-auto px-3 py-1 bg-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-100 text-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-800 rounded-full text-sm font-medium">
                ${machine.status === 'RUNNING' ? 'Optimal Performance' : machine.status === 'MAINTENANCE' ? 'Under Maintenance' : 'Attention Required'}
              </span>
            </div>
            <p class="text-gray-700 text-lg">Currently operating at <span class="font-bold text-blue-600">${machine.realtimeData?.efficiency || 0}% efficiency</span> with ${(machine.realtimeData?.quality || 'unknown status').toLowerCase()}. 
            ${(machine.realtimeData?.outputRate || 0) > 0 ? `Production rate: <span class="font-bold text-green-600">${machine.realtimeData.outputRate} units/hour</span>` : 'Currently not producing'}</p>
            
            ${searchResults.searchResults.length > 0 ? `
            <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="text-sm text-blue-800 font-medium">🎯 Selected because: ${searchResults.searchResults[0].matchReason || 'Best match found'}</div>
            </div>
            ` : ''}
          </div>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="text-3xl font-bold text-blue-600 mb-1">${machine.realtimeData?.outputRate || 0}</div>
              <div class="text-sm text-gray-600 mb-1">Units/Hour</div>
              <div class="text-xs ${(machine.realtimeData?.outputRate || 0) >= (machine.realtimeData?.targetRate || 1) ? 'text-green-600' : 'text-red-600'} font-medium">
                ${(machine.realtimeData?.outputRate || 0) >= (machine.realtimeData?.targetRate || 1) ? '↗' : '↘'} ${(machine.realtimeData?.targetRate || 0) > 0 ? Math.round((((machine.realtimeData?.outputRate || 0) / machine.realtimeData.targetRate) * 100) - 100) : 0}% vs target
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="text-3xl font-bold text-green-600 mb-1">${machine.oeeData?.current?.overall || 0}%</div>
              <div class="text-sm text-gray-600 mb-1">Current OEE</div>
              <div class="text-xs ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? 'text-green-600' : 'text-red-600'} font-medium">
                ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? '↗' : '↘'} ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? 'Above' : 'Below'} Target
              </div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="text-3xl font-bold text-purple-600 mb-1">${machine.realtimeData?.materialTemperature || machine.realtimeData?.moldTemperature || 0}°C</div>
              <div class="text-sm text-gray-600 mb-1">Temperature</div>
              <div class="text-xs text-blue-600 font-medium">${machine.realtimeData?.quality || 'Status unknown'}</div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="text-3xl font-bold text-orange-600 mb-1">${machine.realtimeData?.cycleTime || 0}s</div>
              <div class="text-sm text-gray-600 mb-1">Cycle Time</div>
              <div class="text-xs ${(machine.realtimeData?.cycleTime || 999) <= (machine.realtimeData?.targetCycleTime || 0) ? 'text-green-600' : 'text-red-600'} font-medium">
                Target: ${machine.realtimeData?.targetCycleTime || 0}s
              </div>
            </div>
          </div>

          <!-- Current Operation Details -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 text-lg">👤</span>
              </span>
              Current Operation Details
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Operator:</span>
                  <span class="font-bold text-gray-900">${machine.operator || 'Not assigned'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Shift:</span>
                  <span class="font-bold text-gray-900">${machine.shift || 'Unknown shift'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Job:</span>
                  <span class="font-bold text-gray-900">${machine.job || 'No job assigned'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Running Duration:</span>
                  <span class="font-bold text-gray-900">${machine.runningDuration || '0h 0m'}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Machine Type:</span>
                  <span class="font-bold text-gray-900">${machine.type || 'Unknown'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Location:</span>
                  <span class="font-bold text-gray-900">${machine.location || 'Unknown location'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Current Mold:</span>
                  <span class="font-bold text-gray-900">${machine.currentMold || 'No mold installed'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600 font-medium">Material:</span>
                  <span class="font-bold text-gray-900">${machine.material || 'No material loaded'}</span>
                </div>
              </div>
            </div>
          </div>

          ${searchResults.relatedMachines && searchResults.relatedMachines.length > 0 ? `
          <!-- Related Machines -->
          <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 class="font-semibold text-gray-900 mb-3">Other Machines Status</h4>
            <div class="grid md:grid-cols-2 gap-3">
              ${searchResults.relatedMachines.map(m => `
                <div class="bg-white p-3 rounded-lg border">
                  <div class="font-medium">${m.name || 'Unknown Machine'}</div>
                  <div class="text-sm text-gray-600">${m.status || 'Unknown'} - OEE: ${m.oeeData?.current?.overall || 0}%</div>
                  <div class="text-xs text-gray-500">${m.operator || 'No operator'}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        `,
        chart: <ProductionChart data={machine.dailyProduction || []} />
      };
    }

    // OEE Analysis Response - Uses dynamic data
    if (lowerQuestion.includes('oee') || lowerQuestion.includes('overall equipment') || lowerQuestion.includes('calculate overall') || queryIntent === 'oee_analysis') {
      return {
        content: `
          <!-- OEE Hero Section -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 text-center mb-6">
            <div class="text-6xl font-bold text-blue-600 mb-2">${machine.oeeData?.current?.overall || 0}%</div>
            <div class="text-xl text-gray-700 mb-4">Overall Equipment Effectiveness - ${machine.name || 'Unknown Machine'}</div>
            <div class="flex items-center justify-center space-x-4 flex-wrap gap-2">
              <span class="px-4 py-2 bg-${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? 'green' : 'red'}-100 text-${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? 'green' : 'red'}-700 rounded-full text-sm font-medium">
                ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? '✓' : '⚠'} ${(((machine.oeeData?.current?.overall || 0) / (machine.oeeData?.current?.targetOEE || 85)) * 100).toFixed(1)}% of Target
              </span>
              <span class="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? '+' : ''}${((machine.oeeData?.current?.overall || 0) - (machine.oeeData?.current?.targetOEE || 85)).toFixed(1)}% ${(machine.oeeData?.current?.overall || 0) >= (machine.oeeData?.current?.targetOEE || 85) ? 'Above' : 'Below'} Target
              </span>
            </div>
            
            ${searchResults.searchResults.length > 0 ? `
            <div class="mt-4 p-3 bg-white/50 rounded-lg border border-blue-300">
              <div class="text-sm text-blue-800 font-medium">🎯 Analysis Focus: ${searchResults.searchResults[0].matchReason || 'Best match found'}</div>
            </div>
            ` : ''}
          </div>

          <!-- OEE Components -->
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900">Availability</h3>
                <span class="text-2xl">${(machine.oeeData?.current?.availability || 0) > 90 ? '🟢' : (machine.oeeData?.current?.availability || 0) > 70 ? '🟡' : '🔴'}</span>
              </div>
              <div class="text-4xl font-bold text-green-600 mb-2">${machine.oeeData?.current?.availability || 0}%</div>
              <div class="text-sm text-gray-600 mb-3">Target: 90%</div>
              <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div class="bg-green-500 h-3 rounded-full transition-all duration-1000" style="width: ${Math.min(machine.oeeData?.current?.availability || 0, 100)}%"></div>
              </div>
              <div class="text-sm ${(machine.oeeData?.current?.availability || 0) >= 90 ? 'text-green-600' : 'text-red-600'} font-medium">
                ${(machine.oeeData?.current?.availability || 0) >= 90 ? '+' : ''}${((machine.oeeData?.current?.availability || 0) - 90).toFixed(1)}% ${(machine.oeeData?.current?.availability || 0) >= 90 ? 'above' : 'below'} target
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900">Performance</h3>
                <span class="text-2xl">${(machine.oeeData?.current?.performance || 0) > 90 ? '🟢' : (machine.oeeData?.current?.performance || 0) > 70 ? '🟡' : '🔴'}</span>
              </div>
              <div class="text-4xl font-bold text-yellow-600 mb-2">${machine.oeeData?.current?.performance || 0}%</div>
              <div class="text-sm text-gray-600 mb-3">Target: 85%</div>
              <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div class="bg-yellow-500 h-3 rounded-full transition-all duration-1000" style="width: ${Math.min(machine.oeeData?.current?.performance || 0, 100)}%"></div>
              </div>
              <div class="text-sm ${(machine.oeeData?.current?.performance || 0) >= 85 ? 'text-green-600' : 'text-red-600'} font-medium">
                ${(machine.oeeData?.current?.performance || 0) >= 85 ? '+' : ''}${((machine.oeeData?.current?.performance || 0) - 85).toFixed(1)}% ${(machine.oeeData?.current?.performance || 0) >= 85 ? 'above' : 'below'} target
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900">Quality</h3>
                <span class="text-2xl">${(machine.oeeData?.current?.quality || 0) > 95 ? '🟢' : (machine.oeeData?.current?.quality || 0) > 85 ? '🟡' : '🔴'}</span>
              </div>
              <div class="text-4xl font-bold text-blue-600 mb-2">${machine.oeeData?.current?.quality || 0}%</div>
              <div class="text-sm text-gray-600 mb-3">Target: 95%</div>
              <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div class="bg-blue-500 h-3 rounded-full transition-all duration-1000" style="width: ${Math.min(machine.oeeData?.current?.quality || 0, 100)}%"></div>
              </div>
              <div class="text-sm ${(machine.oeeData?.current?.quality || 0) >= 95 ? 'text-green-600' : 'text-red-600'} font-medium">
                ${(machine.oeeData?.current?.quality || 0) >= 95 ? '+' : ''}${((machine.oeeData?.current?.quality || 0) - 95).toFixed(1)}% ${(machine.oeeData?.current?.quality || 0) >= 95 ? 'above' : 'below'} target
              </div>
            </div>
          </div>

          ${fleetStats ? `
          <!-- Fleet Statistics -->
          <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h3>
            <div class="grid md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${fleetStats.totalMachines || 0}</div>
                <div class="text-sm text-gray-600">Total Machines</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${fleetStats.runningMachines || 0}</div>
                <div class="text-sm text-gray-600">Running</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">${fleetStats.averageOEE || 0}%</div>
                <div class="text-sm text-gray-600">Avg OEE</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">${(fleetStats.utilizationRate || 0).toFixed(1)}%</div>
                <div class="text-sm text-gray-600">Utilization</div>
              </div>
            </div>
          </div>
          ` : ''}
        `,
        chart: <OEEChart data={machine.oeeData?.trend || []} />
      };
    }

    // Maintenance/Problem queries
    if (queryIntent === 'troubleshooting' || lowerQuestion.includes('maintenance') || lowerQuestion.includes('problem') || lowerQuestion.includes('issue')) {
      return {
        content: `
          <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 text-center mb-6">
            <div class="text-4xl font-bold text-red-600 mb-3">🚨 Maintenance Analysis</div>
            <p class="text-gray-700 text-lg">Analysis for: <span class="font-semibold text-red-600">"${question}"</span></p>
            
            ${searchResults.searchResults.length > 0 ? `
            <div class="mt-4 p-3 bg-white/50 rounded-lg border border-red-300">
              <div class="text-sm text-red-800 font-medium">🎯 Priority Machine: ${searchResults.searchResults[0].matchReason || 'Best match found'}</div>
            </div>
            ` : ''}
          </div>
          
          <!-- Priority Machine -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-red-600 text-lg">⚠️</span>
              </span>
              ${machine.name || 'Unknown Machine'} - Requires Attention
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span class="text-gray-600">Status:</span>
                  <span class="font-bold text-red-600">${machine.status || 'Unknown'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span class="text-gray-600">Current OEE:</span>
                  <span class="font-bold text-orange-600">${machine.oeeData?.current?.overall || 0}%</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span class="text-gray-600">Efficiency:</span>
                  <span class="font-bold text-yellow-600">${machine.realtimeData?.efficiency || 0}%</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">Operator:</span>
                  <span class="font-bold text-gray-900">${machine.operator || 'Not assigned'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span class="text-gray-600">Next Maintenance:</span>
                  <span class="font-bold text-blue-600">${machine.realtimeData?.nextMaintenance || 'Not scheduled'}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span class="text-gray-600">Cycle Time:</span>
                  <span class="font-bold text-purple-600">${machine.realtimeData?.cycleTime || 0}s</span>
                </div>
              </div>
            </div>
            
            <!-- Downtime Analysis -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-3">Today's Downtime Breakdown</h4>
              <div class="space-y-2">
                ${(machine.downtimeData?.todayBreakdown || []).map(item => `
                  <div class="flex items-center justify-between p-2 bg-white rounded">
                    <span class="text-sm text-gray-700">${item.cause || 'Unknown cause'}</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium">${item.duration || 0} min</span>
                      <span class="text-xs text-gray-500">(${item.percentage || 0}%)</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          ${searchResults.relatedMachines && searchResults.relatedMachines.length > 0 ? `
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">Other Machines Status</h4>
            <div class="grid md:grid-cols-2 gap-4">
              ${searchResults.relatedMachines.map(m => `
                <div class="p-4 border border-gray-200 rounded-lg ${m.status === 'MAINTENANCE' ? 'bg-red-50 border-red-200' : m.status === 'IDLE' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}">
                  <div class="font-medium text-gray-900">${m.name || 'Unknown Machine'}</div>
                  <div class="text-sm text-gray-600">${m.status || 'Unknown'} - OEE: ${m.oeeData?.current?.overall || 0}%</div>
                  <div class="text-sm text-gray-500">${m.operator || 'No operator'}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        `,
        chart: <DowntimeChart data={machine.downtimeData?.todayBreakdown || []} />
      };
    }

    // Performance ranking queries
    if (queryIntent === 'performance_ranking') {
      const allMachines = dataService.getAllMachines().sort((a, b) => (b.oeeData?.current?.overall || 0) - (a.oeeData?.current?.overall || 0));
      
      return {
        content: `
          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 text-center mb-6">
            <div class="text-4xl font-bold text-green-600 mb-3">🏆 Performance Ranking</div>
            <p class="text-gray-700 text-lg">Analysis for: <span class="font-semibold text-green-600">"${question}"</span></p>
            
            ${searchResults.searchResults.length > 0 ? `
            <div class="mt-4 p-3 bg-white/50 rounded-lg border border-green-300">
              <div class="text-sm text-green-800 font-medium">🎯 ${searchResults.searchResults[0].matchReason || 'Best match found'}</div>
            </div>
            ` : ''}
          </div>
          
          <!-- Top Performer -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-green-600 text-lg">🥇</span>
              </span>
              Top Performer: ${machine.name || 'Unknown Machine'}
            </h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-3xl font-bold text-green-600">${machine.oeeData?.current?.overall || 0}%</div>
                <div class="text-sm text-gray-600">OEE Score</div>
              </div>
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-3xl font-bold text-blue-600">${machine.realtimeData?.efficiency || 0}%</div>
                <div class="text-sm text-gray-600">Efficiency</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-3xl font-bold text-purple-600">${machine.realtimeData?.outputRate || 0}</div>
                <div class="text-sm text-gray-600">Units/Hour</div>
              </div>
            </div>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-700">Operator: <span class="font-medium">${machine.operator || 'Not assigned'}</span> | Status: <span class="font-medium text-green-600">${machine.status || 'Unknown'}</span></div>
            </div>
          </div>

          <!-- Performance Ranking -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h4 class="font-semibold text-gray-900 mb-4">Complete Performance Ranking</h4>
            <div class="space-y-3">
              ${allMachines.map((m, index) => `
                <div class="flex items-center justify-between p-3 ${index === 0 ? 'bg-green-50 border border-green-200' : index === allMachines.length - 1 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'} rounded-lg">
                  <div class="flex items-center space-x-3">
                    <span class="w-8 h-8 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : index === 2 ? 'bg-orange-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ${index + 1}
                    </span>
                    <div>
                      <div class="font-medium text-gray-900">${m.name || 'Unknown Machine'}</div>
                      <div class="text-sm text-gray-600">${m.operator || 'No operator'} - ${m.status || 'Unknown'}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold ${(m.oeeData?.current?.overall || 0) > 85 ? 'text-green-600' : (m.oeeData?.current?.overall || 0) > 70 ? 'text-yellow-600' : 'text-red-600'}">${m.oeeData?.current?.overall || 0}%</div>
                    <div class="text-sm text-gray-500">OEE</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `,
        chart: <OEEChart data={machine.oeeData?.trend || []} />
      };
    }

    // Default response with enhanced search results
    return {
      content: `
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 text-center mb-6">
          <div class="text-3xl font-bold text-gray-900 mb-3">🤖 AI Analysis Complete</div>
          <p class="text-gray-600 text-lg">Analysis for: <span class="font-semibold text-blue-600">"${question}"</span></p>
          
          ${searchResults.searchResults.length > 0 ? `
          <div class="mt-4 p-3 bg-white/50 rounded-lg border border-blue-300">
            <div class="text-sm text-blue-800 font-medium">🎯 Most Relevant: ${searchResults.searchResults[0].matchReason || 'Best match found'}</div>
          </div>
          ` : ''}
        </div>
        
        <!-- Search Results -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Primary Machine: ${machine.name || 'Unknown Machine'}</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">Status:</span>
                <span class="font-bold text-${machine.status === 'RUNNING' ? 'green' : machine.status === 'MAINTENANCE' ? 'yellow' : 'red'}-600">${machine.status || 'Unknown'}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span class="text-gray-600">Current OEE:</span>
                <span class="font-bold text-blue-600">${machine.oeeData?.current?.overall || 0}%</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span class="text-gray-600">Efficiency:</span>
                <span class="font-bold text-purple-600">${machine.realtimeData?.efficiency || 0}%</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-gray-600">Operator:</span>
                <span class="font-bold text-gray-900">${machine.operator || 'Not assigned'}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span class="text-gray-600">Output:</span>
                <span class="font-bold text-green-600">${machine.realtimeData?.outputRate || 0}/hr</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span class="text-gray-600">Type:</span>
                <span class="font-bold text-orange-600">${machine.type || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          ${searchResults.searchResults.length > 0 && searchResults.searchResults[0].matchedKeywords && searchResults.searchResults[0].matchedKeywords.length > 0 ? `
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <div class="text-sm text-blue-800 font-medium mb-2">Matched Keywords:</div>
            <div class="flex flex-wrap gap-2">
              ${searchResults.searchResults[0].matchedKeywords.map(keyword => 
                `<span class="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">${keyword}</span>`
              ).join('')}
            </div>
          </div>
          ` : ''}
        </div>

        ${searchResults.relatedMachines && searchResults.relatedMachines.length > 0 ? `
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h4 class="font-semibold text-gray-900 mb-4">Other Relevant Machines</h4>
          <div class="grid md:grid-cols-2 gap-4">
            ${searchResults.relatedMachines.map(m => `
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="font-medium text-gray-900">${m.name || 'Unknown Machine'}</div>
                <div class="text-sm text-gray-600">${m.status || 'Unknown'} - OEE: ${m.oeeData?.current?.overall || 0}%</div>
                <div class="text-sm text-gray-500">${m.operator || 'No operator'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 class="font-semibold text-blue-900 mb-2">💬 Need More Specific Information?</h4>
          <p class="text-blue-700 text-sm">Ask about specific machines, OEE breakdowns, or comparative analysis for detailed insights.</p>
        </div>
      `,
      chart: <OEEChart data={machine.oeeData?.trend || []} />
    };
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    // Append new user message to existing conversation history
    setMessages(prev => [...prev, userMessage]);
    setChatMode(true);
    setInputValue('');
    setIsLoading(true);

    // Show loading for longer to let users see the complete animation
    setTimeout(() => {
      const response = generateResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        chart: response.chart
      };
      // Append new assistant message to existing conversation history
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 4000); // Increased from 2.5 seconds to 4 seconds
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowDropdown(false);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const resetToWelcome = () => {
    setChatMode(false);
    setMessages([]);
    setInputValue('');
    setSelectedCategory('');
    setExpandedCard('');
  };

  const handleFollowUpClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  if (chatMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Add custom CSS for loading animation */}
        <style jsx>{`
          @keyframes loading-progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToWelcome}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>New Analysis</span>
                </Button>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">OEE AI Copilot</h1>
                <p className="text-sm text-gray-600">Smart Production Assistant</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          {/* Conversation Summary */}
          <ConversationSummary messages={messages} />
          
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                  <MessageBubble 
                    message={message} 
                    isLast={index === messages.length - 1 && message.type === 'assistant'}
                    onFollowUpClick={handleFollowUpClick}
                    conversationHistory={messages}
                  />
                </div>
              </div>
            ))}

            {/* Show loading animation when generating response */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl mr-12">
                  <MessageBubble 
                    message={{
                      id: 'loading',
                      type: 'assistant',
                      content: '',
                      timestamp: new Date()
                    }} 
                    isLoading={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Search Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2"
                  disabled={isLoading}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {showDropdown && !isLoading && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isLoading ? "AI is analyzing..." : "Continue the conversation..."}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSendMessage()} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Faclon Labs
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">OEE AI Copilot</h1>
              <p className="text-sm text-gray-600">Smart Production Assistant</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to your Smart Production Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant insights about machine performance, analyze KPIs, and discover improvement 
            opportunities with AI-powered analytics
          </p>
          
          {/* Animated Try Asking Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-lg font-medium">Try asking:</span>
              <div className="relative h-8 overflow-hidden">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateY(-${currentQuestionIndex * 32}px)`
                  }}
                >
                  {rotatingQuestions.map((question, index) => (
                    <div key={index} className="h-8 flex items-center">
                      <span className="font-medium italic">"{question}"</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-yellow-300 animate-pulse">✨</div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCard === category.id;
            
            return (
              <div
                key={category.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isExpanded ? 'md:col-span-3' : ''
                }`}
              >
                <div
                  className={`bg-gradient-to-r ${category.theme} p-6 cursor-pointer`}
                  onClick={() => setExpandedCard(isExpanded ? '' : category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                      {category.questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                          className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:scale-105 hover:shadow-md"
                        >
                          <span className="text-sm text-gray-700">{question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Search Interface */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {selectedCategoryData && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedCategoryData.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(suggestion)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showDropdown && (
                <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-10">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={selectedCategoryData ? `Ask about ${selectedCategoryData.title}...` : "Ask me anything about your production..."}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={() => handleSendMessage()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

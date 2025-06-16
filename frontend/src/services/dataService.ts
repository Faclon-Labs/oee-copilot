import manufacturingData from '../data/manufacturing-data.json';

// Types
export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  operator: string;
  shift: string;
  job: string;
  runningDuration: string;
  realtimeData: {
    outputRate: number;
    targetRate: number;
    efficiency: number;
    quality: string;
    temperature: number;
    vibration: string;
    toolWear: number;
    nextMaintenance: string;
  };
  dailyProduction: Array<{
    hour: string;
    actual: number;
    target: number;
    cumulative: number;
  }>;
  oeeData: {
    current: {
      overall: number;
      availability: number;
      performance: number;
      quality: number;
      targetOEE: number;
    };
    trend: any[];
    shiftComparison: any[];
  };
  downtimeData: {
    todayBreakdown: any[];
    weeklyTrend: any[];
  };
  qualityData: {
    defectTypes: any[];
  };
}

export interface SearchResult {
  machine: Machine;
  relevanceScore: number;
  matchedKeywords: string[];
  matchReason: string;
}

// Enhanced Similarity Search with Intent Recognition
export class DataService {
  private static instance: DataService;
  private machines: Machine[];
  private searchKeywords: Record<string, string[]>;

  constructor() {
    this.machines = manufacturingData.machines as Machine[];
    this.searchKeywords = manufacturingData.searchKeywords;
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Enhanced query intent recognition
  private analyzeQueryIntent(query: string): {
    intent: string;
    focus: string;
    priority: string;
    keywords: string[];
  } {
    const lowerQuery = query.toLowerCase();
    const tokens = lowerQuery.split(/\s+/);
    
    let intent = 'general';
    let focus = 'any';
    let priority = 'performance';
    let keywords: string[] = [];

    // Intent Detection
    if (lowerQuery.includes('status') || lowerQuery.includes('current') || lowerQuery.includes('now') || lowerQuery.includes('live')) {
      intent = 'status';
      priority = 'current_state';
    } else if (lowerQuery.includes('oee') || lowerQuery.includes('overall equipment') || lowerQuery.includes('efficiency')) {
      intent = 'oee_analysis';
      priority = 'performance';
    } else if (lowerQuery.includes('problem') || lowerQuery.includes('issue') || lowerQuery.includes('maintenance') || lowerQuery.includes('downtime')) {
      intent = 'troubleshooting';
      priority = 'problems';
    } else if (lowerQuery.includes('best') || lowerQuery.includes('highest') || lowerQuery.includes('top') || lowerQuery.includes('good')) {
      intent = 'performance_ranking';
      priority = 'high_performance';
    } else if (lowerQuery.includes('worst') || lowerQuery.includes('lowest') || lowerQuery.includes('poor') || lowerQuery.includes('bad')) {
      intent = 'performance_ranking';
      priority = 'low_performance';
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('comparison') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
      intent = 'comparison';
      priority = 'multiple';
    } else if (lowerQuery.includes('quality') || lowerQuery.includes('defect') || lowerQuery.includes('reject')) {
      intent = 'quality_analysis';
      priority = 'quality_issues';
    }

    // Focus Detection (Machine Type)
    if (lowerQuery.includes('cnc')) {
      focus = 'CNC';
    } else if (lowerQuery.includes('weld') || lowerQuery.includes('welding')) {
      focus = 'Welding';
    } else if (lowerQuery.includes('press') || lowerQuery.includes('hydraulic')) {
      focus = 'Press';
    } else if (lowerQuery.includes('lathe')) {
      focus = 'Lathe';
    }

    // Extract relevant keywords
    for (const [category, categoryKeywords] of Object.entries(this.searchKeywords)) {
      for (const keyword of categoryKeywords) {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          keywords.push(keyword);
        }
      }
    }

    return { intent, focus, priority, keywords };
  }

  // Smart machine scoring based on query intent
  private calculateIntelligentScore(query: string, machine: Machine): { score: number; reason: string; matches: string[] } {
    const { intent, focus, priority, keywords } = this.analyzeQueryIntent(query);
    let score = 0;
    let reason = '';
    let matches: string[] = [];

    // Base keyword matching
    matches = keywords.filter(keyword => {
      const machineText = this.getMachineSearchText(machine).toLowerCase();
      return machineText.includes(keyword.toLowerCase());
    });

    // Intent-based scoring
    switch (intent) {
      case 'status':
        if (machine.status === 'RUNNING') {
          score += 20;
          reason = 'Currently running machine';
        } else if (machine.status === 'MAINTENANCE') {
          score += 15;
          reason = 'Machine under maintenance';
        } else if (machine.status === 'IDLE') {
          score += 10;
          reason = 'Idle machine status';
        }
        break;

      case 'oee_analysis':
        score += machine.oeeData.current.overall / 2; // Higher OEE = higher relevance
        if (machine.oeeData.current.overall > 85) {
          reason = 'High OEE performance machine';
        } else if (machine.oeeData.current.overall < 60) {
          reason = 'Low OEE requiring attention';
        } else {
          reason = 'Moderate OEE performance';
        }
        break;

      case 'troubleshooting':
        if (machine.status === 'MAINTENANCE') {
          score += 30;
          reason = 'Machine currently under maintenance';
        } else if (machine.status === 'IDLE') {
          score += 25;
          reason = 'Idle machine with potential issues';
        } else if (machine.oeeData.current.overall < 70) {
          score += 20;
          reason = 'Low performance indicating problems';
        } else {
          score += 5;
          reason = 'Running machine with minor issues';
        }
        break;

      case 'performance_ranking':
        if (priority === 'high_performance') {
          score += machine.oeeData.current.overall;
          if (machine.oeeData.current.overall > 90) {
            reason = 'Top performing machine';
          } else if (machine.oeeData.current.overall > 85) {
            reason = 'High performing machine';
          }
        } else if (priority === 'low_performance') {
          score += (100 - machine.oeeData.current.overall);
          if (machine.oeeData.current.overall < 50) {
            reason = 'Poorest performing machine';
          } else if (machine.oeeData.current.overall < 70) {
            reason = 'Below average performance';
          }
        }
        break;

      case 'quality_analysis':
        const qualityScore = machine.oeeData.current.quality;
        if (qualityScore < 90) {
          score += (100 - qualityScore) * 2;
          reason = 'Machine with quality issues';
        } else {
          score += qualityScore / 2;
          reason = 'Good quality performance';
        }
        break;

      case 'comparison':
        score += 15; // All machines are relevant for comparison
        reason = 'Suitable for comparison analysis';
        break;

      default:
        score += machine.oeeData.current.overall / 3;
        reason = 'General machine relevance';
    }

    // Machine type focus bonus
    if (focus !== 'any' && machine.type === focus) {
      score += 25;
      reason = `${focus} machine type match - ${reason}`;
    }

    // Operator-specific queries
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes(machine.operator.toLowerCase().split(' ')[0].toLowerCase())) {
      score += 20;
      reason = `Operator ${machine.operator} - ${reason}`;
    }

    // Status-specific bonuses
    if (lowerQuery.includes('running') && machine.status === 'RUNNING') {
      score += 15;
    }
    if (lowerQuery.includes('maintenance') && machine.status === 'MAINTENANCE') {
      score += 15;
    }
    if (lowerQuery.includes('idle') && machine.status === 'IDLE') {
      score += 15;
    }

    // Efficiency-based scoring
    if (lowerQuery.includes('efficiency') || lowerQuery.includes('performance')) {
      score += machine.realtimeData.efficiency / 2;
    }

    // Production-based scoring
    if (lowerQuery.includes('production') || lowerQuery.includes('output')) {
      const productionRatio = machine.realtimeData.targetRate > 0 ? 
        (machine.realtimeData.outputRate / machine.realtimeData.targetRate) * 10 : 0;
      score += productionRatio;
    }

    return { score: Math.max(score, 0), reason, matches };
  }

  // Get searchable text for a machine
  private getMachineSearchText(machine: Machine): string {
    return [
      machine.name,
      machine.type,
      machine.status,
      machine.operator,
      machine.shift,
      machine.job,
      machine.location,
      machine.realtimeData.quality,
      machine.realtimeData.vibration,
      machine.realtimeData.nextMaintenance,
      ...machine.qualityData.defectTypes.map(d => d.type),
      ...machine.downtimeData.todayBreakdown.map(d => d.cause)
    ].join(' ');
  }

  // Main intelligent search function
  public searchMachines(query: string, limit: number = 5): SearchResult[] {
    const results: SearchResult[] = [];

    for (const machine of this.machines) {
      const { score, reason, matches } = this.calculateIntelligentScore(query, machine);
      
      if (score > 0) {
        results.push({
          machine,
          relevanceScore: score,
          matchedKeywords: matches,
          matchReason: reason
        });
      }
    }

    // Sort by relevance score (descending) and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  // Get machine by ID
  public getMachineById(id: string): Machine | undefined {
    return this.machines.find(machine => machine.id === id);
  }

  // Get all machines
  public getAllMachines(): Machine[] {
    return this.machines;
  }

  // Get machines by status
  public getMachinesByStatus(status: string): Machine[] {
    return this.machines.filter(machine => 
      machine.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Get machines by type
  public getMachinesByType(type: string): Machine[] {
    return this.machines.filter(machine => 
      machine.type.toLowerCase() === type.toLowerCase()
    );
  }

  // Get best performing machine
  public getBestPerformingMachine(): Machine {
    return this.machines.reduce((best, current) => 
      current.oeeData.current.overall > best.oeeData.current.overall ? current : best
    );
  }

  // Get worst performing machine
  public getWorstPerformingMachine(): Machine {
    return this.machines.reduce((worst, current) => 
      current.oeeData.current.overall < worst.oeeData.current.overall ? current : worst
    );
  }

  // Get machines needing attention (maintenance, idle, or low performance)
  public getMachinesNeedingAttention(): Machine[] {
    return this.machines.filter(machine => 
      machine.status === 'MAINTENANCE' || 
      machine.status === 'IDLE' || 
      machine.oeeData.current.overall < 70
    );
  }

  // Calculate fleet-wide statistics
  public getFleetStatistics() {
    const runningMachines = this.machines.filter(m => m.status === 'RUNNING').length;
    const totalMachines = this.machines.length;
    const avgOEE = this.machines.reduce((sum, m) => sum + m.oeeData.current.overall, 0) / totalMachines;
    const totalProduction = this.machines.reduce((sum, m) => sum + m.realtimeData.outputRate, 0);
    
    return {
      totalMachines,
      runningMachines,
      utilizationRate: (runningMachines / totalMachines) * 100,
      averageOEE: Math.round(avgOEE * 10) / 10,
      totalProductionRate: totalProduction,
      machinesNeedingAttention: this.getMachinesNeedingAttention().length
    };
  }

  // Enhanced data selection with better query understanding
  public getRelevantData(query: string): {
    primaryMachine: Machine;
    relatedMachines: Machine[];
    searchResults: SearchResult[];
    fleetStats?: any;
    queryIntent: string;
  } {
    const searchResults = this.searchMachines(query, 5);
    const { intent } = this.analyzeQueryIntent(query);
    const lowerQuery = query.toLowerCase();
    
    let primaryMachine: Machine;
    let relatedMachines: Machine[] = [];
    let fleetStats;

    if (searchResults.length > 0) {
      primaryMachine = searchResults[0].machine;
      relatedMachines = searchResults.slice(1, 3).map(r => r.machine);
    } else {
      // Fallback based on query intent
      if (intent === 'troubleshooting') {
        const problemMachines = this.getMachinesNeedingAttention();
        primaryMachine = problemMachines.length > 0 ? problemMachines[0] : this.getWorstPerformingMachine();
      } else if (intent === 'performance_ranking') {
        primaryMachine = this.getBestPerformingMachine();
      } else {
        primaryMachine = this.getBestPerformingMachine();
      }
    }

    // Include fleet stats for general or comparison queries
    if (lowerQuery.includes('overall') || lowerQuery.includes('all') || 
        lowerQuery.includes('fleet') || lowerQuery.includes('total') ||
        lowerQuery.includes('compare') || intent === 'comparison') {
      fleetStats = this.getFleetStatistics();
    }

    return {
      primaryMachine,
      relatedMachines,
      searchResults,
      fleetStats,
      queryIntent: intent
    };
  }
} 
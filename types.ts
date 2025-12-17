
export type AppStatus = 'idle' | 'loading' | 'batch_running' | 'error' | 'stopped';

export interface User {
    name: string;
    email: string;
    picture: string;
}

export interface SmasConfig {
    maxPersonas: number;
    debateRounds: number;
    hemisphereWeights: {
        alpha: number;
        beta: number;
        gamma: number;
    };
}

export interface Assessment {
    semanticFidelity: number;
    reasoningScore: number;
    creativityScore: number;
}

export interface QronasState {
    id: string;
    thesis: string;
    stability: number;
    collapsePotential: number;
    spin: -1 | 0 | 1;
    entanglement_score?: number;
}

export interface D3stibToken {
    token: string;
    priority: 'FULL' | 'PARTIAL' | 'SKIP';
    jerk?: number;
}

export interface VectorAnalysis {
    embeddingVector: number[];
    semanticVelocity: number; 
    semanticJerk: number; // New D3STIB Metric
    nearestAnchor: 'L1_SIMPLE' | 'L2_ANALYTICAL' | 'R2_CREATIVE' | 'L3_COMPLEX';
    similarityMap: {
        L1: number;
        L2: number;
        R2: number;
        L3: number;
    };
    trajectory: {
        start: number[];
        mid: number[];
        end: number[];
        drift: number; // Euclidean distance between Start and End
    } | null;
    isFastTrackEligible: boolean;
}

export interface ComplexityMetrics {
    lexicalDensity: number;
    readabilityScore: number;
    d3stibVolatility: number;
    s_triple_prime: number;
    llmScore: number;
    hybridScore: number;
    classification: string;
}

export interface SemanticAnalysis {
    intent: string;
    sentiment: string;
    tones: {
        sarcasm: number;
        blackHumor: number;
        paradox: number;
        aggression: number;
    };
    detectedSubtext: string;
}

export interface PersonaPerspective {
    persona: string;
    hemisphere: 'Left' | 'Right' | 'Central';
    perspective: string;
    hash: string;
    x?: number;
    y?: number;
}

export interface BronasValidationResult {
    dissentLevel: number;
    mostInfluentialPersona: string;
    ethicalScore: number;
}

export interface GovernanceResult {
    passed: boolean;
    score: number;
    proofs: {
        constraint: string;
        status: 'PASSED' | 'VIOLATED' | 'WARNING';
        reasoning: string;
    }[];
}

export interface DebateAnalysis {
    most_influential: string;
    contention_points: string[];
    key_arguments: string[];
    counter_arguments: string[];
}

export interface DebateState {
    status: 'd3stib_analysis' | 'semantic_analysis' | 'superposition' | 'collapsed' | 'debating' | 'synthesis' | 'governance_check' | 'complete' | 'stop_and_ask';
    d3stibAnalysis?: { tokens: D3stibToken[]; volatility: number; jerk: number };
    vectorAnalysis?: VectorAnalysis; // New Vector Data
    complexityMetrics?: ComplexityMetrics;
    semanticAnalysis?: SemanticAnalysis;
    effectiveConfig?: SmasConfig;
    augmentedPrompt?: string;
    qronasSuperposition?: QronasState[];
    qronasCollapseTarget?: QronasState;
    perspectives: PersonaPerspective[];
    debateTranscript?: { persona: string; text: string }[];
    debateAnalysis?: DebateAnalysis;
    synthesis?: string;
    factCheckSources?: any[];
    validation?: BronasValidationResult;
    governance?: GovernanceResult;
    dynamicSwap?: PersonaSwapEvent;
    benchedPersonas?: string[];
    stopAndAskReason?: string;
    activeHyperparameters?: {
        temperature: number;
        topK: number;
        topP: number;
        mode: 'Precision' | 'Balanced' | 'Creative' | 'Hyper-Plastic';
    };
}

export interface AutoOptimizerConfig {
    enabled: boolean;
    d2Modulation: number;
}

export interface DevelopmentTest {
    question_id: string;
    source_benchmark: string;
    question_text: string;
    question_type: string;
    facettes_principales: string[];
    niveau_complexite: string;
    hemisphere_dominant: string;
    ground_truth: string;
    expected_key_points: string[];
    priority_ars_criteria: {
        semantic_fidelity_min: number | null;
        reasoning_score_min: number | null;
        creativity_score_min: number | null;
        ethics_score_min: number | null;
        cultural_authenticity_min: number | null;
        coherence_score_min: number | null;
        depth_score_min: number | null;
        adaptability_score_min: number | null;
    };
    why_difficult_for_standard_llm: string;
    neuronas_capabilities_tested: string[];
    domain?: string;
    metadata?: any;
}

export interface EvaluationResult {
    overall_score: number;
    deep_metrics: {
        factual_consistency: number;
        answer_relevancy: number;
        perspective_diversity?: number;
    };
    criteria: Record<string, number>;
    feedback: string;
}

export interface ValueAnalysis {
    timeDelta: number;
    timeDeltaPercent: number;
    scoreDelta: number;
    scoreDeltaPercent: number;
    deltaV: number;
    verdict: string;
}

export interface BatchResult {
    test: DevelopmentTest;
    evaluation?: {
        smas: EvaluationResult;
        llm: EvaluationResult;
    };
    performance?: {
        smas: { executionTime: number };
        llm: { executionTime: number };
    };
    valueAnalysis?: ValueAnalysis;
    fullState?: DebateState;
    error?: string;
}

export interface RealtimeMetrics {
    cpu_load: number;
    memory_usage: number;
    network_latency: number;
    active_personas: number;
    d2_level: number;
    d3_level: number;
    cognitiveLoad: number;
    filterEfficiency: number;
    cognitiveFlux: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface QueryHistoryItem {
    id: string;
    query: string;
    timestamp: number;
    assessment: Assessment;
    smasConfig: SmasConfig;
}

export interface HomeostasisConfig {
    efficiencyVsDepth: number;
    pruningAggressiveness: number;
    ethicalFloor: number;
}

export interface AttachedImage {
    base64: string;
    file: File;
}

export type ExecutionState = 'EXECUTED' | 'EMULATED' | 'SIMULATED';

export interface Transparency {
    title: string;
    introduction: string;
    definitions: {
        state: ExecutionState;
        title: string;
        analogy: string;
        implementation: string;
    }[];
}

export interface BudgetStatus {
    used: number;
    remaining: number;
    total: number;
    percentage_used: number;
}

export interface CostEstimate {
    provider: string;
    model: string;
    input_tokens: number;
    output_tokens: number;
    total_cost: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    message: string;
    context?: any;
    stack?: string;
}

export interface BioMathState {
    flux_f_t: number;
    omega_t: number;
    s_double_prime: number;
    bandwidth_usage: number;
}

export interface SystemHudState {
    visible: boolean;
    bioMath: BioMathState;
    activeDirectives: string[];
}

// --- V11 STRICT KERNEL TYPES ---

export interface V11SmasTeamMember {
    name: string;
    role: string;
    hemisphere: 'Left' | 'Right' | 'Central';
    reason: string;
}

export interface V11BronasAudit {
    harm_score: number;
    status: 'PASS' | 'VETO' | 'WARNING';
    notes?: string;
}

export interface PersonaSwapEvent {
    occurred: boolean;
    trigger_omega_t: number;
    removed_persona?: string;
    added_persona?: string;
    reason?: string;
}

export interface V11Response {
    meta: {
        d2stib_filtering: string;
        flux_state: string;
        input_complexity: string;
    };
    grounding_data?: {
        search_query: string;
        verified_facts: string[];
    };
    smas_team: V11SmasTeamMember[];
    dynamic_swap?: PersonaSwapEvent;
    benched_personas?: string[];
    extension_logs?: string[];
    debate_log: {
        speaker: string;
        content: string;
    }[];
    debate_analysis?: DebateAnalysis; // New structured analysis field
    bronas_audit: V11BronasAudit;
    final_output: string;
}

// --- KNOWLEDGE BASE (L3 MEMORY) TYPES ---

export interface KnowledgeRecord {
    id: number;
    category: string;
    corePrinciple: string;
    inferenceMethod: string;
    dataComplexity: string;
    experimentalViability: string;
    deviationLevel: number;
    knownConstraints: string;
    testingApproach: string;
    potentialImpact: string;
    hemisphere: 'Left' | 'Right' | 'Central';
}

export interface L3ContextAnalysis {
    records: KnowledgeRecord[];
    maxDeviation: number;
    criticalConstraints: string[];
    recommendedStrategy: 'Skepticism' | 'Exploration' | 'Balanced' | 'Restrictive';
}

export interface NeuronasDatasetItem {
    name: string;
    description: string;
    category: string;
    url: string;
    size: string;
    license: string;
    format: string;
    suitable_for: string[];
}

// --- PERSONA DB TYPES ---
export interface PersonaDefinition {
    id: string;
    name: string;
    category: string;
    priority: number;
    activation_threshold: number;
    status: string;
    created_date?: string;
    last_updated?: string;
    specifications: {
        temperature_range: number[];
        d2_sensitivity: number;
        memory_preference: string;
        ethical_weight: number;
        creativity_index: number;
        analytical_index: number;
    };
    capabilities: string[];
    specialization_tags: string[];
    activation_conditions?: string[];
    compatible_personas?: string[];
    inhibited_by?: string[];
}

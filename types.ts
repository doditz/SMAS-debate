
export type AppStatus = 'idle' | 'loading' | 'batch_running' | 'error' | 'stopped';
export type AppMode = 'user' | 'architect' | 'benchmark';

export interface User {
    name: string;
    email: string;
    picture: string;
}

export interface SmasConfig {
    maxPersonas: number;
    debateRounds: number;
    dynamicPersonaSwitching: boolean;
    hemisphereWeights: {
        alpha: number; // Logical
        beta: number;  // Creative
        gamma: number; // Central
    };
}

export interface Assessment {
    semanticFidelity: number;
    reasoningScore: number;
    creativityScore: number;
}

export interface D3stibToken {
    token: string;
    priority: 'FULL' | 'PARTIAL' | 'SKIP';
    embedding?: number[]; 
    v: number;  // Velocity (1st derivative)
    a: number;  // Acceleration (2nd derivative)
    s: number;  // Surge/Jerk (3rd derivative) - Core v13 Innovation
    finalScore: number;
}

export interface VectorIndexEntry {
    id: string;
    vector: number[];
    metadata: {
        source: 'L3_SQL' | 'USER_HISTORY' | 'SYNTHESIS';
        text: string;
        category?: string;
        timestamp: number;
        tags: string[];
    };
}

export interface VectorAnalysis {
    embeddingVector: number[];
    semanticVelocity: number; 
    semanticJerk: number;
    nearestAnchor: 'L1_SIMPLE' | 'L2_ANALYTICAL' | 'R2_CREATIVE' | 'L3_COMPLEX';
    similarityMap: {
        L1: number;
        L2: number;
        R2: number;
        L3: number;
    };
    trajectory: {
        drift: number;
        history: number[]; // For plotting
    } | null;
    isFastTrackEligible: boolean;
    matches?: VectorIndexEntry[];
}

export interface ComplexityMetrics {
    lexicalDensity: number;
    readabilityScore: number;
    d3stibVolatility: number;
    s_triple_prime: number; // The "Jerk" metric
    llmScore: number;
    hybridScore: number;
    classification: string;
}

export interface PersonaPerspective {
    persona: string;
    hemisphere: 'Left' | 'Right' | 'Central';
    perspective: string;
    hash: string;
    weight: number; // Agreement weight w_L / w_R
}

export interface EvaluationResult {
    overall_score: number;
    smrce: {
        sensory: number;
        memory: number;
        reasoning: number;
        coherence: number;
        ethicality: number;
    };
    deep_metrics: {
        factual_consistency: number;
        answer_relevancy: number;
    };
    feedback: string;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    criteria?: Record<string, number>;
}

export interface ValueAnalysis {
    timeDelta: number;
    timeDeltaPercent: number;
    scoreDelta: number;
    scoreDeltaPercent: number;
    deltaV: number;
    verdict: string;
    pValue: number;
    confidenceInterval: [number, number];
}

export interface BatchResult {
    id: string;
    test: DevelopmentTest;
    outputs?: {
        baseline: string;
        pipeline: string;
    };
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
    timestamp: number;
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
    cognitiveFlux: number; // F(t)
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

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    message: string;
    context?: any;
    stack?: string;
    experiment_id?: string;
}

export interface DevelopmentTest {
    question_id: string;
    source_benchmark: string;
    question_text: string;
    question_type: string;
    domain?: string;
}

export interface DebateTranscriptEntry {
    persona: string;
    speaker?: string;
    text: string;
    confidence: number;
    memoryAccess?: string;
    citations?: { title: string; url: string }[];
    timestamp?: number;
}

export interface DebateAnalysis {
    most_influential: string;
    contention_points: string[];
    key_arguments: string[];
    counter_arguments: string[];
}

export interface GovernanceProof {
    constraint: string;
    status: 'PASSED' | 'VIOLATED';
    reasoning: string;
}

export interface GovernanceResult {
    passed: boolean;
    score: number;
    proofs: GovernanceProof[];
}

export interface BronasValidationResult {
    dissentLevel: number;
    mostInfluentialPersona: string;
}

// QRONAS Types
export interface QronasState {
    id: string;
    thesis: string;
    stability: number;
    collapsePotential: number;
    spin: -1 | 0 | 1; // -1: Exclude, 0: Superposition, +1: Include
    entanglement_score?: number;
}

// NEW: Flow Control Interface
export interface DebateFlowControl {
    isPaused: boolean;
    step: boolean;
    pause: () => void;
    resume: () => void;
    stepForward: () => void;
}

export interface DebateState {
    status: 'idle' | 'd3stib_analysis' | 'debating' | 'synthesis' | 'governance_check' | 'complete' | 'stop_and_ask' | 'superposition' | 'collapsed';
    synthesis?: string;
    debateTranscript: DebateTranscriptEntry[];
    perspectives: PersonaPerspective[];
    debateAnalysis?: DebateAnalysis;
    governance?: GovernanceResult;
    stopAndAskReason?: string;
    activePersona?: string;
    d3stibAnalysis?: {
        tokens: D3stibToken[];
        volatility: number;
        jerk: number; // S'''
    };
    vectorAnalysis?: VectorAnalysis;
    complexityMetrics?: ComplexityMetrics;
    validation?: BronasValidationResult;
    qronasSuperposition?: QronasState[];
    qronasCollapseTarget?: QronasState;
    effectiveConfig?: SmasConfig;
    activeHyperparameters?: {
        mode: 'Precision' | 'Balanced' | 'Creative' | 'Hyper-Plastic';
        temperature: number;
        topK: number;
        topP: number;
    };
    factCheckSources?: { web: { uri: string; title: string } }[];
    globalConsensusScore?: number; // GC Score
    
    // NEW: Round Tracking
    roundInfo?: {
        current: number;
        total: number;
    };

    // NEW: Dynamic Persona Switching Log
    dynamic_swap?: {
        omegaT: number;
        original_plan: string[];
        adjusted_plan: string[];
        reasoning: string;
    };
}

export interface AutoOptimizerConfig {
    enabled: boolean;
    d2Modulation: number;
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

export interface PersonaDefinition {
    id: string;
    name: string;
    category: string;
    priority: number;
    activation_threshold: number;
    status: 'enabled' | 'disabled';
    specifications: {
        temperature_range: [number, number];
        d2_sensitivity: number;
        memory_preference: 'L1' | 'L2' | 'L3';
        ethical_weight: number;
        creativity_index: number;
        analytical_index: number;
    };
    capabilities: string[];
    specialization_tags: string[];
}

export interface TransparencyDefinition {
    state: ExecutionState;
    title: string;
    analogy: string;
    implementation: string;
}

export interface Transparency {
    title: string;
    introduction: string;
    definitions: TransparencyDefinition[];
}

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
    hemisphere?: string;
}

export interface L3ContextAnalysis {
    records: KnowledgeRecord[];
    maxDeviation: number;
    criticalConstraints: string[];
    recommendedStrategy: string;
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

export interface BenchmarkReport {
    timestamp: number;
    results: BatchResult[];
    summary?: {
        averageScore: number;
        lift: number;
    };
}
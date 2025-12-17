
// services/realtimeMetricsService.ts
import { RealtimeMetrics, ConnectionStatus, SmasConfig } from '../types';

interface MonitoringCallbacks {
    onMetrics: (metrics: RealtimeMetrics) => void;
    onStatusChange: (status: ConnectionStatus) => void;
}

class RealtimeMetricsService {
    private intervalId: number | null = null;
    private callbacks: MonitoringCallbacks | null = null;
    private status: ConnectionStatus = 'disconnected';
    
    private currentConfig: SmasConfig | null = null;
    
    // Real Telemetry State
    private lastLatency = 120; // Baseline ms
    private activeRequests = 0;
    private processingLoad = 0; // 0 to 100 derived from app activity
    private memoryBaseline = 40;
    
    // New: Complexity Impact
    private currentComplexityScore = 0.3; // Default low
    private currentLexicalDensity = 0.4;

    // Call this when an API call starts
    public startTransaction() {
        this.activeRequests++;
        this.processingLoad = 80; // High load during initiation
        this.triggerUpdate();
    }

    // Call this when an API call ends
    public endTransaction(durationMs: number) {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.lastLatency = durationMs;
        this.processingLoad = 20; // Drop load after receiving
        this.triggerUpdate();
    }

    // Call this during heavy local processing (e.g. parsing)
    public setProcessingState(isProcessing: boolean) {
        this.processingLoad = isProcessing ? 90 : 5;
        this.triggerUpdate();
    }
    
    // New: Update complexity state to drive load metrics
    public setComplexity(score: number, density: number) {
        this.currentComplexityScore = score;
        this.currentLexicalDensity = density;
        this.triggerUpdate();
    }

    // --- BIO-MATH ENGINE: Hemispheric Balance (Omega_t) ---
    // Calculates the bias between Analytical (1.0) and Creative (0.0) processing
    public calculateHemisphericBalance(text: string): number {
        const leftMarkers = [
            'calculate', 'analyze', 'logic', 'define', 'structure', 'system', 'code',
            'method', 'algorithm', 'proof', 'evidence', 'fact', 'data', 'metric',
            'verify', 'audit', 'optimize', 'function', 'variable', 'linear'
        ];
        
        const rightMarkers = [
            'imagine', 'feel', 'dream', 'create', 'story', 'narrative', 'flow',
            'essence', 'spirit', 'culture', 'art', 'metaphor', 'symbol', 'vision',
            'connect', 'holistic', 'organic', 'intuition', 'beauty', 'mood'
        ];

        const lowerText = text.toLowerCase();
        let leftScore = 0;
        let rightScore = 0;

        leftMarkers.forEach(word => { if(lowerText.includes(word)) leftScore++; });
        rightMarkers.forEach(word => { if(lowerText.includes(word)) rightScore++; });

        const total = leftScore + rightScore;
        
        // Default to 0.5 (Balanced) if no markers found
        if (total === 0) return 0.5;

        // Omega_t calculation: Ratio of Left to Total
        // 1.0 = Purely Analytical
        // 0.0 = Purely Creative
        const omega_t = leftScore / total;
        
        return Number(omega_t.toFixed(2));
    }

    // --- BIO-MATH ENGINE: Cognitive Flux F(t) ---
    // Formula: F(t) = a(s) * Integral(VC(s) * A(s)) ds
    // Simplified: Flux = Focus * Difficulty * Energy
    private calculateCognitiveFlux(d2_focus: number, cpu_load: number): number {
        // a(s) - Focus: Modeled by D2 level (0.0 to 1.0)
        const focus = d2_focus; 

        // VC(s) - Difficulty/Challenge: Modeled by current complexity context (0.0 to 1.0)
        const difficulty = Math.max(0.1, this.currentComplexityScore);

        // A(s) - Energy: Modeled by available CPU headroom (inverted load)
        // High load = Lower energy reserve available for new flux, but high *current* usage.
        // In the flow formula, A(s) is mental energy *applied*.
        const energyApplied = Math.min(1.0, cpu_load / 100);

        // F(t) calculation
        const flux = focus * difficulty * energyApplied;
        
        // Normalize to 0-100 scale for UI
        return Math.min(100, flux * 300); // Scaling factor for visibility
    }

    private triggerUpdate() {
        if (this.callbacks) {
            this.callbacks.onMetrics(this.generateMetrics());
        }
    }

    public getCurrentMetrics(): RealtimeMetrics {
        return this.generateMetrics();
    }

    private generateMetrics(): RealtimeMetrics {
        // Influence from Configuration
        let configMultiplier = 1.0;
        let d3Base = 0.1;
        
        if (this.currentConfig) {
            const { alpha, beta, gamma } = this.currentConfig.hemisphereWeights;
            // Alpha (Logic) consumes more 'compute'
            if (alpha > 0.5) configMultiplier = 1.2;
             // Beta (Creativity) increases entropy (D3)
            if (beta > 0.5) d3Base = 0.6;
        }

        // Decay processing load towards baseline if no active requests
        if (this.activeRequests === 0 && this.processingLoad > 5) {
            this.processingLoad *= 0.9; // Smooth decay
        }
        
        // COMPLEXITY INTEGRATION:
        // Higher complexity = Higher base cognitive load (simulating deeper processing)
        const complexityLoad = this.currentComplexityScore * 30; 
        
        // Calculate CPU based on simulated load + active requests impact + complexity baseline
        const cpu_load = Math.min(100, Math.max(5, 
            this.processingLoad + (this.activeRequests * 15) * configMultiplier + complexityLoad
        ));

        // Memory usage grows with activity AND lexical density (simulating context window usage)
        const densityImpact = this.currentLexicalDensity * 20;
        this.memoryBaseline = Math.min(90, Math.max(30, 
            this.memoryBaseline + (this.activeRequests * 0.5) - 0.1
        ));
        const effectiveMemory = Math.min(100, this.memoryBaseline + densityImpact);

        // Deterministic D3 Level (System Entropy)
        // Instead of Math.random(), we derive it from the variance of other metrics
        // High Load + High Latency = High Entropy (System Stress)
        const entropySignal = (cpu_load / 200) + (this.lastLatency / 2000);
        const d3_level = Math.min(1, Math.max(0, d3Base + (entropySignal * 0.5) + (this.currentComplexityScore * 0.2)));

        // D2 Level (Focus) - Inverse of Entropy, modulated by load
        const d2_level = Math.min(1, (cpu_load / 100) + 0.2);

        // Cognitive Flux Calculation
        const flux = this.calculateCognitiveFlux(d2_level, cpu_load);

        return {
            cpu_load: Number(cpu_load.toFixed(1)),
            memory_usage: Number(effectiveMemory.toFixed(1)),
            network_latency: Number(this.lastLatency.toFixed(0)),
            active_personas: this.currentConfig ? this.currentConfig.maxPersonas : 0,
            d2_level: Number(d2_level.toFixed(2)),
            d3_level: Number(d3_level.toFixed(2)),
            cognitiveLoad: Math.min(100, cpu_load * 0.8 + (this.activeRequests * 10)),
            filterEfficiency: Math.max(0, 100 - (d3Base * 50) - (this.activeRequests * 5) - (this.currentComplexityScore * 10)),
            cognitiveFlux: Number(flux.toFixed(1))
        };
    }

    private setStatus(newStatus: ConnectionStatus) {
        this.status = newStatus;
        this.callbacks?.onStatusChange(this.status);
    }
    
    public updateConfig(config: SmasConfig) {
        this.currentConfig = config;
        this.triggerUpdate();
    }

    public startMonitoring(callbacks: MonitoringCallbacks) {
        this.callbacks = callbacks;
        this.setStatus('connected'); // Assume connected since it's local logic
        
        // Push initial state
        this.triggerUpdate();

        // Heartbeat to handle decay and background noise
        this.intervalId = window.setInterval(() => {
            this.triggerUpdate();
        }, 500);
    }

    public stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.setStatus('disconnected');
    }

    public reconnect() {
        this.stopMonitoring();
        if (this.callbacks) {
            this.startMonitoring(this.callbacks);
        }
    }
}

const realtimeMetricsService = new RealtimeMetricsService();
export default realtimeMetricsService;

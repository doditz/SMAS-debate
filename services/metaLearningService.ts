
import { BatchResult, LogLevel } from '../types';
import loggingService from './loggingService';

interface LearnedWeights {
    personaWeights: Record<string, number>;
    d3stibThreshold: number;
    adaptationRate: number;
}

const STORAGE_KEY = 'neuronas_meta_v13_learned';

class MetaLearningService {
    private weights: LearnedWeights;

    constructor() {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            this.weights = saved ? JSON.parse(saved) : {
                personaWeights: {},
                d3stibThreshold: 0.45,
                adaptationRate: 0.04
            };
        } else {
            // Fallback for non-browser environments
            this.weights = {
                personaWeights: {},
                d3stibThreshold: 0.45,
                adaptationRate: 0.04
            };
        }
    }

    public getWeights() {
        return this.weights;
    }

    public getPersonaWeight(personaName: string): number {
        return this.weights.personaWeights[personaName] || 1.0;
    }

    public ingestResult(result: BatchResult, feedback?: 'positive' | 'negative') {
        if (!result.evaluation || !result.valueAnalysis) return;

        const { overall_score } = result.evaluation.smas;
        const { deltaV } = result.valueAnalysis;

        // Success Definition:
        // 1. Explicit Positive Feedback
        // 2. High Quality (Score > 8.5) AND High Efficiency (DeltaV > 0.9)
        const isSuccess = feedback === 'positive' || (overall_score >= 8.5 && deltaV > 0.9);
        
        // Failure Definition:
        // 1. Explicit Negative Feedback
        // 2. Low Quality (Score < 6.0) regardless of efficiency
        const isFailure = feedback === 'negative' || (overall_score < 6.0);

        if (!isSuccess && !isFailure) return; // Neutral result, no learning

        const modifier = isSuccess ? this.weights.adaptationRate : -this.weights.adaptationRate;

        // 1. Update Persona Weights
        if (result.fullState?.debateTranscript) {
            const activePersonas = new Set(result.fullState.debateTranscript.map(t => t.persona));
            activePersonas.forEach((name: string) => {
                const current = this.weights.personaWeights[name] || 1.0;
                // Clamp weights between 0.2 (min viable) and 2.0 (super star)
                this.weights.personaWeights[name] = Math.max(0.2, Math.min(2.0, current + modifier));
            });
        }

        // 2. Auto-Tune D3STIB Threshold (Surge Sensitivity)
        // If system was fast but poor quality -> Tighten threshold (process more)
        // If system was slow but great quality -> Loosen threshold (process less)
        if (deltaV < 0.4 && overall_score > 8.0) {
            // Good quality but inefficient: Loosen constraint slightly
            this.weights.d3stibThreshold = Math.min(0.85, this.weights.d3stibThreshold + 0.01);
        } else if (overall_score < 7.0 && deltaV > 1.3) {
            // Efficient but poor quality: Tighten constraint
            this.weights.d3stibThreshold = Math.max(0.1, this.weights.d3stibThreshold - 0.02);
        }

        this.persist();
        loggingService.info("Meta-Learning Step Complete", { 
            status: isSuccess ? 'REINFORCED' : 'PENALIZED',
            newD3Threshold: this.weights.d3stibThreshold.toFixed(3) 
        });
    }

    private persist() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.weights));
        }
    }
}

const metaLearningService = new MetaLearningService();
export default metaLearningService;

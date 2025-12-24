
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
        const saved = localStorage.getItem(STORAGE_KEY);
        this.weights = saved ? JSON.parse(saved) : {
            personaWeights: {},
            d3stibThreshold: 0.45,
            adaptationRate: 0.04
        };
    }

    public getWeights() {
        return this.weights;
    }

    public ingestResult(result: BatchResult, feedback?: 'positive' | 'negative') {
        if (!result.evaluation || !result.valueAnalysis) return;

        const { overall_score } = result.evaluation.smas;
        const { deltaV } = result.valueAnalysis;

        const isSuccess = feedback === 'positive' || (overall_score >= 8.5 && deltaV > 0.9);
        const isFailure = feedback === 'negative' || (overall_score < 6.0);

        if (!isSuccess && !isFailure) return;

        const modifier = isSuccess ? this.weights.adaptationRate : -this.weights.adaptationRate;

        if (result.fullState?.debateTranscript) {
            const activePersonas = new Set(result.fullState.debateTranscript.map(t => t.persona));
            activePersonas.forEach((name: string) => {
                const current = this.weights.personaWeights[name] || 1.0;
                this.weights.personaWeights[name] = Math.max(0.2, Math.min(2.0, current + modifier));
            });
        }

        if (deltaV < 0.4 && overall_score > 8.0) {
            this.weights.d3stibThreshold = Math.min(0.85, this.weights.d3stibThreshold + 0.03);
        } else if (overall_score < 7.0 && deltaV > 1.3) {
            this.weights.d3stibThreshold = Math.max(0.1, this.weights.d3stibThreshold - 0.03);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.weights));
        loggingService.info("Meta-Learning optimization step complete.", { weights: this.weights });
    }
}

export const metaLearningService = new MetaLearningService();

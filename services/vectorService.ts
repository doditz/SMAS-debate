
// services/vectorService.ts
import { GoogleGenAI } from "@google/genai";
import { VectorAnalysis } from '../types';
import loggingService from './loggingService';

// Pre-computed "Gold Standard" Anchors (Concepts). 
const ANCHOR_CONCEPTS = {
    L1_SIMPLE: "What is the capital of France? Define gravity. Who won the 1998 World Cup? Simple factual question.",
    L2_ANALYTICAL: "Analyze the economic impact of the 2008 crisis compared to 1929. Calculate the trajectory. Logical deduction required.",
    R2_CREATIVE: "Write a poem about a robot falling in love with a toaster. Imagine a color that doesn't exist. Abstract creative generation.",
    L3_COMPLEX: "Is ethical consumption possible under late capitalism? Resolve the Trolley Problem. Synthesis of conflicting moral frameworks."
};

class VectorService {
    private ai: GoogleGenAI | null = null;
    private anchorEmbeddings: Record<string, number[]> | null = null;
    public isSimulationMode: boolean = false;
    private readonly STORAGE_KEY = 'neuronas_vector_anchors_v1';

    constructor() {
        if (process.env.API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            this.isSimulationMode = false;
        } else {
            this.isSimulationMode = true;
        }
    }

    public setSimulationMode(enabled: boolean) {
        this.isSimulationMode = enabled;
    }

    // Optimization: Load from localStorage first to avoid API calls on every reload
    private async ensureAnchorsLoaded() {
        if (this.anchorEmbeddings || this.isSimulationMode) return;

        // Try load from storage
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                this.anchorEmbeddings = JSON.parse(stored);
                loggingService.info("Vector Anchors Loaded from Local Storage (Cache Hit).");
                return;
            } catch (e) {
                console.warn("Failed to parse stored anchors, regenerating...");
            }
        }

        loggingService.info("Initializing Vector Anchors via API...");
        try {
            this.anchorEmbeddings = {};
            const keys = Object.keys(ANCHOR_CONCEPTS) as (keyof typeof ANCHOR_CONCEPTS)[];
            
            // Generate embeddings for all anchors in parallel
            const promises = keys.map(async (key) => {
                if (!this.ai) return;
                const result = await this.ai.models.embedContent({
                    model: "text-embedding-004",
                    content: { parts: [{ text: ANCHOR_CONCEPTS[key] }] }
                });
                if (result.embedding?.values) {
                    this.anchorEmbeddings![key] = result.embedding.values;
                }
            });

            await Promise.all(promises);
            
            // Save to storage
            if (Object.keys(this.anchorEmbeddings).length > 0) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.anchorEmbeddings));
                loggingService.info("Vector Anchors Generated & Cached.");
            }
        } catch (e) {
            loggingService.error("Failed to load Vector Anchors", { error: e });
            this.isSimulationMode = true; 
        }
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // New D3STIB v4.7 Feature: Calculate Semantic Jerk via Trajectory
    // Instead of embedding every token (too expensive), we embed Start, Middle, End
    private async calculateTrajectory(text: string): Promise<{ start: number[], mid: number[], end: number[], drift: number } | null> {
        if (text.split(' ').length < 10) return null; // Too short for trajectory

        const len = text.length;
        const chunk1 = text.substring(0, Math.min(len / 3, 200));
        const chunk2 = text.substring(len / 3, Math.min(2 * len / 3, len / 3 + 200));
        const chunk3 = text.substring(2 * len / 3, Math.min(len, 2 * len / 3 + 200));

        try {
            const batch = await this.ai?.models.batchEmbedContents({
                model: "text-embedding-004",
                requests: [
                    { content: { parts: [{ text: chunk1 }] } },
                    { content: { parts: [{ text: chunk2 }] } },
                    { content: { parts: [{ text: chunk3 }] } }
                ]
            });

            const vecs = batch?.embeddings?.map(e => e.values) || [];
            if (vecs.length !== 3 || !vecs[0] || !vecs[1] || !vecs[2]) return null;

            // Drift = Distance between Start and End (Semantic Shift)
            const drift = 1 - this.cosineSimilarity(vecs[0], vecs[2]);

            return {
                start: vecs[0],
                mid: vecs[1],
                end: vecs[2],
                drift: drift
            };
        } catch (e) {
            loggingService.warn("Trajectory Calculation Failed", { error: e });
            return null;
        }
    }

    // Heuristic fallback for simulation mode
    private simulateAnalysis(text: string): VectorAnalysis {
        const lower = text.toLowerCase();
        let l1Score = 0.8; 
        let l2Score = 0.1;
        let r2Score = 0.1;
        let l3Score = 0.0;

        if (lower.length > 100 || lower.includes("analyze") || lower.includes("compare")) {
            l1Score = 0.2; l2Score = 0.6; r2Score = 0.1; l3Score = 0.1;
        }
        if (lower.includes("imagine") || lower.includes("story") || lower.includes("poem")) {
            l1Score = 0.1; l2Score = 0.1; r2Score = 0.7; l3Score = 0.1;
        }
        if (lower.includes("ethics") || lower.includes("moral") || lower.includes("consciousness")) {
            l1Score = 0.0; l2Score = 0.2; r2Score = 0.2; l3Score = 0.6;
        }

        const maxScore = Math.max(l1Score, l2Score, r2Score, l3Score);
        let nearest: any = 'L1_SIMPLE';
        if (maxScore === l2Score) nearest = 'L2_ANALYTICAL';
        if (maxScore === r2Score) nearest = 'R2_CREATIVE';
        if (maxScore === l3Score) nearest = 'L3_COMPLEX';

        return {
            embeddingVector: Array(10).fill(0).map(() => Math.random()),
            semanticVelocity: maxScore,
            semanticJerk: Math.random() * 0.2, // Simulated Jerk
            nearestAnchor: nearest,
            similarityMap: { L1: l1Score, L2: l2Score, R2: r2Score, L3: l3Score },
            trajectory: null,
            isFastTrackEligible: nearest === 'L1_SIMPLE' && text.length < 100
        };
    }

    public async analyzeComplexity(text: string): Promise<VectorAnalysis> {
        if (this.isSimulationMode || !this.ai) {
            return this.simulateAnalysis(text);
        }

        try {
            await this.ensureAnchorsLoaded();

            // 1. Main Embedding (Whole Query)
            const result = await this.ai.models.embedContent({
                model: "text-embedding-004",
                content: { parts: [{ text }] }
            });
            const queryVector = result.embedding?.values;

            if (!queryVector || !this.anchorEmbeddings) throw new Error("Embedding generation failed");

            // 2. Semantic Trajectory (The "Jerk" Calculation)
            const trajectory = await this.calculateTrajectory(text);
            
            // Calculate Semantic Jerk
            // If trajectory exists: Jerk = |Dist(Start, Mid) - Dist(Mid, End)|
            // High jerk means the "speed" of semantic change varied wildly
            let semanticJerk = 0;
            if (trajectory) {
                const dist1 = 1 - this.cosineSimilarity(trajectory.start, trajectory.mid);
                const dist2 = 1 - this.cosineSimilarity(trajectory.mid, trajectory.end);
                semanticJerk = Math.abs(dist1 - dist2);
            }

            // 3. Anchor Classification
            const scores = {
                L1: this.cosineSimilarity(queryVector, this.anchorEmbeddings.L1_SIMPLE),
                L2: this.cosineSimilarity(queryVector, this.anchorEmbeddings.L2_ANALYTICAL),
                R2: this.cosineSimilarity(queryVector, this.anchorEmbeddings.R2_CREATIVE),
                L3: this.cosineSimilarity(queryVector, this.anchorEmbeddings.L3_COMPLEX),
            };

            // Identify Winner
            let maxScore = -1;
            let winner: any = 'L1_SIMPLE';
            
            (Object.keys(scores) as (keyof typeof scores)[]).forEach(k => {
                if (scores[k] > maxScore) {
                    maxScore = scores[k];
                    switch(k) {
                        case 'L1': winner = 'L1_SIMPLE'; break;
                        case 'L2': winner = 'L2_ANALYTICAL'; break;
                        case 'R2': winner = 'R2_CREATIVE'; break;
                        case 'L3': winner = 'L3_COMPLEX'; break;
                    }
                }
            });

            // Fast Track Rule: L1 Simple AND Low Jerk (Stable meaning)
            const isFastTrack = winner === 'L1_SIMPLE' && maxScore > 0.65 && semanticJerk < 0.15;

            return {
                embeddingVector: queryVector.slice(0, 10), 
                semanticVelocity: 1 - maxScore,
                semanticJerk,
                nearestAnchor: winner,
                similarityMap: scores,
                trajectory,
                isFastTrackEligible: isFastTrack
            };

        } catch (e) {
            loggingService.error("Vector Analysis API Error", { error: e });
            return this.simulateAnalysis(text); // Fallback
        }
    }
}

const vectorService = new VectorService();
export default vectorService;

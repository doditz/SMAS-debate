
// services/vectorService.ts
import { GoogleGenAI } from "@google/genai";
import { VectorAnalysis, D3stibToken, VectorIndexEntry } from '../types';
import loggingService from './loggingService';

const ANCHOR_CONCEPTS = {
    L1_SIMPLE: "Basic facts, simple instructions, or low-complexity definitions.",
    L2_ANALYTICAL: "Step-by-step logic, code, mathematical proofs, or systemic structural analysis.",
    R2_CREATIVE: "Metaphors, storytelling, divergent perspectives, or creative conceptual expansion.",
    L3_COMPLEX: "Ethical paradoxes, multi-layered philosophical synthesis, or highly entropic inquiries."
};

class VectorService {
    private ai: GoogleGenAI | null = null;
    private anchorEmbeddings: Record<string, number[]> | null = null;
    public isSimulationMode: boolean = false;
    private readonly INDEX_KEY = 'neuronas_v13_chroma_v3';
    private vectorIndex: VectorIndexEntry[] = [];

    constructor() {
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            this.ai = new GoogleGenAI({ apiKey });
            this.isSimulationMode = false;
        } else {
            this.isSimulationMode = true;
        }
        this.loadIndex();
    }

    private loadIndex() {
        const stored = localStorage.getItem(this.INDEX_KEY);
        if (stored) {
            try {
                this.vectorIndex = JSON.parse(stored);
                loggingService.info("Vector store (ChromaDB Sim) ready.", { count: this.vectorIndex.length });
            } catch (e) {
                this.vectorIndex = [];
            }
        }
    }

    private saveIndex() {
        localStorage.setItem(this.INDEX_KEY, JSON.stringify(this.vectorIndex));
    }

    // --- MATHEMATICAL CORE (NEURONAS V13) ---

    // Euclidean Distance (for Velocity)
    private euclideanDistance(v1: number[], v2: number[]): number {
        return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
    }

    // Eq (4) & (7): Semantic Velocity v_i = ||e_i - e_{i-1}||
    private calculateVelocity(current: number[], previous: number[]): number {
        return this.euclideanDistance(current, previous);
    }

    // Eq (5) & (8): Semantic Acceleration a_i = v_i - v_{i-1}
    private calculateAcceleration(currentVel: number, previousVel: number): number {
        return currentVel - previousVel;
    }

    // Eq (6) & (9): Semantic Surge (Jerk) s_i = a_i - a_{i-1}
    private calculateSurge(currentAcc: number, previousAcc: number): number {
        return currentAcc - previousAcc;
    }

    /**
     * Algorithm 1: D³STIB Token Dispatch
     * Computes the 3 derivatives for a sequence of tokens/vectors.
     */
    public calculateD3stibMetrics(tokens: string[], embeddings: number[][]): D3stibToken[] {
        const results: D3stibToken[] = [];
        
        // Thresholds from Table 2 (STANDARD Tier)
        const THETA_ACCEL = 0.25;
        const THETA_SURGE = 0.18;

        let velocities: number[] = [];
        let accelerations: number[] = [];

        for (let i = 0; i < tokens.length; i++) {
            let v = 0, a = 0, s = 0;
            let priority: 'FULL' | 'PARTIAL' | 'SKIP' = 'SKIP';

            if (i > 0) {
                v = this.calculateVelocity(embeddings[i], embeddings[i-1]);
            }
            velocities.push(v);

            if (i > 1) {
                a = this.calculateAcceleration(v, velocities[i-1]);
            }
            accelerations.push(a);

            if (i > 2) {
                s = this.calculateSurge(a, accelerations[i-1]);
            }

            // Dispatch Logic (Algorithm 1, Lines 5-11)
            const absS = Math.abs(s);
            const absA = Math.abs(a);

            if (absS > THETA_SURGE) {
                priority = 'FULL'; // High surge: emergent novelty
            } else if (absA > THETA_ACCEL) {
                priority = 'PARTIAL'; // High acceleration: transition
            } else {
                priority = 'SKIP'; // Redundant
            }

            results.push({
                token: tokens[i],
                priority,
                embedding: embeddings[i],
                v: parseFloat(v.toFixed(4)),
                a: parseFloat(a.toFixed(4)),
                s: parseFloat(s.toFixed(4)),
                finalScore: parseFloat(((absS + absA) / 2).toFixed(3))
            });
        }

        return results;
    }

    // Generates pseudo-vectors for tokens to allow D3STIB calculation without n*API calls
    private generatePseudoVectors(tokens: string[], baseVector: number[]): number[][] {
        return tokens.map((t, i) => {
            // Create a variation of the base vector based on token hash
            const hash = t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return baseVector.map((val, j) => {
                const noise = Math.sin(hash * (j + 1) + i) * 0.15; // Semantic noise
                return val + noise;
            });
        });
    }

    public async addToIndex(text: string, metadata: VectorIndexEntry['metadata']) {
        if (!this.ai || this.isSimulationMode) return;
        try {
            const res = await this.ai.models.embedContent({
                model: "text-embedding-004",
                content: { parts: [{ text }] }
            });
            const values = res.embedding?.values;
            if (values) {
                const entry: VectorIndexEntry = {
                    id: `vec-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    vector: values,
                    metadata: { ...metadata, text }
                };
                if (metadata.source === 'L3_SQL') {
                    this.vectorIndex = this.vectorIndex.filter(e => e.metadata.text !== text);
                }
                this.vectorIndex.push(entry);
                this.saveIndex();
            }
        } catch (e) {
            loggingService.error("Embedding indexing failed", e);
        }
    }

    public async searchIndex(queryText: string, limit: number = 5): Promise<VectorIndexEntry[]> {
        if (!this.ai || this.isSimulationMode || this.vectorIndex.length === 0) return [];
        try {
            const res = await this.ai.models.embedContent({
                model: "text-embedding-004",
                content: { parts: [{ text: queryText }] }
            });
            const queryVec = res.embedding?.values;
            if (!queryVec) return [];

            return [...this.vectorIndex]
                .map(entry => ({ entry, score: this.cosineSimilarity(queryVec, entry.vector) }))
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(x => x.entry);
        } catch (e) { return []; }
    }

    private async ensureAnchors() {
        if (this.anchorEmbeddings || this.isSimulationMode || !this.ai) return;
        this.anchorEmbeddings = {};
        for (const [key, text] of Object.entries(ANCHOR_CONCEPTS)) {
            const res = await this.ai.models.embedContent({
                model: "text-embedding-004",
                content: { parts: [{ text }] }
            });
            if (res.embedding?.values) this.anchorEmbeddings[key] = res.embedding.values;
        }
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dot = 0, nA = 0, nB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            nA += vecA[i] * vecA[i];
            nB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(nA) * Math.sqrt(nB) || 1e-10);
    }

    public async analyzeComplexity(text: string): Promise<VectorAnalysis> {
        if (this.isSimulationMode || !this.ai) return this.simulateAnalysis(text);
        try {
            await this.ensureAnchors();
            const res = await this.ai.models.embedContent({
                model: "text-embedding-004",
                content: { parts: [{ text }] }
            });
            const vec = res.embedding?.values;
            if (!vec || !this.anchorEmbeddings) throw new Error("Context missing");

            const simMap = {
                L1: this.cosineSimilarity(vec, this.anchorEmbeddings.L1_SIMPLE),
                L2: this.cosineSimilarity(vec, this.anchorEmbeddings.L2_ANALYTICAL),
                R2: this.cosineSimilarity(vec, this.anchorEmbeddings.R2_CREATIVE),
                L3: this.cosineSimilarity(vec, this.anchorEmbeddings.L3_COMPLEX),
            };

            const matches = await this.searchIndex(text);
            const maxSim = Math.max(...Object.values(simMap));
            const nearest: any = Object.keys(simMap).find(k => (simMap as any)[k] === maxSim) || 'L1';

            // Calculate Velocity/Jerk based on L1->L3 distance approximation for the whole query
            const semanticVelocity = Math.abs(simMap.L3 - simMap.L1);
            const semanticJerk = Math.abs(maxSim - 0.5) * 0.4; // Pseudo-jerk for whole text

            return {
                embeddingVector: vec.slice(0, 10),
                semanticVelocity: Number(semanticVelocity.toFixed(4)),
                semanticJerk: Number(semanticJerk.toFixed(4)),
                nearestAnchor: nearest === 'L1' ? 'L1_SIMPLE' : nearest === 'L2' ? 'L2_ANALYTICAL' : nearest === 'R2' ? 'R2_CREATIVE' : 'L3_COMPLEX',
                similarityMap: simMap,
                trajectory: { drift: semanticVelocity, history: [] },
                isFastTrackEligible: (nearest === 'L1' && maxSim > 0.9) || text.length < 15,
                matches
            };
        } catch (e) { return this.simulateAnalysis(text); }
    }

    public calculateTokenImportance(tokens: string[], baseEmbedding?: number[]): D3stibToken[] {
        // If we don't have embeddings for every token (too slow), we simulate them relative to the base
        const vectorBase = baseEmbedding || Array(768).fill(0).map(()=>Math.random());
        const vectors = this.generatePseudoVectors(tokens, vectorBase);
        return this.calculateD3stibMetrics(tokens, vectors);
    }

    private simulateAnalysis(text: string): VectorAnalysis {
        return {
            embeddingVector: Array(10).fill(0).map(() => Math.random()),
            semanticVelocity: 0.35, semanticJerk: 0.05,
            nearestAnchor: 'L1_SIMPLE',
            similarityMap: { L1: 0.8, L2: 0.1, R2: 0.05, L3: 0.05 },
            trajectory: { drift: 0.2, history: [] }, 
            isFastTrackEligible: text.length < 20
        };
    }
}

const vectorService = new VectorService();
export default vectorService;

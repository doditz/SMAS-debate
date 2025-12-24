
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
                // Upsert logic for core principles
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

    public calculateTokenImportance(tokens: string[]): D3stibToken[] {
        const result: D3stibToken[] = [];
        let pV = 0;
        tokens.forEach((token, i) => {
            const weight = token.length > 7 ? 0.3 : 0.1;
            const noise = (Math.random() * 0.1);
            const score = Math.min(1, weight + noise + (pV * 0.2));
            result.push({
                token,
                priority: score > 0.6 ? 'FULL' : score > 0.3 ? 'PARTIAL' : 'SKIP',
                i0: weight, v: score - pV, a: (score - pV) - pV,
                finalScore: Number(score.toFixed(3))
            });
            pV = score;
        });
        return result;
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

            return {
                embeddingVector: vec.slice(0, 10),
                semanticVelocity: Number(Math.abs(simMap.L3 - simMap.L1).toFixed(4)),
                semanticJerk: Number((maxSim - 0.15).toFixed(4)),
                nearestAnchor: nearest === 'L1' ? 'L1_SIMPLE' : nearest === 'L2' ? 'L2_ANALYTICAL' : nearest === 'R2' ? 'R2_CREATIVE' : 'L3_COMPLEX',
                similarityMap: simMap,
                trajectory: null,
                isFastTrackEligible: (nearest === 'L1' && maxSim > 0.9) || text.length < 15,
                matches
            };
        } catch (e) { return this.simulateAnalysis(text); }
    }

    private simulateAnalysis(text: string): VectorAnalysis {
        return {
            embeddingVector: Array(10).fill(0).map(() => Math.random()),
            semanticVelocity: 0.35, semanticJerk: 0.05,
            nearestAnchor: 'L1_SIMPLE',
            similarityMap: { L1: 0.8, L2: 0.1, R2: 0.05, L3: 0.05 },
            trajectory: null, isFastTrackEligible: text.length < 20
        };
    }
}

const vectorService = new VectorService();
export default vectorService;

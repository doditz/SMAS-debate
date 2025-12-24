
// services/memorySystemService.ts
import { rawCsvData } from '../data/rawCsvData';
import { neuronasDataset } from '../data/neuronasDataset';
import { KnowledgeRecord, L3ContextAnalysis, NeuronasDatasetItem } from '../types';
import loggingService from './loggingService';
import vectorService from './vectorService';

export interface MemoryNode {
    id: string;
    label: string;
    type: 'concept' | 'query' | 'persona_insight' | 'synthesis' | 'knowledge_fact' | 'dataset';
    strength: number; 
    lastAccessed: number;
    data?: KnowledgeRecord | NeuronasDatasetItem;
    tier?: string;
}

export interface MemoryLink {
    source: string;
    target: string;
    strength: number;
}

export interface MemoryState {
    nodes: MemoryNode[];
    links: MemoryLink[];
}

class MemorySystemService {
    private memoryState: MemoryState = { nodes: [], links: [] };
    private intervalId: number | null = null;
    private maxNodes = 60;
    
    // THE "SQL" DATABASE (Relational Store)
    private l3RelationalStore: Map<number, KnowledgeRecord> = new Map();

    constructor() {
        this.initializeRelationalStore();
        this.loadNeuronasDatasets();
        // Trigger background indexing for vector search
        this.performVectorIndexing();
    }

    private initializeRelationalStore() {
        try {
            const lines = rawCsvData.trim().split('\n');
            // ID,Category,Core Principle,Inference Method,Data Complexity,Experimental Viability,Deviation Level,Known Constraints,Testing Approach,Potential Impact
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length < 10) continue;
                const id = parseInt(cols[0]);
                const record: KnowledgeRecord = {
                    id,
                    category: cols[1],
                    corePrinciple: cols[2],
                    inferenceMethod: cols[3],
                    dataComplexity: cols[4],
                    experimentalViability: cols[5],
                    deviationLevel: parseFloat(cols[6]),
                    knownConstraints: cols[7],
                    testingApproach: cols[8],
                    potentialImpact: cols[9],
                    hemisphere: 'Central'
                };
                this.l3RelationalStore.set(id, record);
            }
            loggingService.info("L3 Relational Store Initialized (SQL Sim)", { rows: this.l3RelationalStore.size });
        } catch (e) {
            loggingService.error("SQL Init Fail", e);
        }
    }

    private async performVectorIndexing() {
        if (vectorService.isSimulationMode) return;
        loggingService.info("Mapping Relational Store to Vector Index...");
        for (const record of Array.from(this.l3RelationalStore.values())) {
            await vectorService.addToIndex(record.corePrinciple, {
                source: 'L3_SQL',
                text: record.corePrinciple,
                category: record.category,
                timestamp: Date.now(),
                tags: [record.category, record.potentialImpact]
            });
        }
    }

    private loadNeuronasDatasets() {
        const datasets = neuronasDataset.datasets as NeuronasDatasetItem[];
        const nodes: MemoryNode[] = datasets.map(ds => ({
            id: `ds-${ds.name.toLowerCase().replace(/\s+/g, '-')}`,
            label: ds.name,
            type: 'dataset',
            strength: 0.8,
            lastAccessed: Date.now(),
            data: ds
        }));
        this.updateMemoryGraph(nodes);
    }

    public retrieveL3Context(query: string): L3ContextAnalysis {
        const queryLower = query.toLowerCase();
        
        // 1. Relational Logic (SQL-style filtering)
        const sqlMatches = Array.from(this.l3RelationalStore.values()).filter(r => 
            queryLower.includes(r.category.toLowerCase()) || 
            queryLower.includes(r.corePrinciple.toLowerCase())
        );

        // 2. The synthesis will also benefit from vector search performed in smasService
        const relevant = sqlMatches.slice(0, 3);
        this.ingestKnowledge(relevant);

        let maxDeviation = Math.max(0, ...relevant.map(r => r.deviationLevel));
        const constraints = relevant.map(r => `${r.category}: ${r.knownConstraints}`);

        return {
            records: relevant,
            maxDeviation,
            criticalConstraints: constraints,
            recommendedStrategy: maxDeviation > 0.08 ? 'Restrictive' : 'Balanced'
        };
    }

    private ingestKnowledge(records: KnowledgeRecord[]) {
        const newNodes: MemoryNode[] = records.map(rec => ({
            id: `k-${rec.id}`,
            label: rec.corePrinciple,
            type: 'knowledge_fact',
            strength: 0.95,
            lastAccessed: Date.now(),
            data: rec
        }));
        this.updateMemoryGraph(newNodes);
    }

    public ingestConcepts(concepts: string[]) {
        const newNodes: MemoryNode[] = concepts.slice(0, 3).map((concept, i) => ({
            id: `c-${Date.now()}-${i}`,
            label: concept,
            type: 'query',
            strength: 1.0,
            lastAccessed: Date.now(),
        }));
        this.updateMemoryGraph(newNodes);
    }

    private updateMemoryGraph(newNodes: MemoryNode[]) {
        const currentIds = new Set(this.memoryState.nodes.map(n => n.id));
        const filteredNew = newNodes.filter(n => !currentIds.has(n.id));
        this.memoryState.nodes.push(...filteredNew);
        
        if (this.memoryState.nodes.length > this.maxNodes) {
            this.memoryState.nodes.sort((a, b) => b.strength - a.strength);
            this.memoryState.nodes = this.memoryState.nodes.slice(0, this.maxNodes);
        }
    }

    startPublishing(callback: (state: MemoryState) => void) {
        if (this.intervalId) return;
        this.intervalId = window.setInterval(() => {
            this.memoryState.nodes.forEach(n => { if(n.id !== 'root') n.strength *= 0.997; });
            callback({...this.memoryState});
        }, 1000);
    }

    stopPublishing() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
    }
}

const memorySystemService = new MemorySystemService();
export default memorySystemService;

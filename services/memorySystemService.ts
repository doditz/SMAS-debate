
// services/memorySystemService.ts
import { rawCsvData } from '../data/rawCsvData';
import { neuronasDataset } from '../data/neuronasDataset';
import { KnowledgeRecord, L3ContextAnalysis, NeuronasDatasetItem } from '../types';
import loggingService from './loggingService';
import vectorService from './vectorService';

// Table 6: 7-Tier Memory Architecture Specifications
export type MemoryTier = 
    | 'L1' | 'L2' | 'L3'  // Analytical (Left)
    | 'R1' | 'R2' | 'R3'  // Creative (Right)
    | 'GC';               // Garbage Collection/System

export interface MemoryNode {
    id: string;
    label: string;
    type: 'concept' | 'query' | 'persona_insight' | 'synthesis' | 'knowledge_fact' | 'dataset';
    strength: number; 
    lastAccessed: number;
    tier: MemoryTier; // Explicit Tier Assignment
    hemisphere: 'Left' | 'Right' | 'System';
    data?: KnowledgeRecord | NeuronasDatasetItem;
    connections: string[]; // IDs of connected nodes for Hebbian logic
}

export interface MemoryLink {
    source: string;
    target: string;
    strength: number; // Synaptic weight w_ij
}

export interface MemoryState {
    nodes: MemoryNode[];
    links: MemoryLink[];
}

class MemorySystemService {
    private memoryState: MemoryState = { nodes: [], links: [] };
    private intervalId: number | null = null;
    private readonly MAX_NODES_PER_TIER = {
        L1: 15, L2: 30, L3: 50,
        R1: 15, R2: 30, R3: 50,
        GC: 10
    };
    
    // THE "SQL" DATABASE (Relational Store)
    private l3RelationalStore: Map<number, KnowledgeRecord> = new Map();

    // Hebbian Learning Rate (eta) from Eq (3)
    private readonly HEBBIAN_RATE = 0.15; 

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
        const nodes: MemoryNode[] = datasets.map(ds => {
            // Assign Tier based on suitability
            let tier: MemoryTier = 'L3';
            let hemi: 'Left' | 'Right' = 'Left';
            
            if (ds.suitable_for.includes('right_hemisphere')) {
                tier = 'R2';
                hemi = 'Right';
            } else if (ds.suitable_for.includes('left_hemisphere')) {
                tier = 'L2';
                hemi = 'Left';
            }

            return {
                id: `ds-${ds.name.toLowerCase().replace(/\s+/g, '-')}`,
                label: ds.name,
                type: 'dataset',
                strength: 0.8,
                lastAccessed: Date.now(),
                tier: tier,
                hemisphere: hemi,
                data: ds,
                connections: []
            };
        });
        this.updateMemoryGraph(nodes);
    }

    // Equation 17: Tier Selection Algorithm
    private determineTier(contextAge: number, importance: number, hemisphere: 'Left' | 'Right'): MemoryTier {
        if (contextAge < 0.3 || importance > 0.8) return hemisphere === 'Left' ? 'L1' : 'R1'; // Immediate
        if (contextAge < 0.7 || importance > 0.5) return hemisphere === 'Left' ? 'L2' : 'R2'; // Working
        return hemisphere === 'Left' ? 'L3' : 'R3'; // Long-term
    }

    public retrieveL3Context(query: string): L3ContextAnalysis {
        const queryLower = query.toLowerCase();
        
        // 1. Relational Logic (SQL-style filtering)
        const sqlMatches = Array.from(this.l3RelationalStore.values()).filter(r => 
            queryLower.includes(r.category.toLowerCase()) || 
            queryLower.includes(r.corePrinciple.toLowerCase())
        );

        // 2. Ingest into Memory Graph (activating Hebbian learning)
        const relevant = sqlMatches.slice(0, 5);
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
            tier: 'L3', // Facts default to L3 (Long term analytical)
            hemisphere: 'Left',
            data: rec,
            connections: []
        }));
        this.updateMemoryGraph(newNodes);
        this.applyHebbianUpdates(newNodes.map(n => n.id));
    }

    public ingestConcepts(concepts: string[], hemisphere: 'Left' | 'Right' = 'Right') {
        const newNodes: MemoryNode[] = concepts.slice(0, 3).map((concept, i) => ({
            id: `c-${Date.now()}-${i}`,
            label: concept,
            type: 'concept',
            strength: 1.0,
            lastAccessed: Date.now(),
            tier: hemisphere === 'Left' ? 'L1' : 'R1', // New concepts start in immediate memory
            hemisphere: hemisphere,
            connections: []
        }));
        this.updateMemoryGraph(newNodes);
        this.applyHebbianUpdates(newNodes.map(n => n.id));
    }

    private updateMemoryGraph(newNodes: MemoryNode[]) {
        const currentIds = new Set(this.memoryState.nodes.map(n => n.id));
        const filteredNew = newNodes.filter(n => !currentIds.has(n.id));
        this.memoryState.nodes.push(...filteredNew);
        
        // Enforce Tier Limits (Garbage Collection)
        this.runGarbageCollection();
    }

    // Equation 3: Hebbian Learning
    // w_ij(t+1) = w_ij(t) + eta * a_i(t) * a_j(t)
    private applyHebbianUpdates(activatedIds: string[]) {
        // Create full mesh connections between simultaneously activated nodes
        for (let i = 0; i < activatedIds.length; i++) {
            for (let j = i + 1; j < activatedIds.length; j++) {
                const idA = activatedIds[i];
                const idB = activatedIds[j];
                
                let link = this.memoryState.links.find(l => 
                    (l.source === idA && l.target === idB) || (l.source === idB && l.target === idA)
                );

                if (!link) {
                    link = { source: idA, target: idB, strength: 0.1 };
                    this.memoryState.links.push(link);
                }

                // Activation a(t) assumed 1.0 for currently active nodes
                // Update weight
                link.strength = Math.min(1.0, link.strength + this.HEBBIAN_RATE * 1.0 * 1.0);
            }
        }
    }

    private runGarbageCollection() {
        // Sort by strength and tier
        // This is a simplified GC logic. Real logic would move items between tiers.
        if (this.memoryState.nodes.length > 80) {
             this.memoryState.nodes.sort((a, b) => b.strength - a.strength);
             this.memoryState.nodes = this.memoryState.nodes.slice(0, 80);
        }
    }

    startPublishing(callback: (state: MemoryState) => void) {
        if (this.intervalId) return;
        this.intervalId = window.setInterval(() => {
            // Decay strengths (Forgetting curve)
            this.memoryState.nodes.forEach(n => { n.strength *= 0.995; });
            
            // Prune weak links
            this.memoryState.links = this.memoryState.links.filter(l => l.strength > 0.05);
            
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

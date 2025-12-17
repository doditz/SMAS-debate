
// services/memorySystemService.ts
import { rawCsvData } from '../data/rawCsvData';
import { neuronasDataset } from '../data/neuronasDataset';
import { KnowledgeRecord, L3ContextAnalysis, NeuronasDatasetItem } from '../types';
import loggingService from './loggingService';

export interface MemoryNode {
    id: string;
    label: string;
    type: 'concept' | 'query' | 'persona_insight' | 'synthesis' | 'knowledge_fact' | 'dataset';
    strength: number; // 0 to 1
    lastAccessed: number; // timestamp
    vx?: number; // Velocity X for physics sim (internal)
    vy?: number; // Velocity Y for physics sim (internal)
    data?: KnowledgeRecord | NeuronasDatasetItem; // Associated L3 data or Dataset
    tier?: string; // Memory Tier (L1_R1, L2_R2, L3_R3)
}

export interface MemoryLink {
    source: string;
    target: string;
    strength: number; // 0 to 1
}

export interface MemoryState {
    nodes: MemoryNode[];
    links: MemoryLink[];
}

class MemorySystemService {
    private memoryState: MemoryState = { nodes: [], links: [] };
    private intervalId: number | null = null;
    private maxNodes = 35; // Increased for knowledge integration
    
    // L3 Database - The Immutable Knowledge Base
    private l3Database: KnowledgeRecord[] = [];

    constructor() {
        this.initializeMockMemory();
        this.loadL3Knowledge();
        this.loadNeuronasDatasets();
    }

    private initializeMockMemory() {
        this.memoryState = {
            nodes: [
                { id: 'root', label: 'NEURONAS Core', type: 'concept', strength: 1.0, lastAccessed: Date.now() },
            ],
            links: []
        };
    }

    private loadL3Knowledge() {
        try {
            const lines = rawCsvData.trim().split('\n');
            // Skip header
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (cols.length < 10) continue;

                const category = cols[1];
                let hemisphere: 'Left' | 'Right' | 'Central' = 'Central';

                // Map categories to hemispheres based on NEURONAS V11 architecture
                if (['Quantum Mechanics', 'Mathematical Logic', 'Systems Biology', 'Computational Neuroscience', 'Theoretical Physics', 'Cybernetics'].includes(category)) {
                    hemisphere = 'Left';
                } else if (['Metaphysics', 'Theology', 'Linguistics', 'Complex Systems'].includes(category)) {
                    hemisphere = 'Right';
                } else if (['Ethics', 'Philosophy of Science', 'Artificial Intelligence', 'Cognitive Science', 'Neuroscience'].includes(category)) {
                    hemisphere = 'Central';
                }

                const record: KnowledgeRecord = {
                    id: parseInt(cols[0]),
                    category: category,
                    corePrinciple: cols[2],
                    inferenceMethod: cols[3],
                    dataComplexity: cols[4],
                    experimentalViability: cols[5],
                    deviationLevel: parseFloat(cols[6]),
                    knownConstraints: cols[7],
                    testingApproach: cols[8],
                    potentialImpact: cols[9],
                    hemisphere: hemisphere
                };
                
                this.l3Database.push(record);
            }
            loggingService.info(`L3 Knowledge Base Loaded: ${this.l3Database.length} records.`);
        } catch (e) {
            loggingService.error("Failed to load L3 Knowledge Base", { error: e });
        }
    }

    private loadNeuronasDatasets() {
        try {
            const datasets = neuronasDataset.datasets as NeuronasDatasetItem[];
            const allocation = neuronasDataset.integration_plan.memory_tier_allocation as Record<string, string[]>;
            const timestamp = Date.now();

            const datasetNodes: MemoryNode[] = datasets.map(ds => {
                let tier = 'L1_R1'; // Default
                if (allocation.L2_R2.includes(ds.name)) tier = 'L2_R2';
                else if (allocation.L3_R3.includes(ds.name)) tier = 'L3_R3';
                else if (allocation.L1_R1.includes(ds.name)) tier = 'L1_R1';

                return {
                    id: `ds-${ds.name.toLowerCase().replace(/\s+/g, '-')}`,
                    label: ds.name,
                    type: 'dataset',
                    strength: 0.8,
                    lastAccessed: timestamp,
                    data: ds,
                    tier: tier
                };
            });

            this.updateMemoryGraph(datasetNodes);
            loggingService.info(`Neuronas Datasets Ingested: ${datasetNodes.length} datasets.`);
        } catch (e) {
            loggingService.error("Failed to load Neuronas Datasets", { error: e });
        }
    }

    // Retrieval Mechanism for SMAS
    public retrieveL3Context(query: string): L3ContextAnalysis {
        const queryLower = query.toLowerCase();
        
        // 1. Retrieval: Simple keyword matching
        const relevant = this.l3Database.filter(record => 
            queryLower.includes(record.category.toLowerCase()) || 
            queryLower.includes(record.corePrinciple.toLowerCase())
        ).slice(0, 3); // Top 3

        if (relevant.length > 0) {
            // "Hydrate" L2 memory with these L3 facts
            this.ingestKnowledge(relevant);
        }

        // 2. Analysis: Determine Risk Profile
        let maxDeviation = 0;
        const constraints: string[] = [];

        relevant.forEach(rec => {
            if (rec.deviationLevel > maxDeviation) {
                maxDeviation = rec.deviationLevel;
            }
            if (rec.knownConstraints && rec.knownConstraints !== 'Unclear' && rec.knownConstraints !== 'None') {
                constraints.push(`${rec.category} Constraint: ${rec.knownConstraints}`);
            }
        });

        // 3. Strategy Determination (UPDATED LOGIC)
        let strategy: 'Skepticism' | 'Exploration' | 'Balanced' | 'Restrictive' = 'Balanced';
        
        if (maxDeviation > 0.08) {
            strategy = 'Restrictive'; // Extreme deviation (e.g. > 0.08) implies theoretical instability or high risk. Lock it down.
        } else if (maxDeviation > 0.05) {
            strategy = 'Skepticism'; // High deviation requires Analytical/Left brain scrutiny
        } else if (maxDeviation < 0.03 && relevant.length > 0) {
            strategy = 'Exploration'; // Safe established ground allows for creativity
        }

        // If hard constraints exist, lean towards Skepticism/Restrictive
        if (constraints.length > 0 && strategy === 'Exploration') {
            strategy = 'Balanced';
        }

        return {
            records: relevant,
            maxDeviation,
            criticalConstraints: constraints,
            recommendedStrategy: strategy
        };
    }

    // Add retrieved L3 knowledge to Active L2/L1 Memory
    private ingestKnowledge(records: KnowledgeRecord[]) {
        const timestamp = Date.now();
        const newNodes: MemoryNode[] = records.map(rec => ({
            id: `k-${rec.id}`,
            label: `${rec.category}: ${rec.corePrinciple}`,
            type: 'knowledge_fact',
            strength: 0.9, // Knowledge is strong
            lastAccessed: timestamp,
            data: rec
        }));

        this.updateMemoryGraph(newNodes);
    }

    // Ingest real tokens from the debate analysis
    public ingestConcepts(concepts: string[]) {
        if (!concepts || concepts.length === 0) return;

        const timestamp = Date.now();
        const newNodes: MemoryNode[] = concepts.slice(0, 3).map((concept, i) => ({
            id: `c-${timestamp}-${i}`,
            label: concept,
            type: 'query',
            strength: 1.0,
            lastAccessed: timestamp,
        }));

        this.updateMemoryGraph(newNodes);
    }

    private updateMemoryGraph(newNodes: MemoryNode[]) {
        // Prune old nodes if exceeding max
        if (this.memoryState.nodes.length + newNodes.length > this.maxNodes) {
            this.memoryState.nodes.sort((a, b) => a.lastAccessed - b.lastAccessed);
            // Keep the root
            const root = this.memoryState.nodes.find(n => n.id === 'root');
            const datasets = this.memoryState.nodes.filter(n => n.type === 'dataset'); // Keep datasets
            
            // Nodes to consider for pruning (exclude root and datasets)
            const pruneCandidates = this.memoryState.nodes.filter(n => n.id !== 'root' && n.type !== 'dataset');
            
            // Calculate how many to keep
            const keepCount = Math.max(0, this.maxNodes - newNodes.length - 1 - datasets.length);
            
            this.memoryState.nodes = [
                ...(root ? [root] : []),
                ...datasets,
                ...pruneCandidates.slice(pruneCandidates.length - keepCount)
            ];

            // Clean up dangling links
            const nodeIds = new Set(this.memoryState.nodes.map(n => n.id));
            this.memoryState.links = this.memoryState.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));
        }

        // Add new nodes
        this.memoryState.nodes.push(...newNodes);

        // Link logic
        const centerNode = this.memoryState.nodes.find(n => n.id === 'root') || this.memoryState.nodes[0];
        if (centerNode) {
            newNodes.forEach(node => {
                // Link datasets to core weakly, facts strongly
                let strength = 0.6;
                if (node.type === 'knowledge_fact') strength = 0.9;
                if (node.type === 'dataset') strength = 0.4;

                this.memoryState.links.push({
                    source: centerNode.id,
                    target: node.id,
                    strength: strength
                });
            });
        }
    }

    startPublishing(callback: (state: MemoryState) => void) {
        if (this.intervalId) return;

        this.intervalId = window.setInterval(() => {
            const now = Date.now();

            // Decay strength over time
            this.memoryState.nodes.forEach(node => {
                if (node.id !== 'root' && node.type !== 'dataset') {
                    // Knowledge facts decay slower than concept tokens
                    const decayRate = node.type === 'knowledge_fact' ? 0.99 : 0.98;
                    node.strength *= decayRate;
                }
            });

            // Remove very weak nodes (simulating forgetting), but keep datasets
            this.memoryState.nodes = this.memoryState.nodes.filter(n => n.strength > 0.1 || n.id === 'root' || n.type === 'dataset');
            
            // Filter links again
            const nodeIds = new Set(this.memoryState.nodes.map(n => n.id));
            this.memoryState.links = this.memoryState.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

            callback({...this.memoryState, nodes: [...this.memoryState.nodes], links: [...this.memoryState.links]});
        }, 1000);
    }

    stopPublishing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

const memorySystemService = new MemorySystemService();
export default memorySystemService;
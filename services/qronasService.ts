
// services/qronasService.ts
import { QronasState } from '../types';
import loggingService from './loggingService';

/**
 * QRONAS: Probabilistic Attention Collapse
 * Implements Algorithm 2 from NEURONAS v13.1 Paper
 * 
 * Manages the transition of conceptual states from Superposition (0) 
 * to Collapsed Determinism (+1/-1).
 */
class QronasService {
    private readonly THETA_CONSENSUS = 0.7; // From Paper Section 3.3.3
    private readonly MAX_ROUNDS = 10; // From Table 3 (Full Synthesis)

    /**
     * Algorithm 2: QRONAS Iterative Collapse
     * @param states The list of concepts in superposition
     * @param contextStrength The external forcing function from memory/vector context
     */
    public collapseWavefunction(states: QronasState[], contextStrength: number): QronasState[] {
        let currentStates = JSON.parse(JSON.stringify(states)); // Deep copy
        let hasChanged = true;
        let round = 0;

        loggingService.info("QRONAS: Initiating Wavefunction Collapse", { items: states.length });

        while (hasChanged && round < this.MAX_ROUNDS) {
            hasChanged = false;
            const nextStates = [...currentStates];

            for (let i = 0; i < currentStates.length; i++) {
                const item = currentStates[i];
                
                // Only process items in superposition (spin 0)
                if (item.spin !== 0) continue;

                // Calculate Neighbor Consensus (Eq 12)
                // In this emulation, "Neighbors" are adjacent items in the array + context influence
                const leftNeighbor = currentStates[i - 1]?.spin || 0;
                const rightNeighbor = currentStates[i + 1]?.spin || 0;
                
                // Influence aggregation
                const localField = leftNeighbor + rightNeighbor;
                const externalField = item.collapsePotential * contextStrength; // Bias from D3STIB/Memory
                
                const totalInfluence = localField + (externalField * 2); // External field has higher weight
                
                // Determine collapse
                const consensusScore = Math.abs(totalInfluence) / 2; // Normalize roughly

                if (consensusScore >= this.THETA_CONSENSUS) {
                    const newSpin = Math.sign(totalInfluence) as -1 | 0 | 1;
                    if (newSpin !== 0) {
                        nextStates[i].spin = newSpin;
                        nextStates[i].stability += 0.2; // Collapsed states gain stability
                        hasChanged = true;
                    }
                }
            }
            
            currentStates = nextStates;
            round++;
        }

        // Final cleanup: Force collapse any remaining superposition based on stability
        currentStates = currentStates.map((s: QronasState) => {
            if (s.spin === 0) {
                // If still in superposition, collapse based on stability/potential
                return { ...s, spin: s.collapsePotential > 0.5 ? 1 : -1 };
            }
            return s;
        });

        loggingService.info(`QRONAS: Collapse Complete in ${round} rounds.`);
        return currentStates;
    }

    /**
     * Eq (13): Epistemic Uncertainty Quantification
     * Confidence = (|{i : σ != 0}| / n) * (1/n * Sum(|σ|))
     */
    public calculateConfidence(states: QronasState[]): number {
        if (states.length === 0) return 0;
        
        const collapsedCount = states.filter(s => s.spin !== 0).length;
        const spinMagnitudeSum = states.reduce((sum, s) => sum + Math.abs(s.spin), 0);
        const n = states.length;

        const confidence = (collapsedCount / n) * (1 / n * spinMagnitudeSum);
        
        // Normalize 
        return Math.min(1.0, confidence * 2); // *2 scaling factor for practical UI usage
    }
}

const qronasService = new QronasService();
export default qronasService;

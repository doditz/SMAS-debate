
// components/CognitiveDegradationMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ExclamationTriangleIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { DebateState, ExecutionState } from '../types';

interface CognitiveDegradationMonitorProps {
    debateState: DebateState | null;
    executionMode: ExecutionState;
}

const ProgressBar: React.FC<{ value: number, gradient: string }> = ({ value, gradient }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${gradient}`} style={{ width: `${value}%` }}></div>
    </div>
);

const CognitiveDegradationMonitor: React.FC<CognitiveDegradationMonitorProps> = ({ debateState, executionMode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [metrics, setMetrics] = useState({
        coherence: 100,
        reasoningDrift: 0,
        memoryLeakage: 0
    });

    useEffect(() => {
        // Derive metrics from the actual debate state
        if (debateState) {
            let newCoherence = 100;
            let newDrift = 0;
            
            if (debateState.status === 'superposition' && debateState.qronasSuperposition) {
                // High stability in options = High coherence
                const avgStability = debateState.qronasSuperposition.reduce((acc, s) => acc + s.stability, 0) / debateState.qronasSuperposition.length;
                newCoherence = avgStability * 100;
            } else if (debateState.validation) {
                // High dissent = Lower coherence but higher quality debate
                newCoherence = (1 - debateState.validation.dissentLevel * 0.2) * 100; 
            }

            if (debateState.qronasCollapseTarget && debateState.perspectives) {
                 // Drift increases with number of perspectives
                 newDrift = debateState.perspectives.length * 2.5;
            }
            
            // "Memory Leakage" simulates graph complexity overhead
            const complexity = (debateState.d3stibAnalysis?.tokens.length || 0) * 0.5;

            setMetrics({
                coherence: Math.max(0, Math.min(100, newCoherence)),
                reasoningDrift: Math.min(100, newDrift),
                memoryLeakage: Math.min(100, complexity)
            });
        } else {
            // Reset when idle
            setMetrics({ coherence: 100, reasoningDrift: 0, memoryLeakage: 0 });
        }
    }, [debateState]);

    const overallStatus = metrics.coherence < 80 ? 'Warning' : 'Nominal';
    const statusColor = overallStatus === 'Warning' ? 'text-yellow-400' : 'text-green-400';

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center text-left p-3"
                >
                    <div className="flex items-center space-x-2">
                        <ExclamationTriangleIcon className={`w-5 h-5 ${statusColor}`} />
                        <span className="font-semibold text-indigo-300">Cognitive Stability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold ${statusColor}`}>{overallStatus}</span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 pt-2 border-t border-gray-700/50 space-y-3">
                                <div>
                                    <div className="flex justify-between items-baseline text-sm mb-1">
                                        <span className="text-gray-400">Response Coherence</span>
                                        <span className="font-mono text-gray-200">{metrics.coherence.toFixed(1)}%</span>
                                    </div>
                                    <ProgressBar value={metrics.coherence} gradient="bg-gradient-to-r from-green-400 to-cyan-400" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-baseline text-sm mb-1">
                                        <span className="text-gray-400">Reasoning Drift</span>
                                        <span className="font-mono text-gray-200">{metrics.reasoningDrift.toFixed(1)}%</span>
                                    </div>
                                    <ProgressBar value={metrics.reasoningDrift} gradient="bg-gradient-to-r from-orange-500 to-yellow-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-baseline text-sm mb-1">
                                        <span className="text-gray-400">Graph Overhead</span>
                                        <span className="font-mono text-gray-200">{metrics.memoryLeakage.toFixed(1)}%</span>
                                    </div>
                                    <ProgressBar value={metrics.memoryLeakage} gradient="bg-gradient-to-r from-red-500 to-orange-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ExecutionStatusIndicator>
    );
};

export default CognitiveDegradationMonitor;

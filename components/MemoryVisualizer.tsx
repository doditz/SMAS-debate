
// components/MemoryVisualizer.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainIcon, ChevronDownIcon } from './Icons';
import memorySystemService, { MemoryState, MemoryNode } from '../services/memorySystemService';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { ExecutionState } from '../types';

interface MemoryVisualizerProps {
    executionMode: ExecutionState;
}

const nodeColors: Record<string, string> = {
    concept: 'fill-blue-500',
    query: 'fill-green-500',
    persona_insight: 'fill-purple-500',
    synthesis: 'fill-indigo-400',
    knowledge_fact: 'fill-amber-500',
    dataset: 'fill-cyan-600'
};

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ executionMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [memoryState, setMemoryState] = useState<MemoryState | null>(null);

    useEffect(() => {
        memorySystemService.startPublishing(setMemoryState);
        return () => memorySystemService.stopPublishing();
    }, []);

    const renderContent = () => {
        if (!memoryState || memoryState.nodes.length === 0) {
            return <p className="text-sm text-gray-500">Initializing memory simulation...</p>;
        }

        const width = 400;
        const height = 220;
        const centerX = width / 2;

        return (
             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                {/* Background Regions */}
                <rect x="0" y="0" width={centerX} height={height} fill="rgba(59, 130, 246, 0.05)" />
                <text x="10" y="20" className="text-[8px] fill-blue-400 font-bold opacity-50">LEFT (Analytical L1-L3)</text>
                
                <rect x={centerX} y="0" width={centerX} height={height} fill="rgba(168, 85, 247, 0.05)" />
                <text x={width - 80} y="20" className="text-[8px] fill-purple-400 font-bold opacity-50">RIGHT (Creative R1-R3)</text>

                <AnimatePresence>
                    {memoryState.nodes.map((node, i) => {
                        // Position based on Hemisphere and Tier
                        let baseX = node.hemisphere === 'Left' ? width * 0.25 : width * 0.75;
                        let baseY = 50; // Default L1/R1
                        
                        if (node.tier === 'L2' || node.tier === 'R2') baseY = 110;
                        if (node.tier === 'L3' || node.tier === 'R3') baseY = 170;

                        // Add some jitter for organic look
                        const jitterX = (Math.sin(i + Date.now()/1000) * 20);
                        const jitterY = (Math.cos(i + Date.now()/1000) * 10);

                        return (
                            <motion.g
                                key={node.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, x: baseX + jitterX, y: baseY + jitterY }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <circle
                                    r={Math.max(3, node.strength * 8)}
                                    className={`${nodeColors[node.type] || 'fill-gray-500'} opacity-80`}
                                />
                                <text
                                    y={10}
                                    textAnchor="middle"
                                    className="text-[6px] fill-gray-400 pointer-events-none"
                                >
                                    {node.label.length > 10 ? node.label.substring(0, 8) + '..' : node.label}
                                </text>
                                <text
                                    y={-5}
                                    textAnchor="middle"
                                    className="text-[5px] fill-white font-mono opacity-50"
                                >
                                    {node.tier}
                                </text>
                            </motion.g>
                        );
                    })}
                </AnimatePresence>
            </svg>
        );
    }

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center text-left p-3"
                >
                    <div className="flex items-center space-x-2">
                        <BrainIcon className="w-5 h-5 text-indigo-300" />
                        <span className="font-semibold text-indigo-300">7-Tier Hebbian Memory</span>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 pt-2 border-t border-gray-700/50 h-64 flex items-center justify-center overflow-hidden relative">
                               {renderContent()}
                            </div>
                            <div className="p-2 flex flex-wrap gap-3 text-[10px] text-gray-400 justify-center bg-gray-900/50">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Concept</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Fact (L3)</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-600"></span>Dataset</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ExecutionStatusIndicator>
    );
};

export default MemoryVisualizer;

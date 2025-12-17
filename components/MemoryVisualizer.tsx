
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

const nodeColors: Record<MemoryNode['type'], string> = {
    concept: 'fill-blue-500',
    query: 'fill-green-500',
    persona_insight: 'fill-purple-500',
    synthesis: 'fill-indigo-400',
    knowledge_fact: 'fill-amber-500',
    dataset: 'fill-cyan-600' // New color for datasets
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

        const width = 300;
        const height = 180;

        return (
             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                <AnimatePresence>
                    {memoryState.nodes.map((node, i) => (
                        <motion.g
                            key={node.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <circle
                                cx={(i * 35 + 20) % (width - 20)}
                                cy={Math.floor((i * 35) / (width - 20)) * 40 + 20}
                                r={Math.max(4, node.strength * 12)}
                                className={`${nodeColors[node.type] || 'fill-gray-500'} opacity-70`}
                            />
                            <text
                                x={(i * 35 + 20) % (width - 20)}
                                y={Math.floor((i * 35) / (width - 20)) * 40 + 35}
                                textAnchor="middle"
                                className="text-[7px] fill-gray-300"
                            >
                                {node.label.length > 15 ? node.label.substring(0, 13) + '..' : node.label}
                            </text>
                        </motion.g>
                    ))}
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
                        <span className="font-semibold text-indigo-300">Cognitive Memory (L1 & L3)</span>
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
                            <div className="p-2 flex flex-wrap gap-3 text-[10px] text-gray-400 justify-center">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Concept</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Knowledge</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-600"></span>Dataset</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Query</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ExecutionStatusIndicator>
    );
};

export default MemoryVisualizer;

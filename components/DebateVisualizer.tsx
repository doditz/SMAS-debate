
// components/DebateVisualizer.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebateState, PersonaPerspective, QronasState } from '../types';
import { ChartBarIcon, TrashIcon } from './Icons';

const hemisphereColors: { [key: string]: string } = {
    'Left': 'bg-blue-500/20 border-blue-400 text-blue-200',
    'Right': 'bg-purple-500/20 border-purple-400 text-purple-200',
    'Central': 'bg-green-500/20 border-green-400 text-green-200',
};

interface DebateVisualizerProps {
    debateState: DebateState | null;
    onClear?: () => void;
}

// Deterministic pseudo-random for consistent layout
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    return (Math.abs(hash) % 1000) / 1000;
};

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between items-center text-xs text-gray-400 mb-0.5">
            <span>{label}</span>
            <span>{(value * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-900/50 rounded-full h-1">
            <motion.div
                className={`h-1 rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
        </div>
    </div>
);

const SpinBadge: React.FC<{ spin: number }> = ({ spin }) => {
    const config = spin === 1 
        ? { text: '+1 (AFF)', bg: 'bg-green-500/20', border: 'border-green-500', textCol: 'text-green-300' }
        : spin === -1 
            ? { text: '-1 (NEG)', bg: 'bg-red-500/20', border: 'border-red-500', textCol: 'text-red-300' }
            : { text: '0 (SUPER)', bg: 'bg-yellow-500/20', border: 'border-yellow-500', textCol: 'text-yellow-300' };

    return (
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${config.bg} ${config.border} ${config.textCol}`}>
            SPIN: {config.text}
        </span>
    );
};

const SuperpositionVisualizer: React.FC<{ superposition: QronasState[]; collapseTarget: QronasState | null; }> = ({ superposition, collapseTarget }) => {
    const isCollapsed = !!collapseTarget;
    // Safety check for array existence to prevent map errors
    const safeSuperposition = superposition || [];

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.div
                        key="analyzing-label"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="px-3 py-1.5 bg-gray-700/50 rounded-full text-center text-sm font-semibold mb-6 border border-gray-600"
                    >
                        QRONAS Engine: Evaluating Strategy Vectors...
                    </motion.div>
                )}
                {isCollapsed && (
                    <motion.div
                        key="collapsed-label"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                         className="px-3 py-1.5 bg-indigo-600/20 rounded-full text-center text-sm font-semibold mb-6 border border-indigo-500 text-indigo-200"
                    >
                        Wavefunction Collapsed: Strategy Selected
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center items-stretch gap-4 w-full h-full overflow-x-auto pb-2">
                <AnimatePresence>
                    {safeSuperposition.map((state, i) => {
                        const isSelected = collapseTarget?.id === state.id;
                        // If collapsed, hide non-selected items
                        if (isCollapsed && !isSelected) return null;

                        return (
                            <motion.div
                                key={state.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: isSelected ? 1.1 : 1, 
                                    y: 0,
                                    flex: isSelected ? 0.6 : 1 // Grow selected item
                                }}
                                exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                                transition={{ duration: 0.5, type: 'spring' }}
                                className="relative min-w-[150px] max-w-[250px]"
                            >
                                <motion.div
                                    className={`h-full p-4 border-2 rounded-xl flex flex-col justify-between backdrop-blur-sm transition-colors
                                        ${isSelected 
                                            ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                                            : 'bg-gray-800/40 border-gray-600 hover:border-gray-500'}
                                    `}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{state.id}</span>
                                            {isSelected ? 
                                                <span className="text-[10px] bg-indigo-500 text-white px-1.5 rounded-sm">ACTIVE</span> :
                                                state.spin !== undefined && <SpinBadge spin={state.spin} />
                                            }
                                        </div>
                                        <p className={`text-sm font-medium leading-snug ${isSelected ? 'text-white' : 'text-gray-300'}`}>{state.thesis}</p>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <MetricBar label="Stability" value={state.stability} color="bg-cyan-400" />
                                        <MetricBar label="Collapse Potential" value={state.collapsePotential} color="bg-amber-400" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

const BrainDebate: React.FC<{ perspectives: PersonaPerspective[], dissentLevel?: number }> = ({ perspectives, dissentLevel = 0.5 }) => {
    // STEP 3: DYNAMIC TOPOLOGY
    // Nodes position is now influenced by 'dissentLevel' (semantic distance)
    
    const nodes = useMemo(() => {
        // Safety check to prevent map errors
        if (!perspectives || perspectives.length === 0) return [];

        const left = perspectives.filter(p => p.hemisphere === 'Left');
        const right = perspectives.filter(p => p.hemisphere === 'Right');
        const central = perspectives.filter(p => p.hemisphere === 'Central');

        // Higher dissent = Greater spread (repulsion)
        // Lower dissent = Tighter cluster (consensus)
        const spreadMultiplier = 0.5 + (dissentLevel * 1.0); // 0.5 to 1.5
        
        const generatePos = (index: number, total: number, baseX: number, seedStr: string) => {
            // Deterministic Y distribution
            const yStep = 140 / (total + 1);
            const y = 20 + yStep * (index + 1) + (seededRandom(seedStr + 'y') * 20 - 10);
            
            // Deterministic X jitter + Dissent Spread
            // Left moves further Left, Right moves further Right if dissent is high
            const drift = (baseX === 200) ? 0 : (baseX < 200 ? -40 : 40) * (dissentLevel - 0.5);
            const x = baseX + drift + (seededRandom(seedStr + 'x') * 40 - 20);
            
            return { x, y };
        };

        return [
            ...left.map((p, i) => ({ ...p, ...generatePos(i, left.length, 100, p.persona) })),
            ...central.map((p, i) => ({ ...p, ...generatePos(i, central.length, 200, p.persona) })),
            ...right.map((p, i) => ({ ...p, ...generatePos(i, right.length, 300, p.persona) })),
        ];
    }, [perspectives, dissentLevel]);

    const connections = useMemo(() => {
        const centralNodes = nodes.filter(n => n.hemisphere === 'Central');
        const otherNodes = nodes.filter(n => n.hemisphere !== 'Central');
        const links: { x1: number, y1: number, x2: number, y2: number, id: string }[] = [];
        
        centralNodes.forEach(c => {
            otherNodes.forEach(o => {
                links.push({
                    id: `${c.hash}-${o.hash}`,
                    x1: c.x, y1: c.y,
                    x2: o.x, y2: o.y
                });
            });
        });
        return links;
    }, [nodes]);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full absolute opacity-20 pointer-events-none">
                {/* Background Brain Shape */}
                <path d="M 100,20 A 80 80 0 0 0 100,180 C 180 180 200 100 200 100 C 200 100 180 20 100 20 Z" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 300,20 A 80 80 0 0 1 300,180 C 220 180 200 100 200 100 C 200 100 220 20 300 20 Z" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
                <rect x="180" y="70" width="40" height="60" fill="none" stroke="#22c55e" strokeWidth="1" rx="10" strokeDasharray="4 4" />
                
                {/* Synaptic Connections */}
                <AnimatePresence>
                    {connections.map(link => (
                        <motion.line
                            key={link.id}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            x1={link.x1} y1={link.y1}
                            x2={link.x2} y2={link.y2}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                        />
                    ))}
                </AnimatePresence>
            </svg>

            <div className="relative w-full max-w-lg h-full">
                {nodes.map((node) => (
                    <motion.div
                        key={node.hash}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, left: node.x * (100/400) + '%', top: node.y * (100/200) + '%' }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    >
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${node.hemisphere === 'Left' ? 'text-blue-400 bg-blue-400' : node.hemisphere === 'Right' ? 'text-purple-400 bg-purple-400' : 'text-green-400 bg-green-400'}`} />
                        <div className={`mt-2 px-2 py-1 rounded text-[10px] font-semibold border backdrop-blur-md shadow-sm max-w-[120px] text-center ${hemisphereColors[node.hemisphere]}`}>
                            {node.persona}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export const DebateVisualizer: React.FC<DebateVisualizerProps> = ({ debateState, onClear }) => {
    const [view, setView] = useState<'qtree' | 'brain'>('qtree');

    useEffect(() => {
        if (debateState?.status === 'superposition' || debateState?.status === 'collapsed') {
            setView('qtree');
        } else if (['debating', 'synthesis', 'governance_check', 'complete'].includes(debateState?.status || '')) {
            const timer = setTimeout(() => setView('brain'), 800); // Longer delay to let collapse animation finish
            return () => clearTimeout(timer);
        } else if (!debateState) {
            setView('qtree');
        }
    }, [debateState?.status]);

    if (!debateState) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden h-80 flex flex-col"
        >
             <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-900/30">
                <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-md ${view === 'qtree' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        <ChartBarIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-200">
                            {view === 'qtree' ? 'QRONAS Superposition' : 'SMAS Neural Debate'}
                        </h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{debateState.status}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {onClear && debateState.status === 'complete' && (
                         <button onClick={onClear} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Clear Visualization">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
                 <AnimatePresence mode="wait">
                    {view === 'qtree' ? (
                        <motion.div key="qtree" exit={{ opacity: 0 }} className="h-full">
                             <SuperpositionVisualizer 
                                superposition={debateState.qronasSuperposition || []}
                                collapseTarget={debateState.qronasCollapseTarget || null}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="brain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                            <BrainDebate 
                                perspectives={debateState.perspectives || []} 
                                dissentLevel={debateState.validation?.dissentLevel}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default DebateVisualizer;

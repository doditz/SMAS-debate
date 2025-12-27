
// components/D3stibVisualizer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { D3stibToken, ComplexityMetrics, SmasConfig, DebateState, ExecutionState, VectorAnalysis } from '../types';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { FunnelIcon, BoltIcon, ScaleIcon, SignalIcon, AdjustmentsHorizontalIcon, BrainIcon, ArrowTrendingUpIcon } from './Icons';

interface D3stibVisualizerProps {
    analysis: { tokens: D3stibToken[] } | null;
    vectorAnalysis?: VectorAnalysis;
    metrics?: ComplexityMetrics;
    userConfig?: SmasConfig;
    effectiveConfig?: SmasConfig;
    activeHyperparameters?: DebateState['activeHyperparameters'];
    executionMode: ExecutionState;
}

const priorityConfig = {
    'FULL': { classes: 'bg-green-500/20 text-green-200 border-green-500/50', label: 'High Salience' },
    'PARTIAL': { classes: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50', label: 'Contextual' },
    'SKIP': { classes: 'bg-gray-700/30 text-gray-500 border-gray-700', label: 'Filtered' },
};

const MetricBadge: React.FC<{ label: string, value: number | string, type?: 'score' | 'info' | 'jerk' }> = ({ label, value, type = 'score' }) => {
    let colorClass = 'text-gray-200';
    if (type === 'score' && typeof value === 'number') {
        if (value > 0.7) colorClass = 'text-red-400';
        else if (value > 0.4) colorClass = 'text-yellow-400';
        else colorClass = 'text-green-400';
    } else if (type === 'jerk' && typeof value === 'number') {
        if (value > 0.18) colorClass = 'text-red-400 animate-pulse'; // Threshold per paper
        else if (value > 0.10) colorClass = 'text-yellow-400';
        else colorClass = 'text-gray-400';
    }

    return (
        <div className="flex flex-col items-center bg-gray-900/50 px-2 py-1 rounded border border-gray-700/50 min-w-[70px]">
             <span className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</span>
             <span className={`font-mono text-xs font-bold ${colorClass}`}>{typeof value === 'number' ? value.toFixed(3) : value}</span>
        </div>
    );
}

const JerkGraph: React.FC<{ tokens: D3stibToken[] }> = ({ tokens }) => {
    return (
        <div className="mt-2 h-16 flex items-end space-x-[1px] bg-gray-900/30 rounded p-1 border border-gray-800">
            {tokens.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                    <div 
                        className={`w-full transition-all ${Math.abs(t.s) > 0.18 ? 'bg-red-500' : 'bg-indigo-500/50'}`} 
                        style={{ height: `${Math.min(100, Math.abs(t.s) * 300)}%` }} 
                    />
                    <div className="absolute bottom-full left-0 hidden group-hover:block z-10 bg-black text-white text-[9px] p-1 rounded whitespace-nowrap">
                        {t.token}: S'''={t.s.toFixed(3)}
                    </div>
                </div>
            ))}
        </div>
    );
}

const OptimizationStatus: React.FC<{ userConfig?: SmasConfig, effectiveConfig?: SmasConfig, isFastTrack?: boolean }> = ({ userConfig, effectiveConfig, isFastTrack }) => {
    if (!userConfig || !effectiveConfig) return null;

    const roundDiff = effectiveConfig.debateRounds - userConfig.debateRounds;
    let statusMode = "STANDARD";
    let statusClass = "bg-gray-700/50 border-gray-600 text-gray-300";
    let statusIcon = <ScaleIcon className="w-3 h-3" />;

    if (isFastTrack) {
        statusMode = "FAST TRACK (BYPASS)";
        statusClass = "bg-teal-500/20 border-teal-500/50 text-teal-200 shadow-[0_0_10px_rgba(45,212,191,0.3)]";
        statusIcon = <BoltIcon className="w-3 h-3 animate-pulse" />;
    } else if (roundDiff > 0) {
        statusMode = "DEEP DIVE";
        statusClass = "bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
        statusIcon = <BoltIcon className="w-3 h-3 animate-pulse" />;
    }

    return (
        <div className={`flex items-center space-x-2 px-2 py-1 rounded text-[10px] font-bold border ${statusClass}`}>
            {statusIcon}
            <span>PROTOCOL: {statusMode}</span>
            {!isFastTrack && roundDiff !== 0 && (
                 <span className="opacity-75 font-mono ml-1">
                    ({roundDiff > 0 ? '+' : ''}{roundDiff} Rounds)
                </span>
            )}
        </div>
    );
};

export const D3stibVisualizer: React.FC<D3stibVisualizerProps> = ({ analysis, vectorAnalysis, metrics, userConfig, effectiveConfig, activeHyperparameters, executionMode }) => {
    return (
        <AnimatePresence>
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden"
                >
                    <ExecutionStatusIndicator status={executionMode}>
                        <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50">
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FunnelIcon className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-200">D³STIB Semantic Filter</h3>
                                            <p className="text-[10px] text-gray-500">v13.1 Kernel: S''' (Jerk) Analysis</p>
                                        </div>
                                    </div>
                                    <OptimizationStatus 
                                        userConfig={userConfig} 
                                        effectiveConfig={effectiveConfig} 
                                        isFastTrack={vectorAnalysis?.isFastTrackEligible}
                                    />
                                </div>

                                {metrics && (
                                    <div className="flex flex-col gap-2 pb-2 border-b border-gray-700/50">
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="flex flex-wrap gap-2"
                                        >
                                            <MetricBadge label="Lexical" value={metrics.lexicalDensity} />
                                            <MetricBadge label="S''' Jerk" value={vectorAnalysis?.semanticJerk || metrics.s_triple_prime} type="jerk" />
                                            <MetricBadge label="Volatility" value={metrics.d3stibVolatility} />
                                            <MetricBadge label="Hybrid" value={metrics.hybridScore} />
                                        </motion.div>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Semantic Jerk Topology (Equation 9)</p>
                                    <JerkGraph tokens={analysis.tokens} />
                                </div>

                                <div className="flex flex-wrap gap-2 leading-relaxed p-2 bg-gray-900/40 rounded-lg inner-shadow">
                                    {analysis.tokens.map((token, index) => (
                                        <motion.div
                                            key={`${index}-${token.token}`}
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }} 
                                            className={`px-2 py-1 text-xs rounded border ${priorityConfig[token.priority].classes} flex items-center space-x-1`}
                                            title={`S''' = ${token.s.toFixed(3)}`}
                                        >
                                            <span>{token.token}</span>
                                            {token.priority === 'FULL' && <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"/>}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ExecutionStatusIndicator>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

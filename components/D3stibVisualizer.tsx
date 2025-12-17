
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
        if (value > 0.2) colorClass = 'text-red-400 animate-pulse'; // Threshold for Jerk alert
        else if (value > 0.1) colorClass = 'text-yellow-400';
        else colorClass = 'text-gray-400';
    }

    return (
        <div className="flex flex-col items-center bg-gray-900/50 px-2 py-1 rounded border border-gray-700/50 min-w-[70px]">
             <span className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</span>
             <span className={`font-mono text-xs font-bold ${colorClass}`}>{typeof value === 'number' ? value.toFixed(3) : value}</span>
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

const HyperparameterDashboard: React.FC<{ params: DebateState['activeHyperparameters'] }> = ({ params }) => {
    if (!params) return null;

    const modeColors = {
        'Precision': 'text-cyan-300 bg-cyan-900/30 border-cyan-700',
        'Balanced': 'text-gray-300 bg-gray-800 border-gray-600',
        'Creative': 'text-purple-300 bg-purple-900/30 border-purple-700',
        'Hyper-Plastic': 'text-pink-300 bg-pink-900/30 border-pink-700 animate-pulse'
    };

    return (
        <div className="mt-3 p-2 rounded-lg bg-gray-900/40 border border-gray-700/50 flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-gray-400">Dynamic Tuning:</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${modeColors[params.mode]} font-mono uppercase tracking-wider`}>
                {params.mode}
            </span>
            <div className="flex gap-4 text-xs font-mono text-gray-300">
                <span>Temp: <span className="text-white font-bold">{params.temperature.toFixed(2)}</span></span>
                <span>TopK: <span className="text-white font-bold">{params.topK}</span></span>
                <span>TopP: <span className="text-white font-bold">{params.topP}</span></span>
            </div>
        </div>
    );
};

const VectorProximityBar: React.FC<{ label: string, score: number, isActive: boolean }> = ({ label, score, isActive }) => {
    return (
        <div className={`flex flex-col gap-1 flex-1 min-w-[60px] p-2 rounded ${isActive ? 'bg-indigo-500/20 border border-indigo-500/50' : 'bg-gray-900/30 border border-gray-800'}`}>
            <div className="flex justify-between items-center">
                <span className={`text-[9px] uppercase font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{label.split('_')[1]}</span>
                <span className="text-[9px] font-mono text-gray-400">{score.toFixed(2)}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.max(5, score * 100)}%` }} 
                    className={`h-full ${isActive ? 'bg-indigo-400' : 'bg-gray-600'}`}
                />
            </div>
        </div>
    );
}

// New Visualizer for Semantic Trajectory (Drift/Jerk)
const TrajectoryVisualizer: React.FC<{ analysis: VectorAnalysis }> = ({ analysis }) => {
    if (!analysis.trajectory) return null;
    
    // Simulate graphical drift based on scalar value
    const driftPercent = Math.min(100, analysis.trajectory.drift * 200); 
    const jerkPercent = Math.min(100, analysis.semanticJerk * 300);

    return (
        <div className="flex items-center gap-4 mt-2 p-2 bg-gray-900/30 rounded border border-gray-700/30">
            <div className="flex-1">
                <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>Semantic Drift (Trajectory)</span>
                    <span className="font-mono">{analysis.trajectory.drift.toFixed(3)}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${driftPercent}%` }} />
                </div>
            </div>
            <div className="flex-1">
                <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>Semantic Jerk (Instability)</span>
                    <span className={`font-mono ${analysis.semanticJerk > 0.2 ? 'text-red-400' : 'text-gray-300'}`}>{analysis.semanticJerk.toFixed(3)}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${analysis.semanticJerk > 0.2 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${jerkPercent}%` }} />
                </div>
            </div>
        </div>
    )
}

const EntropyForecast: React.FC<{ score: number }> = ({ score }) => {
    const width = `${score * 100}%`;
    const color = score > 0.7 ? 'bg-red-500' : score > 0.4 ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
        <div className="flex items-center space-x-2 text-xs mt-1">
            <SignalIcon className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400 w-20">Est. Entropy:</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width }} 
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

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
                                            <p className="text-[10px] text-gray-500">Vector Proximity & S''' Analysis</p>
                                        </div>
                                    </div>
                                    <OptimizationStatus 
                                        userConfig={userConfig} 
                                        effectiveConfig={effectiveConfig} 
                                        isFastTrack={vectorAnalysis?.isFastTrackEligible}
                                    />
                                </div>

                                {vectorAnalysis && (
                                    <div className="pb-3 border-b border-gray-700/50">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <BrainIcon className="w-4 h-4 text-pink-400" />
                                            <span className="text-xs font-bold text-gray-300">Semantic Vector Alignment</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <VectorProximityBar label="L1_SIMPLE" score={vectorAnalysis.similarityMap.L1} isActive={vectorAnalysis.nearestAnchor === 'L1_SIMPLE'} />
                                            <VectorProximityBar label="L2_ANALYTICAL" score={vectorAnalysis.similarityMap.L2} isActive={vectorAnalysis.nearestAnchor === 'L2_ANALYTICAL'} />
                                            <VectorProximityBar label="R2_CREATIVE" score={vectorAnalysis.similarityMap.R2} isActive={vectorAnalysis.nearestAnchor === 'R2_CREATIVE'} />
                                            <VectorProximityBar label="L3_COMPLEX" score={vectorAnalysis.similarityMap.L3} isActive={vectorAnalysis.nearestAnchor === 'L3_COMPLEX'} />
                                        </div>
                                        <TrajectoryVisualizer analysis={vectorAnalysis} />
                                    </div>
                                )}

                                {metrics && (
                                    <div className="flex flex-col gap-2 pb-2 border-b border-gray-700/50">
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="flex flex-wrap gap-2"
                                        >
                                            <MetricBadge label="Lexical" value={metrics.lexicalDensity} />
                                            <MetricBadge label="S''' Jerk" value={vectorAnalysis?.semanticJerk || metrics.s_triple_prime} type="jerk" />
                                            <MetricBadge label="Volatility" value={metrics.d3stibVolatility} />
                                            <MetricBadge label="Hybrid Score" value={metrics.hybridScore} />
                                            <MetricBadge label="Class" value={metrics.classification || 'N/A'} type="info" />
                                        </motion.div>
                                        <EntropyForecast score={metrics.hybridScore} />
                                        {activeHyperparameters && <HyperparameterDashboard params={activeHyperparameters} />}
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 leading-relaxed p-2 bg-gray-900/40 rounded-lg inner-shadow">
                                    {analysis.tokens.map((token, index) => (
                                        <motion.div
                                            key={`${index}-${token.token}`}
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }} 
                                            className={`px-2 py-1 text-xs rounded border ${priorityConfig[token.priority].classes} flex items-center space-x-1`}
                                            title={`Priority: ${priorityConfig[token.priority].label}`}
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

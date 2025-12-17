
// components/SynergyMonitor.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ValueAnalysis, ExecutionState } from '../types';
// FIX: Add missing icon import
import { ArrowTrendingUpIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';

interface SynergyMonitorProps {
    analysis: ValueAnalysis | null;
    executionMode: ExecutionState;
}

const MetricCard: React.FC<{ label: string, value: string, color: string, subtext: string }> = ({ label, value, color, subtext }) => (
    <div className="text-center bg-gray-900/50 p-3 rounded-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500">{subtext}</p>
    </div>
);

export const SynergyMonitor: React.FC<SynergyMonitorProps> = ({ analysis, executionMode }) => {
    return (
        <AnimatePresence>
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <ExecutionStatusIndicator status={executionMode}>
                        <div className="bg-gray-800/50 rounded-lg p-3">
                             <div className="flex items-center space-x-2 mb-3">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-300" />
                                <h3 className="font-semibold text-indigo-300">Synergy & Value-Add Analysis</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <MetricCard 
                                    label="Time Overhead"
                                    value={`${analysis.timeDelta > 0 ? '+' : ''}${(analysis.timeDelta / 1000).toFixed(2)}s`}
                                    color={analysis.timeDelta > 0 ? 'text-red-400' : 'text-green-400'}
                                    subtext={`${analysis.timeDeltaPercent.toFixed(1)}%`}
                                />
                                <MetricCard 
                                    label="Quality Lift"
                                    value={`${analysis.scoreDelta > 0 ? '+' : ''}${analysis.scoreDelta.toFixed(3)}`}
                                    color={analysis.scoreDelta > 0 ? 'text-green-400' : 'text-red-400'}
                                    subtext={`${analysis.scoreDeltaPercent.toFixed(1)}%`}
                                />
                                <MetricCard 
                                    label="Synergistic Value (ΔV)"
                                    value={analysis.deltaV.toFixed(3)}
                                    color={analysis.deltaV > 0 ? 'text-green-400' : 'text-red-400'}
                                    subtext="score/sec"
                                />
                            </div>
                             <div className={`mt-3 text-center text-sm font-semibold p-2 rounded-md 
                                ${analysis.verdict === 'High Value-Add' ? 'bg-green-500/10 text-green-300' 
                                : analysis.verdict === 'Marginal Gains' ? 'bg-yellow-500/10 text-yellow-300' 
                                : 'bg-red-500/10 text-red-300'}`}>
                                Verdict: {analysis.verdict}
                            </div>
                        </div>
                    </ExecutionStatusIndicator>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

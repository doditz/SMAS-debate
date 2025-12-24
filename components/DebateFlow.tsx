
// components/DebateFlow.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DebateState, DebateAnalysis, ExecutionState } from '../types';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { FunnelIcon, ScaleIcon, BoltIcon } from './Icons';

interface DebateFlowProps {
    debateState: DebateState | null;
    executionMode: ExecutionState;
}

const hemisphereColors: { [key: string]: string } = {
    'Left': 'border-l-blue-400',
    'Right': 'border-l-purple-400',
    'Central': 'border-l-green-400',
};

const DebateInsights: React.FC<{ analysis: DebateAnalysis }> = ({ analysis }) => {
    return (
        <div className="bg-gray-900/40 rounded-lg p-3 mb-4 border border-gray-700/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <BoltIcon className="w-3 h-3 mr-1 text-yellow-400" />
                Post-Mortem Analysis
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                        <span className="text-[10px] text-indigo-400 font-semibold block">MOST INFLUENTIAL</span>
                        <span className="text-sm font-bold text-white">{analysis.most_influential || 'Synthesis Node'}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-red-400 font-semibold block">KEY CONTENTIONS</span>
                        <ul className="list-disc list-inside text-xs text-gray-300 mt-1 space-y-0.5">
                            {(analysis.contention_points || []).map((pt, i) => (
                                <li key={i}>{pt}</li>
                            ))}
                            {(!analysis.contention_points || analysis.contention_points.length === 0) && <li>No significant contentions detected.</li>}
                        </ul>
                    </div>
                </div>

                <div className="space-y-3 border-l border-gray-700/50 pl-3">
                    <div>
                        <span className="text-[10px] text-green-400 font-semibold block flex items-center">
                            <ScaleIcon className="w-3 h-3 mr-1" />
                            CORE ARGUMENTS (THESIS)
                        </span>
                        <ul className="text-xs text-gray-300 mt-1 space-y-1">
                            {(analysis.key_arguments || []).map((arg, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-1.5">•</span>
                                    <span>{arg}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <span className="text-[10px] text-orange-400 font-semibold block flex items-center">
                            <FunnelIcon className="w-3 h-3 mr-1" />
                            COUNTER-POINTS (ANTITHESIS)
                        </span>
                        <ul className="text-xs text-gray-300 mt-1 space-y-1">
                            {(analysis.counter_arguments || []).map((arg, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-orange-500 mr-1.5">•</span>
                                    <span>{arg}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DebateFlow: React.FC<DebateFlowProps> = ({ debateState, executionMode }) => {
    const transcript = debateState?.debateTranscript || [];
    const analysis = debateState?.debateAnalysis;

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex-shrink-0">Debate Transcript</h3>
                
                {analysis && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <DebateInsights analysis={analysis} />
                    </motion.div>
                )}

                {transcript.length > 0 ? (
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {transcript.map((entry, index) => {
                            const personaName = entry.persona || entry.speaker || 'Unknown';
                            const personaInfo = debateState?.perspectives?.find(p => p.persona === personaName);
                            const colorClass = personaInfo ? hemisphereColors[personaInfo.hemisphere] : 'border-l-gray-500';

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`pl-3 border-l-4 ${colorClass}`}
                                >
                                    <p className="font-semibold text-sm text-gray-200">{personaName}</p>
                                    <p className="text-sm text-gray-400">{entry.text}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Awaiting debate transcript...</p>
                    </div>
                )}
            </div>
        </ExecutionStatusIndicator>
    );
};

export default DebateFlow;

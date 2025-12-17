
// components/ArchitectureOptimizationLab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { analysisFindings } from '../data/analysisFindings';
import { BookOpenIcon, BoltIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { ExecutionState } from '../types';

export const ArchitectureOptimizationLab: React.FC<{ executionMode: ExecutionState }> = ({ executionMode }) => {
    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <BoltIcon className="w-6 h-6 text-indigo-300" />
                        <div>
                            <h2 className="text-lg font-semibold text-indigo-300">Architecture Optimization Lab</h2>
                            <p className="text-xs text-gray-500">Analyzing Latent Capability Enhancement (Baseline vs. Enhanced)</p>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                             <BookOpenIcon className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-200">{analysisFindings.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400">{analysisFindings.summary}</p>
                    </div>

                    <div className="space-y-4">
                        {analysisFindings.keyFindings.map((finding, index) => (
                             <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="p-4 bg-gray-900/30 rounded-lg"
                            >
                                <h4 className="font-semibold text-gray-200 mb-1">{finding.title}</h4>
                                <p className="text-sm text-gray-400 mb-2">{finding.content}</p>
                                <div className="p-2 bg-indigo-900/40 rounded border border-indigo-700/50">
                                    <p className="text-sm font-semibold text-indigo-300">
                                        Recommendation: <span className="font-normal text-indigo-200">{finding.recommendation}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                         className="p-4 bg-blue-900/30 rounded border border-blue-700/50"
                    >
                        <h4 className="text-lg font-semibold text-blue-300">Next Steps & Future Work</h4>
                        <p className="text-sm text-blue-200 mt-2">{analysisFindings.nextSteps}</p>
                    </motion.div>

                </motion.div>
            </div>
        </ExecutionStatusIndicator>
    );
};

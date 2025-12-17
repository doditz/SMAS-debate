
// components/EthicalGovernanceMonitor.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ScaleIcon, ExclamationTriangleIcon, HandThumbUpIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { GovernanceResult, ExecutionState } from '../types';

interface EthicalGovernanceMonitorProps {
    governance?: GovernanceResult;
    executionMode: ExecutionState;
}

export const EthicalGovernanceMonitor: React.FC<EthicalGovernanceMonitorProps> = ({ governance, executionMode }) => {
    const [isOpen, setIsOpen] = useState(true);

    const hasData = !!governance;
    const isPassed = governance?.passed ?? false;
    const statusColor = !hasData ? 'text-gray-500' : isPassed ? 'text-green-400' : 'text-red-400';
    const statusText = !hasData ? 'Standby' : isPassed ? 'Passed' : 'Violated';

    return (
        <ExecutionStatusIndicator status={hasData ? executionMode : "SIMULATED"}>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/30">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center text-left p-3"
                >
                    <div className="flex items-center space-x-2">
                        <ScaleIcon className="w-5 h-5 text-indigo-300" />
                        <span className="font-semibold text-indigo-300">Ethical Governance</span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold ${statusColor}`}>
                           {statusText}
                        </span>
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
                                {!hasData ? (
                                    <p className="text-xs text-gray-500 text-center py-2">Waiting for synthesis...</p>
                                ) : (
                                    <>
                                        <div className="text-center p-2 rounded-md bg-gray-900/50">
                                            <p className="text-sm font-semibold text-gray-200">Compliance Score</p>
                                            <p className={`text-lg font-bold ${statusColor}`}>
                                                {(governance.score * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                         <div className="space-y-2 text-xs font-mono">
                                            {governance.proofs.map((proof, idx) => (
                                                <div key={idx} className="flex flex-col bg-gray-900/30 p-2 rounded border border-gray-700/30">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-gray-300 font-semibold">{proof.constraint}</span>
                                                        {proof.status === 'PASSED' ? (
                                                            <HandThumbUpIcon className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                                                        )}
                                                    </div>
                                                    <p className={`italic ${proof.status === 'PASSED' ? 'text-gray-500' : 'text-red-300'}`}>
                                                        {proof.reasoning}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ExecutionStatusIndicator>
    );
};

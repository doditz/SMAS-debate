// components/CostConfirmationModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './Icons';
import { CostEstimate, BudgetStatus } from '../types';

interface CostConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDeny: () => void;
    estimate: CostEstimate | null;
    budgetStatus: BudgetStatus;
}

const CostRow: React.FC<{ label: string, value: string | number, isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center text-sm py-2 border-b border-gray-700/50 last:border-b-0 ${isTotal ? 'font-bold' : ''}`}>
        <span className={isTotal ? 'text-gray-200' : 'text-gray-400'}>{label}</span>
        <span className={`font-mono ${isTotal ? 'text-yellow-300' : 'text-gray-200'}`}>{value}</span>
    </div>
);

export const CostConfirmationModal: React.FC<CostConfirmationModalProps> = ({ isOpen, onConfirm, onDeny, estimate, budgetStatus }) => {
    if (!estimate) return null;

    const newRemaining = budgetStatus.remaining - estimate.total_cost;
    const canAfford = newRemaining >= 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-lg font-bold text-yellow-300">External API Confirmation</h2>
                            <button onClick={onDeny} className="text-gray-400 hover:text-white">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>
                        <main className="p-6">
                            <p className="text-gray-300 mb-4">This query is complex and requires an external, paid API for best results. Please review the cost estimate below.</p>
                            
                            <div className="bg-gray-900/50 rounded-md p-4 space-y-1">
                                <CostRow label="API Provider" value={estimate.provider.toUpperCase()} />
                                <CostRow label="Model" value={estimate.model} />
                                <CostRow label="Input Tokens" value={`~${estimate.input_tokens}`} />
                                <CostRow label="Output Tokens" value={`~${estimate.output_tokens}`} />
                                <CostRow label="Total Cost (USD)" value={`$${estimate.total_cost.toFixed(6)}`} isTotal />
                            </div>

                            <div className="mt-4 p-4 rounded-md bg-gray-900/50">
                                <h3 className="text-sm font-semibold text-center text-gray-400 mb-2">Budget Impact</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Remaining Now</p>
                                        <p className="text-lg font-bold text-green-400">${budgetStatus.remaining.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Remaining After</p>
                                        <p className={`text-lg font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>${newRemaining.toFixed(2)}</p>
                                    </div>
                                </div>
                                {!canAfford && <p className="text-xs text-red-400 text-center mt-3">This query exceeds your remaining budget.</p>}
                            </div>

                        </main>
                        <footer className="flex justify-end p-4 bg-gray-900/50 rounded-b-lg space-x-3">
                            <button
                                onClick={onDeny}
                                className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-gray-600 text-white hover:bg-gray-500"
                            >
                                Use Local (Free)
                            </button>
                             <button
                                onClick={onConfirm}
                                disabled={!canAfford}
                                className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {canAfford ? 'Approve & Proceed' : 'Insufficient Budget'}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

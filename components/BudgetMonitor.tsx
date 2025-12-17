// components/BudgetMonitor.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Add missing icon import
import { ChevronDownIcon, CurrencyDollarIcon } from './Icons';
import { BudgetStatus } from '../types';

interface BudgetMonitorProps {
    budgetStatus: BudgetStatus;
    disabled: boolean;
}

export const BudgetMonitor: React.FC<BudgetMonitorProps> = ({ budgetStatus, disabled }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">Budget & Cost Monitor</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-2 border-t border-gray-700/50 space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Spent: ${budgetStatus.used.toFixed(2)}</span>
                                    <span>Remaining: ${budgetStatus.remaining.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-teal-400 to-indigo-500 h-2.5 rounded-full" style={{ width: `${budgetStatus.percentage_used}%` }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-500 mt-1">Total Budget: ${budgetStatus.total.toFixed(2)}</p>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                External API calls will require confirmation.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// components/BenchmarkRunner.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, BoltIcon, PlayIcon } from './Icons';
import type { DevelopmentTest } from '../types';

// Renamed props interface
interface DevelopmentTestRunnerProps {
    tests: DevelopmentTest[];
    onSelect: (test: DevelopmentTest) => void;
    onRunAll: () => void;
    disabled: boolean;
}

// Renamed component
export const DevelopmentTestRunner: React.FC<DevelopmentTestRunnerProps> = ({ tests, onSelect, onRunAll, disabled }) => {
    const [isOpen, setIsOpen] = useState(true);

    // FIX: Add explicit type annotation to fix 'replace' does not exist on type 'unknown' error.
    const categories: string[] = Array.from(new Set(tests.map(q => q.question_type)));

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50' : ''}`}>
             <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <BoltIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">Development Tests</span>
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
                        <div className="p-3 pt-0 border-t border-gray-700/50">
                            <div className="max-h-48 overflow-y-auto pr-2 mt-2 space-y-3">
                                {categories.map(category => (
                                    <div key={category}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">{category.replace(/_/g, ' ')}</h4>
                                        <ul className="space-y-1">
                                            {tests.filter(q => q.question_type === category).map(t => (
                                                <li key={t.question_id}>
                                                    <button 
                                                        onClick={() => onSelect(t)}
                                                        disabled={disabled}
                                                        className="w-full flex items-center justify-between text-left text-sm p-1.5 rounded-md hover:bg-gray-700/50"
                                                    >
                                                        <span className="text-gray-300 truncate" title={t.question_text}>
                                                            <span className="font-mono text-xs text-indigo-400 mr-2">{t.question_id}</span>
                                                            {t.question_text}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                <button
                                    onClick={onRunAll}
                                    disabled={disabled}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600"
                                >
                                    <PlayIcon className="w-4 h-4" />
                                    <span>Run Full Test Suite</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

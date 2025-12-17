// components/QueryHistory.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, HistoryIcon, TrashIcon } from './Icons';
// FIX: The containing types.ts file was implemented, making this import valid.
import { QueryHistoryItem } from '../types';

interface QueryHistoryProps {
    history: QueryHistoryItem[];
    onSelect: (item: QueryHistoryItem) => void;
    onClear: () => void;
    disabled: boolean;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({ history, onSelect, onClear, disabled }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button onClick={() => !disabled && setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-3" disabled={disabled}>
                <div className="flex items-center space-x-2">
                    <HistoryIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">Session History</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-0">
                            {history.length > 0 ? (
                                <>
                                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {history.map((item, index) => (
                                            <motion.li 
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <button 
                                                    onClick={() => onSelect(item)}
                                                    className="w-full text-left text-sm text-gray-300 truncate hover:text-white bg-gray-700/50 p-2 rounded-md"
                                                    title={item.query}
                                                >
                                                    {item.query}
                                                </button>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <div className="mt-3 text-right">
                                        <button 
                                            onClick={onClear}
                                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                                            disabled={disabled}
                                        >
                                            <TrashIcon className="w-3 h-3"/>
                                            <span>Clear History</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-center text-gray-500 py-4">No history yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
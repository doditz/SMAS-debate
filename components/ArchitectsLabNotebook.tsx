// components/ArchitectsLabNotebook.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, BookOpenIcon } from './Icons';
import { analysisFindings } from '../data/analysisFindings';

export const ArchitectsLabNotebook: React.FC<{ disabled: boolean }> = ({ disabled }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <BookOpenIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">{analysisFindings.title}</span>
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
                        <div className="p-3 pt-2 border-t border-gray-700/50 space-y-4">
                            <p className="text-xs text-gray-500">{analysisFindings.summary}</p>
                            {analysisFindings.keyFindings.map((finding, index) => (
                                <div key={index} className="p-2 bg-gray-900/50 rounded">
                                    <h4 className="text-sm font-semibold text-gray-200">{finding.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{finding.content}</p>
                                    <p className="text-xs font-semibold text-indigo-300 mt-2">Recommendation: <span className="font-normal text-gray-300">{finding.recommendation}</span></p>
                                </div>
                            ))}
                            <div className="p-2 bg-blue-900/30 rounded border border-blue-700/50">
                                <h4 className="text-sm font-semibold text-blue-300">Next Steps</h4>
                                <p className="text-xs text-blue-200 mt-1">{analysisFindings.nextSteps}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// components/FactCheckDisplay.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, MagnifyingGlassIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import { ExecutionState } from '../types';

interface Source {
    web?: {
        uri: string;
        title: string;
    }
}

interface FactCheckDisplayProps {
    sources: Source[];
    executionMode: ExecutionState;
}

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);


export const FactCheckDisplay: React.FC<FactCheckDisplayProps> = ({ sources, executionMode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const validSources = sources?.filter(s => s.web?.uri && s.web.title) || [];

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-3">
                    <div className="flex items-center space-x-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-indigo-300" />
                        <span className="font-semibold text-indigo-300">Fact-Checking Sources</span>
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
                            <div className="p-3 pt-0 border-t border-gray-700/50">
                                <div className="text-xs text-gray-400 pt-3 pb-2">
                                    Responses are grounded by Google Search. The following sources were consulted.
                                </div>
                                {validSources.length > 0 ? (
                                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {validSources.map((source, index) => (
                                            <motion.li
                                                key={source.web!.uri + index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <a
                                                    href={source.web!.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-700/50 transition-colors group"
                                                >
                                                    <LinkIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0 group-hover:text-indigo-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-300 group-hover:text-indigo-300 leading-tight">
                                                            {source.web!.title}
                                                        </p>
                                                    </div>
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p className="text-sm">No web sources for this query.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ExecutionStatusIndicator>
    );
};

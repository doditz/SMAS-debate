// components/WhitepaperModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './Icons';
import { whitepaperContent } from '../WhitepaperContent';
import { ExecutionState, Transparency } from '../types';

interface WhitepaperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExecutionTag: React.FC<{type: ExecutionState}> = ({ type }) => {
    const config = {
        'EXECUTED': { classes: 'bg-green-500/20 text-green-300 border-green-500/30' },
        'EMULATED': { classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        'SIMULATED': { classes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${config[type].classes}`}>{type}</span>;
}

const TransparencySection: React.FC<{ content: Transparency }> = ({ content }) => (
    <div className="space-y-6">
        <p className="text-gray-400">{content.introduction}</p>
        {content.definitions.map(def => (
            <div key={def.state} className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
                <h4 className="font-semibold text-lg text-gray-200 mb-2 flex items-center gap-3">
                    <ExecutionTag type={def.state} />
                    <span>{def.title}</span>
                </h4>
                <div className="pl-4 border-l-2 border-gray-700">
                    <p className="text-gray-400 mb-2 italic"><strong>Analogy:</strong> {def.analogy}</p>
                    <p className="text-gray-300"><strong>Implementation:</strong> {def.implementation}</p>
                </div>
            </div>
        ))}
    </div>
);


const renderContent = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
        return <p className="text-gray-400 mb-4">{content}</p>;
    }
     if (content.definitions) { // Custom renderer for Transparency
        return <TransparencySection content={content} />;
    }
    if (Array.isArray(content)) {
        return (
            <div className="space-y-4">
                {content.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-900/30 rounded-md">
                        <h5 className="font-semibold text-gray-200">
                           {item.title || item.name || `Principle ${index + 1}`}
                        </h5>
                        <p className="text-sm text-gray-400 mt-1">{item.content || item.description || (item.contributions && item.contributions.join(', '))}</p>
                         {item.points && (
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-400">
                                {item.points.map((point: any, pIndex: number) => (
                                    <li key={pIndex}>
                                        <span className="font-semibold text-gray-300">{point.key || point.subtitle || `Point ${pIndex + 1}`}: </span>
                                        {point.value || (point.points && <ul>{point.points.map((sub: string, sIndex: number) => <li key={sIndex} className="ml-4 list-item">{sub}</li>)}</ul>)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        );
    }
    if (typeof content === 'object' && content !== null) {
        return (
            <div className="space-y-6">
                {Object.entries(content).map(([key, value]) => (
                     <div key={key}>
                        <h4 className="font-semibold text-lg text-indigo-300 capitalize mb-2">{key.replace(/_/g, ' ')}</h4>
                        {renderContent(value)}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState(whitepaperContent.sections[0].id);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                             <div>
                                <h2 className="text-xl font-bold text-indigo-400">{whitepaperContent.title}</h2>
                                <p className="text-xs text-gray-500">A high-fidelity emulation of a novel cognitive architecture.</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>
                         <div className="flex-shrink-0 border-b border-gray-700">
                            <nav className="flex space-x-4 px-6">
                                {whitepaperContent.sections.map(section => (
                                    <button 
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={`py-3 px-1 text-sm font-medium transition-colors
                                            ${activeTab === section.id 
                                                ? 'border-b-2 border-indigo-400 text-indigo-300' 
                                                : 'border-b-2 border-transparent text-gray-400 hover:text-white'}`
                                        }
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <main className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
                           {whitepaperContent.sections.map(section => (
                                activeTab === section.id && (
                                    <motion.section 
                                        key={section.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {renderContent(section.content)}
                                    </motion.section>
                                )
                           ))}
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// components/TheVisionModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, BookOpenIcon, ScaleIcon, BoltIcon, EyeIcon } from './Icons';
import { manualContent } from '../data/manualContent';
import { ethicalFramework } from '../EthicalFramework';
import { projectPhilosophy } from '../ProjectPhilosophy';
import { backendArchitecture } from '../BackendArchitecture';

interface TheVisionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            active ? 'border-indigo-500 text-indigo-400 bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
        }`}
    >
        {icon}
        <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
    </button>
);

const ManualView: React.FC = () => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-2">{manualContent.title}</h2>
                <p className="text-lg text-indigo-300">{manualContent.subtitle}</p>
                <div className="flex justify-center gap-4 mt-4 text-xs font-mono text-gray-500">
                    <span>{manualContent.meta.version}</span>
                    <span>•</span>
                    <span>{manualContent.meta.date}</span>
                    <span>•</span>
                    <span>{manualContent.meta.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {manualContent.chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-800/40 rounded-lg p-6 border border-gray-700/30 hover:border-indigo-500/30 transition-colors">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 pb-2 border-b border-gray-700/50">
                            {chapter.title}
                        </h3>
                        <div className="space-y-6">
                            {chapter.content.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="text-md font-semibold text-indigo-300 mb-2">{section.subtitle}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                                        {section.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const VisionMottoView: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20 text-center">
                <ScaleIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">THE NEURONAS MOTTO</h2>
                <blockquote className="text-xl italic text-gray-300 font-serif leading-loose">
                    {ethicalFramework.motto}
                </blockquote>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BoltIcon className="w-5 h-5 text-yellow-400" />
                        Core Philosophy
                    </h3>
                    <div className="space-y-4">
                        {projectPhilosophy.principles.slice(0, 4).map((p, i) => (
                            <div key={i} className="p-3 bg-gray-900/30 rounded">
                                <h4 className="font-semibold text-indigo-300 text-sm mb-1">{p.title}</h4>
                                <p className="text-xs text-gray-400">{p.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <EyeIcon className="w-5 h-5 text-green-400" />
                        The Manifesto
                    </h3>
                    <div className="p-4 bg-gray-900/30 rounded mb-4">
                        <h4 className="font-bold text-gray-200 text-sm mb-2">{ethicalFramework.manifesto.title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{ethicalFramework.manifesto.body}</p>
                    </div>
                    <div className="space-y-2">
                        {ethicalFramework.coreValues.map((val, i) => (
                            <div key={i} className="flex justify-between items-start text-xs border-b border-gray-700/50 pb-2 last:border-0">
                                <span className="font-semibold text-gray-300 w-1/3">{val.name}</span>
                                <span className="text-gray-500 w-2/3">{val.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressiveDocsView: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-2">{backendArchitecture.title}</h2>
                <p className="text-sm text-gray-400">{backendArchitecture.introduction}</p>
            </div>

            <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-8 pl-8 py-2">
                {backendArchitecture.components.map((comp, idx) => (
                    <div key={idx} className="relative">
                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-gray-900 border-2 border-indigo-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-indigo-400">{idx + 1}</span>
                        </div>
                        <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/30 hover:bg-gray-800/60 transition-colors">
                            <h3 className="text-md font-bold text-indigo-300 mb-1">{comp.name}</h3>
                            <p className="text-sm text-gray-400">{comp.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 mt-6">
                <h3 className="text-sm font-bold text-indigo-200 mb-2">Operational Flow</h3>
                <p className="text-xs font-mono text-indigo-300/80">{backendArchitecture.flow}</p>
            </div>
        </div>
    );
};

export const TheVisionModal: React.FC<TheVisionModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'manual' | 'vision' | 'docs'>('manual');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <EyeIcon className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">THE VISION</h2>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">Progressive Documentation & Identity</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex border-b border-gray-700 bg-gray-900 shrink-0 px-6">
                            <TabButton 
                                active={activeTab === 'manual'} 
                                onClick={() => setActiveTab('manual')} 
                                icon={<BookOpenIcon className="w-4 h-4" />} 
                                label="The Manual (V13)" 
                            />
                            <TabButton 
                                active={activeTab === 'vision'} 
                                onClick={() => setActiveTab('vision')} 
                                icon={<ScaleIcon className="w-4 h-4" />} 
                                label="Vision & Motto" 
                            />
                            <TabButton 
                                active={activeTab === 'docs'} 
                                onClick={() => setActiveTab('docs')} 
                                icon={<BoltIcon className="w-4 h-4" />} 
                                label="Progressive Docs" 
                            />
                        </div>

                        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-gray-900 to-gray-800">
                            <AnimatePresence mode="wait">
                                {activeTab === 'manual' && (
                                    <motion.div key="manual" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <ManualView />
                                    </motion.div>
                                )}
                                {activeTab === 'vision' && (
                                    <motion.div key="vision" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <VisionMottoView />
                                    </motion.div>
                                )}
                                {activeTab === 'docs' && (
                                    <motion.div key="docs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <ProgressiveDocsView />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

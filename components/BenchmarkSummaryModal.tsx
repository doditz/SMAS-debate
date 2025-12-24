
// components/BenchmarkSummaryModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronDownIcon, HandThumbUpIcon, HandThumbDownIcon, BookOpenIcon, MagnifyingGlassIcon, ChartBarIcon, ArrowTrendingUpIcon, BoltIcon } from './Icons';
import { BatchResult, EvaluationResult } from '../types';

interface TestRunSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: BatchResult[];
}

const GlobalAnalytics: React.FC<{ results: BatchResult[] }> = ({ results }) => {
    const stats = useMemo(() => {
        if (results.length === 0) return null;
        const validResults = results.filter(r => r.evaluation);
        const avgSmas = validResults.reduce((acc, r) => acc + (r.evaluation?.smas.overall_score || 0), 0) / validResults.length;
        const avgLlm = validResults.reduce((acc, r) => acc + (r.evaluation?.llm.overall_score || 0), 0) / validResults.length;
        const totalBoost = ((avgSmas - avgLlm) / (avgLlm || 1)) * 100;
        const avgDeltaV = validResults.reduce((acc, r) => acc + (r.valueAnalysis?.deltaV || 0), 0) / validResults.length;

        return { avgSmas, avgLlm, totalBoost, avgDeltaV, count: results.length };
    }, [results]);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-xl text-center">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Avg Neuronas Score</p>
                <p className="text-3xl font-black text-white font-mono">{stats.avgSmas.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Baseline LLM</p>
                <p className="text-3xl font-black text-gray-400 font-mono">{stats.avgLlm.toFixed(2)}</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 p-4 rounded-xl text-center relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 opacity-10"><ArrowTrendingUpIcon className="w-16 h-16" /></div>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">Capability Boost</p>
                <p className="text-3xl font-black text-green-400 font-mono">+{stats.totalBoost.toFixed(1)}%</p>
            </div>
            <div className="bg-amber-600/10 border border-amber-500/30 p-4 rounded-xl text-center">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">Synergy Value (ΔV)</p>
                <p className="text-3xl font-black text-amber-400 font-mono">{stats.avgDeltaV.toFixed(3)}</p>
            </div>
        </div>
    );
};

const CriteriaComparisonPanel: React.FC<{ result: BatchResult }> = ({ result }) => {
    if (!result.evaluation?.smas?.criteria || !result.evaluation?.llm?.criteria) return null;
    const smasCriteria = result.evaluation.smas.criteria;
    const llmCriteria = result.evaluation.llm.criteria;
    const criteriaKeys = Object.keys(smasCriteria) as (keyof typeof smasCriteria)[];

    return (
        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-3 h-3 text-indigo-400" />
                Vectored Comparison
            </h4>
            <div className="space-y-4">
                {criteriaKeys.map(key => {
                    const sVal = smasCriteria[key] || 0;
                    const lVal = llmCriteria[key] || 0;
                    const isWinning = sVal > lVal;
                    return (
                        <div key={String(key)} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span className="text-gray-500">{String(key).replace(/_/g, ' ')}</span>
                                <span className={isWinning ? 'text-indigo-400' : 'text-gray-400'}>
                                    {isWinning ? `+${(sVal - lVal).toFixed(2)} Delta` : 'No Gain'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-0 bg-gray-600 h-full opacity-50" style={{ width: `${lVal * 100}%` }} />
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sVal * 100}%` }}
                                        className="absolute inset-y-0 left-0 bg-indigo-500 h-full" 
                                    />
                                </div>
                                <span className="text-xs font-mono w-8 text-right text-gray-300">{sVal.toFixed(1)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ResultRow: React.FC<{ result: BatchResult; isExpanded: boolean; onToggle: () => void }> = ({ result, isExpanded, onToggle }) => {
    const isSuccess = !!result.evaluation && !!result.evaluation.smas && !!result.evaluation.llm;
    const boost = isSuccess ? (((result.evaluation!.smas.overall_score - result.evaluation!.llm.overall_score) / (result.evaluation!.llm.overall_score || 1)) * 100) : 0;
    
    return (
        <div className={`rounded-xl border transition-all ${isExpanded ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-gray-700/50 hover:border-gray-600'}`}>
            <button onClick={onToggle} className={`w-full p-4 grid grid-cols-12 gap-4 text-sm text-left items-center rounded-xl ${isExpanded ? 'bg-indigo-900/10' : 'bg-gray-800/40'}`}>
                <div className="col-span-1">
                    <span className={`font-mono text-xs ${isSuccess ? 'text-indigo-400' : 'text-red-400'}`}>{result.test.question_id}</span>
                </div>
                <div className="col-span-5">
                    <p className="text-gray-200 font-medium truncate" title={result.test.question_text}>{result.test.question_text}</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-gray-900 rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
                         <span className="relative z-10 font-mono font-bold text-indigo-300">
                            {isSuccess ? result.evaluation?.smas?.overall_score?.toFixed(1) : '-'}
                        </span>
                        <div className="absolute inset-y-0 left-0 bg-indigo-500/20" style={{ width: `${(result.evaluation?.smas?.overall_score || 0) * 10}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-600 font-bold">vs</span>
                    <div className="flex-1 h-6 bg-gray-900 rounded border border-gray-700 flex items-center justify-center relative overflow-hidden">
                         <span className="relative z-10 font-mono font-bold text-gray-500">
                            {isSuccess ? result.evaluation?.llm?.overall_score?.toFixed(1) : '-'}
                        </span>
                        <div className="absolute inset-y-0 left-0 bg-gray-500/10" style={{ width: `${(result.evaluation?.llm?.overall_score || 0) * 10}%` }} />
                    </div>
                </div>
                <div className="col-span-3 text-right">
                    {isSuccess ? (
                        <div className="flex flex-col items-end">
                            <span className={`font-black text-xs ${boost > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                                {boost > 0 ? `+${boost.toFixed(1)}% LIFT` : 'NO LIFT'}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">{(result.performance?.smas.executionTime! / 1000).toFixed(2)}s runtime</span>
                        </div>
                    ) : <span className="text-red-500 font-bold">FAILED</span>}
                </div>
                <div className="col-span-1 flex justify-end">
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`} />
                </div>
            </button>
            
            <AnimatePresence>
                {isExpanded && isSuccess && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-6 border-t border-gray-700/50 bg-gray-900/20 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CriteriaComparisonPanel result={result} />
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-indigo-600/5 border border-indigo-500/20">
                                        <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Enhanced Reasoning Log</h5>
                                        <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">"{result.evaluation?.smas.feedback}"</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Baseline Feedback</h5>
                                        <p className="text-xs text-gray-400 leading-relaxed">{result.evaluation?.llm.feedback}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
                                <div>
                                    <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <BookOpenIcon className="w-3 h-3" /> Debate Synthesis
                                    </h5>
                                    <div className="space-y-2 max-h-40 overflow-y-auto text-[11px] font-mono">
                                        {result.fullState?.debateTranscript?.map((t, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="text-indigo-400 shrink-0">[{t.persona.substring(0,4)}]</span>
                                                <span className="text-gray-400">{t.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <MagnifyingGlassIcon className="w-3 h-3" /> External Grounding
                                    </h5>
                                    <div className="space-y-1">
                                        {result.fullState?.factCheckSources?.map((s, i) => (
                                            <a key={i} href={s.web?.uri} target="_blank" className="block text-[11px] text-indigo-300 hover:underline truncate">
                                                • {s.web?.title}
                                            </a>
                                        )) || <span className="text-xs text-gray-600 italic">No web grounding used for this case.</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const TestRunSummaryModal: React.FC<TestRunSummaryModalProps> = ({ isOpen, onClose, results }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-md" onClick={onClose}>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <header className="flex justify-between items-center p-6 border-b border-gray-800 shrink-0 bg-gray-900/80 backdrop-blur">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                                    <BoltIcon className="w-6 h-6 text-indigo-400" />
                                    NEURONAS BENCHMARK ENGINE
                                </h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">V13.0 Forensic Evaluation Suite</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                        </header>
                        
                        <main className="flex-1 overflow-y-auto p-8">
                            <GlobalAnalytics results={results} />
                            
                            <div className="mb-4 flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                                <span>Comparative Test Matrix</span>
                                <span>Results: {results.length}</span>
                            </div>
                            
                            <div className="space-y-3">
                                {results.length > 0 ? (
                                    results.map((result) => (
                                        <ResultRow 
                                            key={result.test.question_id} 
                                            result={result}
                                            isExpanded={expandedRow === result.test.question_id}
                                            onToggle={() => setExpandedRow(expandedRow === result.test.question_id ? null : result.test.question_id)}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                                        <p className="font-mono text-sm">Initializing multi-agent benchmark sequence...</p>
                                    </div>
                                )}
                            </div>
                        </main>
                        
                        <footer className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
                            <div className="text-[10px] text-gray-500 font-mono">
                                ARCH: SMAS V13.0 | KERNEL: D3STIB | STATUS: ACTIVE_TRACE
                            </div>
                            <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all">
                                Close Report
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

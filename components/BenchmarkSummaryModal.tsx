
// components/BenchmarkSummaryModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronDownIcon, HandThumbUpIcon, HandThumbDownIcon, BookOpenIcon, MagnifyingGlassIcon } from './Icons';
import { BatchResult, EvaluationResult } from '../types';

// Renamed props interface
interface TestRunSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: BatchResult[];
}

const ValueAnalysisPanel: React.FC<{ result: BatchResult }> = ({ result }) => {
    if (!result.valueAnalysis) return null;
    const { timeDelta, timeDeltaPercent, scoreDelta, scoreDeltaPercent, deltaV, verdict } = result.valueAnalysis;

    const getVerdictColor = () => {
        if (verdict === 'Significant Enhancement') return 'text-green-400 bg-green-500/10';
        if (verdict === 'Moderate Boost') return 'text-yellow-400 bg-yellow-500/10';
        return 'text-red-400 bg-red-500/10';
    }

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-3">Enhancement Efficiency Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <p className="text-xs text-gray-400">Architecture Overhead</p>
                    <p className={`text-lg font-bold ${timeDelta > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {timeDelta > 0 ? '+' : ''}{(timeDelta / 1000).toFixed(2)}s
                    </p>
                    <p className="text-xs text-gray-500">{timeDeltaPercent.toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Latent Capability Boost</p>
                    <p className={`text-lg font-bold ${scoreDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {scoreDelta > 0 ? '+' : ''}{scoreDelta.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-500">{scoreDeltaPercent.toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Value-over-Head (ΔV)</p>
                    <p className={`text-lg font-bold ${deltaV > 0 ? 'text-green-400' : 'text-red-400'}`}>{deltaV.toFixed(3)}</p>
                    <p className="text-xs text-gray-500">boost/sec</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-400">Result</p>
                    <p className={`text-sm font-bold mt-1 px-2 py-1 rounded-md ${getVerdictColor()}`}>{verdict}</p>
                </div>
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
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-3">Comparative Criteria Breakdown</h4>
            <div className="space-y-3">
                {criteriaKeys.map(key => (
                    <div key={String(key)}>
                        <p className="text-sm text-gray-400 capitalize mb-1">{String(key).replace(/_/g, ' ')}</p>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-indigo-300 w-16 text-right">Enhanced</span>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(smasCriteria[key] || 0) * 100}%`}}></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-200 w-8 text-right">{(smasCriteria[key] || 0).toFixed(2)}</span>
                            </div>
                             <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-gray-400 w-16 text-right">Baseline</span>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${(llmCriteria[key] || 0) * 100}%`}}></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-200 w-8 text-right">{(llmCriteria[key] || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DeepDivePanel: React.FC<{ type: 'Enhanced' | 'Baseline', evaluation?: EvaluationResult }> = ({ type, evaluation }) => {
    if (!evaluation) return null;
    const isEnhanced = type === 'Enhanced';
    const color = isEnhanced ? 'text-indigo-300' : 'text-gray-400';
    const bgColor = isEnhanced ? 'bg-indigo-500/10' : 'bg-gray-500/10';
    const borderColor = isEnhanced ? 'border-indigo-500/20' : 'border-gray-500/20';
    
    return (
        <div className={`p-4 rounded-lg border ${borderColor} ${bgColor}`}>
            <h4 className={`font-semibold ${color}`}>{type} Configuration</h4>
            <div className="mt-3">
                <h5 className="text-sm font-semibold text-gray-300 mb-2">Deep Metrics Analysis</h5>
                <div className="text-xs space-y-1 text-gray-400 font-mono">
                    <p>Factual Consistency: <span className="font-bold text-gray-200">{evaluation.deep_metrics.factual_consistency.toFixed(3)}</span></p>
                    <p>Answer Relevancy: <span className="font-bold text-gray-200">{evaluation.deep_metrics.answer_relevancy.toFixed(3)}</span></p>
                    {isEnhanced && evaluation.deep_metrics.perspective_diversity && <p>Perspective Diversity: <span className="font-bold text-gray-200">{evaluation.deep_metrics.perspective_diversity.toFixed(3)}</span></p>}
                </div>
            </div>
             <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-300 mb-2">Judge's Qualitative Feedback</h5>
                <p className="text-xs text-gray-400 border-l-2 border-gray-700 pl-2 italic">{evaluation.feedback}</p>
            </div>
        </div>
    );
};

const DebateTranscriptPanel: React.FC<{ result: BatchResult }> = ({ result }) => {
    if (!result.fullState?.debateTranscript) return null;
    
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg mt-4 border border-gray-700/50">
            <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4 text-indigo-400" />
                SMAS Debate Transcript
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 bg-gray-900/30 p-2 rounded">
                {result.fullState.debateTranscript.map((entry, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                        <span className="font-bold text-indigo-300 w-24 shrink-0 truncate">{entry.persona}:</span>
                        <span className="text-gray-300">{entry.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SourcesPanel: React.FC<{ result: BatchResult }> = ({ result }) => {
    const sources = result.fullState?.factCheckSources;
    if (!sources || sources.length === 0) return null;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg mt-4 border border-gray-700/50">
            <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-green-400" />
                Grounding & Sources
            </h4>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
                {sources.map((src: any, i: number) => (
                    <li key={i} className="text-xs text-gray-400 hover:text-green-300 truncate">
                        <a href={src.web?.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                            <span className="text-green-500 font-mono">[{i+1}]</span>
                            {src.web?.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HumanFeedback: React.FC<{ queryId: string }> = ({ queryId }) => {
    const feedbackKey = `feedback_${queryId}`;
    const [feedback, setFeedback] = useState<'good' | 'bad' | null>(() => localStorage.getItem(feedbackKey) as any);

    const handleFeedback = (vote: 'good' | 'bad') => {
        const newFeedback = feedback === vote ? null : vote;
        setFeedback(newFeedback);
        if (newFeedback) {
            localStorage.setItem(feedbackKey, newFeedback);
        } else {
            localStorage.removeItem(feedbackKey);
        }
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h4 className="text-sm font-semibold text-gray-200 text-center">Validate Evaluation</h4>
            <p className="text-xs text-gray-500 text-center mt-1">Does the calculated boost accurately reflect the quality improvement?</p>
            <div className="flex justify-center space-x-4 mt-3">
                <button onClick={() => handleFeedback('good')} className={`p-2 rounded-full transition-colors ${feedback === 'good' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-green-500/50'}`}>
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
                 <button onClick={() => handleFeedback('bad')} className={`p-2 rounded-full transition-colors ${feedback === 'bad' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-red-500/50'}`}>
                    <HandThumbDownIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}


const ResultRow: React.FC<{ result: BatchResult; isExpanded: boolean; onToggle: () => void }> = ({ result, isExpanded, onToggle }) => {
    // Evaluation exists only if both sub-objects are likely present, but we do safe access below.
    const isSuccess = !!result.evaluation && !!result.evaluation.smas && !!result.evaluation.llm;
    
    return (
        <div className={`rounded-lg ${isSuccess ? 'bg-gray-800' : 'bg-red-900/50'}`}>
            <button onClick={onToggle} className="w-full p-3 grid grid-cols-12 gap-4 text-sm text-left items-center">
                <div className="col-span-1">
                    <span className={`font-bold ${isSuccess ? 'text-indigo-400' : 'text-red-400'}`}>{result.test.question_id}</span>
                </div>
                <div className="col-span-5">
                    <p className="text-gray-300 truncate" title={result.test.question_text}>{result.test.question_text}</p>
                </div>
                <div className="col-span-2 text-center flex items-center justify-center space-x-2">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-indigo-400 uppercase">Enhanced</span>
                         <span className={`font-mono px-2 py-0.5 rounded ${isSuccess ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                            {isSuccess ? result.evaluation?.smas?.overall_score?.toFixed(2) : '-'}
                        </span>
                    </div>
                     <span className="text-gray-600 text-xs">vs</span>
                     <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 uppercase">Baseline</span>
                         <span className={`font-mono px-2 py-0.5 rounded ${isSuccess ? 'bg-gray-500/10 text-gray-300' : 'bg-red-500/10 text-red-300'}`}>
                            {isSuccess ? result.evaluation?.llm?.overall_score?.toFixed(2) : '-'}
                        </span>
                    </div>
                </div>
                <div className="col-span-3 text-center">
                    <span className="font-mono text-indigo-300">{isSuccess && result.performance ? (result.performance.smas.executionTime / 1000).toFixed(2) : 'N/A'}s</span>
                    <span className="text-gray-500 mx-1">vs</span>
                    <span className="font-mono text-gray-300">{isSuccess && result.performance ? (result.performance.llm.executionTime / 1000).toFixed(2) : 'N/A'}s</span>
                </div>
                <div className="col-span-1 flex justify-end">
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <AnimatePresence>
                {isExpanded && isSuccess && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-gray-700/50 space-y-4">
                            <div className="text-xs text-center text-gray-500 mb-4 bg-gray-900/30 p-2 rounded">
                                NEURONAS is not a separate model. It is a validation layer that orchestrates the underlying model (Baseline) to self-correct and unlock latent capabilities (Enhanced).
                            </div>
                            <ValueAnalysisPanel result={result} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                               <CriteriaComparisonPanel result={result} />
                                <div className="space-y-4">
                                   <DeepDivePanel type="Enhanced" evaluation={result.evaluation?.smas} />
                                   <DeepDivePanel type="Baseline" evaluation={result.evaluation?.llm} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DebateTranscriptPanel result={result} />
                                <SourcesPanel result={result} />
                            </div>
                            <HumanFeedback queryId={result.test.question_id} />
                        </div>
                    </motion.div>
                )}
                 {isExpanded && !isSuccess && (
                     <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                        <div className="p-4 border-t border-red-500/20 text-center">
                            <p className="text-red-300 font-semibold">Test Failed</p>
                            <p className="text-xs text-red-400 mt-1 font-mono">{result.error || "Evaluation data missing."}</p>
                        </div>
                    </motion.div>
                 )}
            </AnimatePresence>
        </div>
    );
};

// Renamed component
export const TestRunSummaryModal: React.FC<TestRunSummaryModalProps> = ({ isOpen, onClose, results }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        setExpandedRow(prev => (prev === id ? null : id));
    };
    
    // Reset expanded row when modal is closed or results change
    useEffect(() => {
        if (!isOpen) {
            setExpandedRow(null);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
                    onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}>
                        <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-indigo-400">Validation & Enhancement Report</h2>
                                <p className="text-xs text-gray-500">{results.length} tests executed</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="w-6 h-6" /></button>
                        </header>
                        <main className="flex-1 overflow-y-auto p-6 space-y-2">
                            {results.length > 0 ? (
                                results.map((result) => (
                                    <ResultRow 
                                        key={result.test.question_id} 
                                        result={result}
                                        isExpanded={expandedRow === result.test.question_id}
                                        onToggle={() => toggleRow(result.test.question_id)}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="animate-spin h-8 w-8 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p>Batch run is in progress or no results yet...</p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

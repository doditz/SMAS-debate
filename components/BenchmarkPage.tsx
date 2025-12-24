
// components/BenchmarkPage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BoltIcon, PlayIcon, TrashIcon, ChevronDownIcon, 
    ArrowTrendingUpIcon, ChartBarIcon, CpuChipIcon, 
    CommandLineIcon, ScaleIcon, FunnelIcon
} from './Icons';
import { BatchResult, DevelopmentTest, SmasConfig } from '../types';
import smasService from '../services/smasService';
import { developmentTests } from '../data/benchmarkQueries';

const SmrceBar: React.FC<{ label: string; smas: number; llm: number }> = ({ label, smas, llm }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-black uppercase text-gray-500">
            <span>{label}</span>
            <span className={smas > llm ? 'text-green-400' : 'text-gray-400'}>
                {smas > llm ? `+${((smas - llm) * 100).toFixed(0)}%` : '0%'}
            </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-gray-600/40" style={{ width: `${llm * 100}%` }} />
            <motion.div initial={{ width: 0 }} animate={{ width: `${smas * 100}%` }} className="absolute inset-y-0 left-0 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        </div>
    </div>
);

export const BenchmarkPage: React.FC<{ smasConfig: SmasConfig }> = ({ smasConfig }) => {
    const [results, setResults] = useState<BatchResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [batchSelection, setBatchSelection] = useState<Set<string>>(new Set());

    const runTests = useCallback(async (testList: DevelopmentTest[]) => {
        if (isRunning || testList.length === 0) return;
        setIsRunning(true);
        setProgress({ current: 0, total: testList.length });
        
        for (let i = 0; i < testList.length; i++) {
            const test = testList[i];
            setSelectedId(test.question_id);
            try {
                const res = await smasService.runDevelopmentTest(test, smasConfig);
                setResults(prev => {
                    const filtered = prev.filter(r => r.test.question_id !== test.question_id);
                    return [res, ...filtered];
                });
                setProgress(p => ({ ...p, current: i + 1 }));
            } catch (e) {
                console.error(`Benchmark Fail: ${test.question_id}`, e);
            }
        }
        setIsRunning(false);
    }, [isRunning, smasConfig]);

    const handleRunSelected = () => {
        const tests = developmentTests.filter(t => batchSelection.has(t.question_id));
        runTests(tests);
    };

    const handleRunAll = () => runTests(developmentTests);

    const toggleSelect = (id: string) => {
        const next = new Set(batchSelection);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setBatchSelection(next);
    };

    const toggleAll = () => {
        if (batchSelection.size === developmentTests.length) setBatchSelection(new Set());
        else setBatchSelection(new Set(developmentTests.map(t => t.question_id)));
    };

    const selectedResult = useMemo(() => results.find(r => r.test.question_id === selectedId), [results, selectedId]);

    const stats = useMemo(() => {
        if (results.length === 0) return null;
        const avgB = results.reduce((acc, r) => acc + (r.evaluation?.llm.overall_score || 0), 0) / results.length;
        const avgP = results.reduce((acc, r) => acc + (r.evaluation?.smas.overall_score || 0), 0) / results.length;
        return { lift: ((avgP - avgB) / (avgB || 1)) * 100, count: results.length };
    }, [results]);

    return (
        <div className="flex h-full gap-4 overflow-hidden p-3 bg-black/40">
            <aside className="w-85 flex flex-col gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl">
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <CpuChipIcon className="w-4 h-4" /> BATCH CONTROL NEXUS
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={handleRunSelected} 
                            disabled={isRunning || batchSelection.size === 0} 
                            className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-lg border border-indigo-500 disabled:opacity-30 transition-all active:scale-95"
                        >
                            RUN SELECTED ({batchSelection.size})
                        </button>
                        <button 
                            onClick={handleRunAll} 
                            disabled={isRunning} 
                            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg border border-emerald-500 disabled:opacity-30 transition-all active:scale-95"
                        >
                            RUN ALL (237)
                        </button>
                    </div>
                    <button 
                        onClick={() => { setResults([]); setBatchSelection(new Set()); }} 
                        className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-[9px] font-black rounded-lg border border-gray-700 transition-colors"
                    >
                        PURGE ALL DATA
                    </button>

                    {isRunning && (
                        <div className="mt-5 space-y-2">
                            <div className="flex justify-between text-[9px] font-bold text-indigo-300">
                                <span>SEQUENCING CASE {progress.current} / {progress.total}</span>
                                <span>{((progress.current / progress.total) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-indigo-500 shadow-[0_0_10px_indigo]" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(progress.current/progress.total)*100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Test Matrix (237)</span>
                        </div>
                        <button onClick={toggleAll} className="text-[9px] text-indigo-400 font-black hover:text-indigo-300 transition-colors">
                            {batchSelection.size === developmentTests.length ? 'DESELECT ALL' : 'SELECT ALL'}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {developmentTests.map(test => {
                            const res = results.find(r => r.test.question_id === test.question_id);
                            const isSelect = batchSelection.has(test.question_id);
                            const isCurrent = selectedId === test.question_id;
                            return (
                                <div key={test.question_id} className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all border ${isCurrent ? 'bg-indigo-900/30 border-indigo-500/50' : 'border-transparent hover:bg-white/5'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={isSelect} 
                                        onChange={() => toggleSelect(test.question_id)} 
                                        className="w-3.5 h-3.5 rounded bg-black border-gray-700 accent-indigo-500 shrink-0 cursor-pointer"
                                    />
                                    <button 
                                        onClick={() => setSelectedId(test.question_id)}
                                        className="flex-1 text-left truncate"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-mono text-gray-500 font-bold">{test.question_id}</span>
                                            {res && (
                                                <span className={`text-[9px] font-black ${res.valueAnalysis!.scoreDelta > 0 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                                    +{res.valueAnalysis?.scoreDeltaPercent.toFixed(0)}% Lift
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-300 truncate font-medium">{test.question_text}</p>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
                    {stats && (
                        <header className="p-7 bg-indigo-600/5 border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">AGGREGATE SYSTEM LIFT</p>
                                <p className="text-5xl font-black text-emerald-400 tracking-tighter font-mono">+{stats.lift.toFixed(1)}%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Validations</p>
                                <p className="text-2xl font-bold text-gray-300 font-mono">{stats.count} / 237</p>
                            </div>
                        </header>
                    )}

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {selectedResult ? (
                            <div className="max-w-6xl mx-auto space-y-8">
                                <section className="bg-gray-950/80 p-8 rounded-3xl border border-indigo-500/20 shadow-xl">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <h4 className="text-lg font-black text-indigo-300 uppercase tracking-tighter">Case Forensic Report</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{selectedResult.test.question_id} • {selectedResult.test.domain}</p>
                                        </div>
                                        <div className="flex gap-10">
                                            <div className="text-center">
                                                <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">Neuronas</p>
                                                <p className="text-3xl font-black text-indigo-200">{selectedResult.evaluation?.smas.overall_score.toFixed(1)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Raw Baseline</p>
                                                <p className="text-3xl font-black text-gray-600">{selectedResult.evaluation?.llm.overall_score.toFixed(1)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-8">
                                        {Object.entries(selectedResult.evaluation?.smas.criteria || {}).map(([key, val]) => (
                                            <SmrceBar key={key} label={key} smas={val} llm={selectedResult.evaluation?.llm.criteria?.[key] || 0} />
                                        ))}
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-6 h-[500px]">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-gray-700" /> RAW MODEL OUTPUT (BASELINE)
                                        </span>
                                        <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-gray-800/50 font-mono text-[11px] text-gray-500 overflow-auto leading-relaxed shadow-inner">
                                            {selectedResult.outputs?.baseline || "Capturing raw state..."}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_5px_indigo]" /> NEURONAS V13 ENHANCED SYNTHESIS
                                        </span>
                                        <div className="flex-1 bg-indigo-950/20 p-6 rounded-2xl border border-indigo-500/20 font-mono text-[11px] text-indigo-100 overflow-auto leading-relaxed shadow-inner">
                                            {selectedResult.outputs?.pipeline}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5"><ScaleIcon className="w-24 h-24" /></div>
                                    <h5 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CommandLineIcon className="w-4 h-4" /> FORENSIC JUDGE FEEDBACK
                                    </h5>
                                    <p className="text-sm text-indigo-100/80 leading-relaxed italic border-l-2 border-indigo-500/40 pl-5">"{selectedResult.evaluation?.smas.feedback}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 transition-all">
                                <CommandLineIcon className="w-24 h-24 mb-6 text-indigo-500 animate-pulse" />
                                <p className="text-lg font-black uppercase tracking-[0.5em] text-white">Select Case Matrix Entry</p>
                                <p className="text-[10px] uppercase text-indigo-400 mt-2 font-bold tracking-widest">Awaiting Forensic Benchmark Initiation</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};


// components/DebateTranscriptView.tsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DebateState } from '../types';

interface DebateTranscriptViewProps {
    debateState: DebateState;
}

const hemisphereColors: Record<string, string> = {
    'Left': 'text-cyan-400',
    'Right': 'text-purple-400',
    'Central': 'text-emerald-400',
};

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
    const color = value > 0.9 ? 'bg-emerald-500' : value > 0.7 ? 'bg-cyan-500' : 'bg-amber-500';
    return (
        <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase tracking-tighter">
                <span>Confidence</span>
                <span>{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    className={`h-full ${color} shadow-[0_0_8px_rgba(52,211,153,0.3)]`}
                />
            </div>
        </div>
    );
};

const CitationTag: React.FC<{ title: string; url: string }> = ({ title, url }) => (
    <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all ml-1"
    >
        [{title.substring(0, 12)}]
    </a>
);

export const DebateTranscriptView: React.FC<DebateTranscriptViewProps> = ({ debateState }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const transcript = debateState.debateTranscript || [];
    const isDebating = debateState.status === 'debating';

    // Auto-scroll logic tuned for streaming
    useEffect(() => {
        if (scrollRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
            // Only auto-scroll if near the bottom to avoid fighting user scroll
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
            if (isNearBottom || isDebating) {
                scrollRef.current.scrollTop = scrollHeight;
            }
        }
    }, [transcript, isDebating]); // Changed dependency to the array itself to trigger on deep updates

    return (
        <div className="bg-gray-950 rounded-2xl border border-gray-800 flex flex-col h-[550px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <header className="px-5 py-4 border-b border-gray-800/50 bg-gray-900/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isDebating ? 'bg-indigo-500 animate-pulse shadow-[0_0_10px_indigo]' : 'bg-gray-500'}`} />
                    <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Forensic Cognitive Nexus</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Active Threads</span>
                        <span className="text-[10px] font-mono text-indigo-400">{transcript.length}</span>
                    </div>
                </div>
            </header>

            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
                {/* NOTE: Removed AnimatePresence for individual items to prevent jitter during high-speed stream indexing */}
                {transcript.map((turn, i) => {
                    const personaInfo = debateState.perspectives.find(p => p.persona === turn.speaker || p.persona === turn.persona);
                    const hemisphere = personaInfo?.hemisphere || 'Central';
                    const colorClass = hemisphereColors[hemisphere];
                    const isSpeaking = debateState.activePersona === turn.persona && i === transcript.length - 1 && isDebating;

                    return (
                        <div
                            key={i}
                            className={`relative pl-4 border-l-2 ${isSpeaking ? 'border-indigo-500' : 'border-gray-800'} transition-colors duration-200`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-black text-xs uppercase tracking-tight ${colorClass}`}>{turn.persona || turn.speaker}</span>
                                        {turn.memoryAccess && (
                                            <span className="text-[8px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-400 border border-white/10 uppercase">
                                                Tier: {turn.memoryAccess}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">HEMISPHERE: {hemisphere}</span>
                                </div>
                                <ConfidenceBar value={turn.confidence} />
                            </div>
                            
                            <div className="bg-gray-900/20 p-3 rounded-xl border border-white/5 shadow-inner">
                                <p className="text-[13px] leading-relaxed text-gray-300 font-medium tracking-tight whitespace-pre-wrap">
                                    {turn.text}
                                    {turn.citations?.map((cit, idx) => (
                                        <CitationTag key={idx} title={cit.title} url={cit.url} />
                                    ))}
                                </p>
                            </div>

                            {isSpeaking && (
                                <div className="mt-3 flex gap-1.5 px-1 items-center">
                                    <span className="text-[9px] text-indigo-400 font-mono animate-pulse mr-2">LIVE WRITING...</span>
                                    <div className="w-1 h-1 bg-indigo-500/60 rounded-full animate-bounce" />
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {transcript.length === 0 && isDebating && (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Orchestrating Agents...</span>
                    </div>
                )}
                {transcript.length === 0 && !isDebating && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System Idle</span>
                    </div>
                )}
            </div>

            <footer className="p-4 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center shrink-0">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol: V13_STREAMING_DEBATE</span>
                <span className={`text-[8px] font-mono uppercase ${isDebating ? 'text-green-400 animate-pulse' : 'text-gray-600'}`}>
                    {isDebating ? 'Status: LIVE STREAM ACTIVE' : 'Status: COMPLETE'}
                </span>
            </footer>
        </div>
    );
};


// components/DebugLogViewer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandLineIcon, XIcon, ChevronDownIcon, TrashIcon } from './Icons';
import loggingService from '../services/loggingService';
import { LogEntry, LogLevel } from '../types';

interface DebugLogViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogRow: React.FC<{ entry: LogEntry, onClick: () => void }> = ({ entry, onClick }) => {
    // Fix: Manual formatting for milliseconds as fractionalSecondDigits is not supported in all TS envs
    const d = new Date(entry.timestamp);
    const time = `${d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${d.getMilliseconds().toString().padStart(3, '0')}`;
    
    const color = {
        'INFO': 'text-blue-300',
        'WARN': 'text-yellow-400',
        'ERROR': 'text-red-500 font-bold',
        'DEBUG': 'text-gray-400',
        'TRACE': 'text-gray-500 italic'
    }[entry.level];

    return (
        <div 
            onClick={onClick}
            className="flex items-start gap-2 p-1 hover:bg-white/5 cursor-pointer text-xs font-mono border-b border-white/5"
        >
            <span className="text-gray-500 shrink-0 w-20">{time}</span>
            <span className={`shrink-0 w-12 ${color}`}>{entry.level}</span>
            <span className={`truncate ${entry.level === 'ERROR' ? 'text-red-300' : 'text-gray-300'}`}>
                {entry.message}
            </span>
        </div>
    );
};

export const DebugLogViewer: React.FC<DebugLogViewerProps> = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        const unsubscribe = loggingService.subscribe(setLogs);
        return unsubscribe;
    }, [isOpen]);

    useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs, autoScroll]);

    const handleExport = () => {
        const json = loggingService.exportLogsJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `neuronas-trace-${Date.now()}.json`;
        a.click();
    };

    const handleClear = () => {
        loggingService.clearLogs();
        setSelectedLog(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-0 left-0 right-0 h-[60vh] bg-gray-900 border-t border-gray-700 shadow-2xl z-50 flex flex-col"
                >
                    <header className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <CommandLineIcon className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-bold text-gray-200">System Log & Trace</span>
                            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-700 rounded">{logs.length} events</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={handleClear} className="p-1 text-gray-400 hover:text-red-400" title="Clear Logs">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            <button onClick={handleExport} className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded">
                                Export Trace
                            </button>
                            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                                <ChevronDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 flex overflow-hidden">
                        {/* Log List */}
                        <div className="flex-1 overflow-y-auto p-2 font-mono bg-gray-900" onScroll={() => setAutoScroll(false)}>
                            {logs.map((log) => (
                                <LogRow key={log.id} entry={log} onClick={() => setSelectedLog(log)} />
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                        
                        {/* Detail Inspector */}
                        <AnimatePresence>
                             {selectedLog && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '40%' }}
                                    exit={{ width: 0 }}
                                    className="border-l border-gray-700 bg-gray-800/50 overflow-y-auto p-4"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-sm font-bold text-white">Event Details</h3>
                                        <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-white">
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-4 text-xs font-mono text-gray-300">
                                        <div>
                                            <span className="text-gray-500 block">Message</span>
                                            <span className="text-white">{selectedLog.message}</span>
                                        </div>
                                        {selectedLog.context && (
                                            <div>
                                                <span className="text-gray-500 block mb-1">Context / Payload</span>
                                                <pre className="bg-gray-900 p-2 rounded overflow-x-auto border border-gray-700/50">
                                                    {JSON.stringify(selectedLog.context, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                        {selectedLog.stack && (
                                            <div>
                                                 <span className="text-red-400 block mb-1">Stack Trace</span>
                                                 <pre className="bg-red-900/20 p-2 rounded overflow-x-auto text-red-300">
                                                    {selectedLog.stack}
                                                 </pre>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

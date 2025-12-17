
// components/RealtimeMetricsMonitor.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalIcon, ChevronDownIcon, FunnelIcon, BoltIcon } from './Icons';
import { RealtimeMetrics, ConnectionStatus, ExecutionState } from '../types';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';
import realtimeMetricsService from '../services/realtimeMetricsService';


interface RealtimeMetricsMonitorProps {
    metrics: RealtimeMetrics | null;
    connectionStatus: ConnectionStatus;
    executionMode: ExecutionState;
}

const MetricDisplay: React.FC<{ label: string, value: string | number, unit: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-baseline text-sm">
        <span className="text-gray-400">{label}</span>
        <div>
            <span className="font-semibold font-mono text-gray-200">{value}</span>
            <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
    </div>
);

const ProgressBar: React.FC<{ value: number, gradient: string }> = ({ value, gradient }) => (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${gradient}`} style={{ width: `${value}%` }}></div>
    </div>
);

const CognitiveFluxGauge: React.FC<{ flux: number }> = ({ flux }) => (
    <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-700/50 mt-4">
        <div className="flex items-center space-x-2 mb-2">
            <BoltIcon className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-xs font-bold text-indigo-300">Bio-Math Cognitive Flux F(t)</span>
        </div>
        <div className="flex items-end space-x-1 mb-1">
            <span className="text-2xl font-bold text-white">{flux.toFixed(1)}</span>
            <span className="text-xs text-gray-400 mb-1">flow units</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div 
                className="h-2 rounded-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500" 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, flux)}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
        <p className="text-[10px] text-gray-500 mt-2 font-mono">
            F(t) = a(s) × ∫[VC(s) × A(s)] ds
        </p>
    </div>
);

export const RealtimeMetricsMonitor: React.FC<RealtimeMetricsMonitorProps> = ({ metrics, connectionStatus, executionMode }) => {
    const [isOpen, setIsOpen] = useState(true);

    const statusIndicator = {
        connecting: { text: 'Connecting...', color: 'text-yellow-400' },
        connected: { text: 'Connected', color: 'text-green-400' },
        disconnected: { text: 'Disconnected', color: 'text-red-400' },
        error: { text: 'Backend Offline', color: 'text-red-400' },
    };

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left p-3">
                    <div className="flex items-center space-x-2">
                        <SignalIcon className="w-5 h-5 text-indigo-300" />
                        <span className="font-semibold text-indigo-300">System Monitor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`text-xs ${statusIndicator[connectionStatus].color}`}>
                            {statusIndicator[connectionStatus].text}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
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
                                {connectionStatus === 'connected' && metrics ? (
                                    <>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-400 mb-2">Computational Efficiency</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <MetricDisplay label="Cognitive Load" value={metrics.cognitiveLoad.toFixed(1)} unit="%" />
                                                    <ProgressBar value={metrics.cognitiveLoad} gradient="bg-gradient-to-r from-red-500 to-orange-500" />
                                                </div>
                                                <div>
                                                    <MetricDisplay label="D³STIB Filter Efficiency" value={metrics.filterEfficiency.toFixed(1)} unit="%" />
                                                    <ProgressBar value={metrics.filterEfficiency} gradient="bg-gradient-to-r from-green-400 to-cyan-400" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* NEW: Cognitive Flux Visualization */}
                                        {metrics.cognitiveFlux !== undefined && (
                                            <CognitiveFluxGauge flux={metrics.cognitiveFlux} />
                                        )}

                                        <div>
                                             <h4 className="text-xs font-semibold text-gray-400 mb-2 pt-2 border-t border-gray-700/50">System Resources</h4>
                                             <div className="space-y-3">
                                                <div>
                                                    <MetricDisplay label="CPU Load" value={metrics.cpu_load.toFixed(1)} unit="%" />
                                                    <ProgressBar value={metrics.cpu_load} gradient="bg-gradient-to-r from-cyan-500 to-blue-500" />
                                                </div>
                                                <div>
                                                    <MetricDisplay label="Memory Usage" value={metrics.memory_usage.toFixed(1)} unit="%" />
                                                     <ProgressBar value={metrics.memory_usage} gradient="bg-gradient-to-r from-purple-500 to-pink-500" />
                                                </div>
                                                <MetricDisplay label="Network Latency" value={metrics.network_latency.toFixed(0)} unit="ms" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        {connectionStatus === 'error' ? (
                                            <>
                                                <p className="text-sm">Backend server must be running to receive metrics.</p>
                                                <button
                                                    onClick={() => realtimeMetricsService.reconnect()}
                                                    className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 transition-colors"
                                                >
                                                    Retry Connection
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-sm">Awaiting metrics data...</p>
                                        )}
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

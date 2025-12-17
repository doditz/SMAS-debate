
// components/CognitiveDissentDashboard.tsx
import React from 'react';
import { BronasValidationResult, ExecutionState } from '../types';
import { ScaleIcon } from './Icons';
import { ExecutionStatusIndicator } from './ExecutionStatusIndicator';

interface CognitiveDissentDashboardProps {
    validation: BronasValidationResult | null;
    executionMode: ExecutionState;
}

const Gauge: React.FC<{ value: number, label: string }> = ({ value, label }) => {
    const rotation = value * 180 - 90;
    const color = value > 0.6 ? 'text-green-400' : value > 0.3 ? 'text-yellow-400' : 'text-red-400';
    return (
        <div className="relative flex flex-col items-center">
            <svg className="w-24 h-16" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-700" />
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className={color}
                    style={{
                        strokeDasharray: 125.6,
                        strokeDashoffset: 125.6 * (1 - value),
                        transition: 'stroke-dashoffset 0.5s ease'
                    }}
                />
            </svg>
            <div className="absolute bottom-0 text-center">
                <span className={`text-lg font-bold ${color}`}>{(value * 100).toFixed(0)}%</span>
                <p className="text-xs text-gray-400">{label}</p>
            </div>
        </div>
    );
};

export const CognitiveDissentDashboard: React.FC<CognitiveDissentDashboardProps> = ({ validation, executionMode }) => {
    if (!validation) return null;

    return (
        <ExecutionStatusIndicator status={executionMode}>
            <div className="bg-gray-800/50 rounded-lg p-3">
                 <div className="flex items-center space-x-2 mb-2">
                    <ScaleIcon className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-semibold text-indigo-300">Cognitive Dissent Dashboard</h3>
                </div>
                <div className="flex justify-around items-center">
                    <Gauge value={validation.dissentLevel} label="Dissent Level" />
                    <div className="text-center">
                        <p className="text-xs text-gray-400">Most Influential</p>
                        <p className="text-md font-bold text-indigo-300 mt-1">{validation.mostInfluentialPersona}</p>
                        <p className="text-xs text-gray-500">in Validation</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">High dissent indicates a robust, multi-faceted analysis, reducing the risk of consensus-driven error.</p>
            </div>
        </ExecutionStatusIndicator>
    );
};

// components/ExecutionStatusIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ExecutionState } from '../types';

interface ExecutionStatusIndicatorProps {
    status: ExecutionState;
    children: React.ReactNode;
}

const statusConfig: Record<ExecutionState, {
    label: string;
    classes: string;
    tooltip: string;
}> = {
    'EXECUTED': {
        label: 'EXECUTED',
        classes: 'bg-green-500/20 text-green-300 border-green-500/30',
        tooltip: 'This process is a direct, native computation performed by the application.'
    },
    'EMULATED': {
        label: 'EMULATED',
        classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        tooltip: 'This is a high-fidelity execution of the system\'s core logical principles, using real AI calls.'
    },
    'SIMULATED': {
        label: 'SIMULATED',
        classes: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        tooltip: 'This is a symbolic representation. Data is illustrative and not connected to a real backend.'
    }
};

export const ExecutionStatusIndicator: React.FC<ExecutionStatusIndicatorProps> = ({ status, children }) => {
    const config = statusConfig[status];

    return (
        <div className="group relative">
            <div className={`absolute -top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-md border ${config.classes}`}>
                {config.label}
            </div>
            <div className="absolute bottom-full right-0 mb-2 w-64 p-2 text-xs text-center text-gray-200 bg-gray-900 border border-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                {config.tooltip}
            </div>
            {children}
        </div>
    );
};

// components/TransparencyTag.tsx
import React from 'react';

interface TransparencyTagProps {
    type: 'EXECUTED' | 'SIMULATED';
}

export const TransparencyTag: React.FC<TransparencyTagProps> = ({ type }) => {
    const isExecuted = type === 'EXECUTED';
    const tagClasses = isExecuted
        ? 'bg-green-500/20 text-green-300 border-green-500/30'
        : 'bg-red-500/20 text-red-300 border-red-500/30';

    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${tagClasses}`}>
            {type}
        </span>
    );
};

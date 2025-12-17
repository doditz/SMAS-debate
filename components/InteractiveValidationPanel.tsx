
// components/InteractiveValidationPanel.tsx
import React, { useState } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon, ScaleIcon } from './Icons';
import { motion } from 'framer-motion';

interface InteractiveValidationPanelProps {
    disabled: boolean;
    onFeedback: (feedback: 'positive' | 'negative') => void;
}

export const InteractiveValidationPanel: React.FC<InteractiveValidationPanelProps> = ({ disabled, onFeedback }) => {
    const [selection, setSelection] = useState<'positive' | 'negative' | null>(null);

    const handleFeedback = (feedback: 'positive' | 'negative') => {
        if (disabled) return;
        const newSelection = selection === feedback ? null : feedback;
        setSelection(newSelection);
        if (newSelection) {
            onFeedback(newSelection);
        }
    };

    return (
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/30 ${disabled ? 'opacity-50' : ''}`}
        >
             <div className="flex items-center justify-center space-x-2 mb-2">
                <ScaleIcon className="w-5 h-5 text-indigo-300" />
                <h3 className="font-semibold text-indigo-300">Human Validation Loop</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                {selection 
                    ? "Feedback recorded. This improves future synthesis models." 
                    : "Does the final synthesized answer meet quality standards?"}
            </p>
            <div className="flex justify-center space-x-4 mt-3">
                <button
                    onClick={() => handleFeedback('positive')}
                    disabled={disabled}
                    className={`p-2 rounded-full transition-all duration-200 ${selection === 'positive' ? 'bg-green-600 text-white scale-110 shadow-lg shadow-green-900/50' : 'bg-gray-700 text-gray-400 hover:bg-green-500/50'}`}
                    title="Approve"
                >
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleFeedback('negative')}
                    disabled={disabled}
                    className={`p-2 rounded-full transition-all duration-200 ${selection === 'negative' ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-900/50' : 'bg-gray-700 text-gray-400 hover:bg-red-500/50'}`}
                    title="Disapprove"
                >
                    <HandThumbDownIcon className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

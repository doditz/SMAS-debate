// components/AssessmentControls.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: The containing types.ts file was implemented, making this import valid.
import { Assessment } from '../types';
import { TransparencyTag } from './TransparencyTag';
import { ChevronDownIcon, ScaleIcon } from './Icons';

interface AssessmentControlsProps {
    assessment: Assessment;
    setAssessment: React.Dispatch<React.SetStateAction<Assessment>>;
    disabled: boolean;
}

const Slider: React.FC<{ label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean }> = ({ label, value, onChange, disabled }) => (
    <div>
        <label className="text-sm text-gray-400 flex justify-between">
            <span>{label}</span>
            <span>{value.toFixed(2)}</span>
        </label>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);


export const AssessmentControls: React.FC<AssessmentControlsProps> = ({ assessment, setAssessment, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <ScaleIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">Initial Assessment</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-0 border-t border-gray-700/50">
                            <div className="flex justify-end pt-2 pb-1">
                                <TransparencyTag type="EXECUTED" />
                            </div>
                            <div className="space-y-3">
                                <Slider
                                    label="Semantic Fidelity"
                                    value={assessment.semanticFidelity}
                                    onChange={(e) => setAssessment(p => ({ ...p, semanticFidelity: +e.target.value }))}
                                    disabled={disabled}
                                />
                                <Slider
                                    label="Reasoning Score"
                                    value={assessment.reasoningScore}
                                    onChange={(e) => setAssessment(p => ({ ...p, reasoningScore: +e.target.value }))}
                                    disabled={disabled}
                                />
                                <Slider
                                    label="Creativity Score"
                                    value={assessment.creativityScore}
                                    onChange={(e) => setAssessment(p => ({ ...p, creativityScore: +e.target.value }))}
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
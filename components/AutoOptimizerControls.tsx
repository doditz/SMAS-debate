// components/AutoOptimizerControls.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoOptimizerConfig } from '../types';
import { TransparencyTag } from './TransparencyTag';
import { ChevronDownIcon, CpuChipIcon } from './Icons';

// FIX: Implemented the component to replace placeholder content.

interface AutoOptimizerControlsProps {
    config: AutoOptimizerConfig;
    setConfig: React.Dispatch<React.SetStateAction<AutoOptimizerConfig>>;
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


export const AutoOptimizerControls: React.FC<AutoOptimizerControlsProps> = ({ config, setConfig, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <CpuChipIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">D²STIB Auto-Optimizer</span>
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
                               <div className="flex items-center justify-between">
                                   <label htmlFor="auto-optimizer-toggle" className="text-sm text-gray-300">Enable Dynamic Tuning</label>
                                   <button
                                        id="auto-optimizer-toggle"
                                        onClick={() => setConfig(p => ({...p, enabled: !p.enabled}))}
                                        disabled={disabled}
                                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${config.enabled ? 'bg-indigo-600' : 'bg-gray-600'}`}
                                    >
                                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${config.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                               </div>
                                <Slider
                                    label="D² Modulation (Stim/Pin)"
                                    value={config.d2Modulation}
                                    onChange={(e) => setConfig(p => ({ ...p, d2Modulation: +e.target.value }))}
                                    disabled={disabled || !config.enabled}
                                />
                                <p className="text-xs text-gray-500">
                                    Controls the balance between focused, analytical processing (Stim) and creative, expansive thinking (Pin).
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

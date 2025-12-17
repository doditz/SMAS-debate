// components/CognitiveHomeostasisControls.tsx
import React from 'react';
import { HomeostasisConfig } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from './Icons';

interface CognitiveHomeostasisControlsProps {
    config: HomeostasisConfig;
    setConfig: React.Dispatch<React.SetStateAction<HomeostasisConfig>>;
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

export const CognitiveHomeostasisControls: React.FC<CognitiveHomeostasisControlsProps> = ({ config, setConfig, disabled }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
             <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">System Homeostasis</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                         <div className="p-3 pt-0 border-t border-gray-700/50">
                            <div className="space-y-3 pt-3">
                                <Slider
                                    label="Efficiency vs. Depth"
                                    value={config.efficiencyVsDepth}
                                    onChange={(e) => setConfig(p => ({ ...p, efficiencyVsDepth: +e.target.value }))}
                                    disabled={disabled}
                                />
                                <Slider
                                    label="Pruning Aggressiveness"
                                    value={config.pruningAggressiveness}
                                    onChange={(e) => setConfig(p => ({ ...p, pruningAggressiveness: +e.target.value }))}
                                    disabled={disabled}
                                />
                                 <Slider
                                    label="Ethical Floor"
                                    value={config.ethicalFloor}
                                    onChange={(e) => setConfig(p => ({ ...p, ethicalFloor: +e.target.value }))}
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

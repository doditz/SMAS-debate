// components/CognitiveArchitectControls.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmasConfig, HomeostasisConfig } from '../types';
import { ChevronDownIcon, AdjustmentsHorizontalIcon, BrainIcon } from './Icons';

interface CognitiveArchitectControlsProps {
    smasConfig: SmasConfig;
    setSmasConfig: React.Dispatch<React.SetStateAction<SmasConfig>>;
    homeostasisConfig: HomeostasisConfig;
    setHomeostasisConfig: React.Dispatch<React.SetStateAction<HomeostasisConfig>>;
    disabled: boolean;
}

const ConfigSlider: React.FC<{ label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean, description: string }> = ({ label, value, onChange, disabled, description }) => (
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
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);


const CognitiveBalanceVisualizer: React.FC<{ config: SmasConfig, setConfig: React.Dispatch<React.SetStateAction<SmasConfig>>, disabled: boolean }> = ({ config, setConfig, disabled }) => {
    const triangleRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const size = 200;
    const padding = 20;
    const points = {
        top: { x: size / 2, y: padding }, // Gamma
        left: { x: padding, y: size - padding }, // Alpha
        right: { x: size - padding, y: size - padding }, // Beta
    };

    const weightsToPosition = (alpha: number, beta: number, gamma: number) => {
        const total = alpha + beta + gamma;
        if (total === 0) return { x: size / 2, y: size / 2 };
        const normAlpha = alpha / total;
        const normBeta = beta / total;
        const normGamma = gamma / total;

        const x = normAlpha * points.left.x + normBeta * points.right.x + normGamma * points.top.x;
        const y = normAlpha * points.left.y + normBeta * points.right.y + normGamma * points.top.y;
        return { x, y };
    };

    const positionToWeights = (x: number, y: number) => {
        const { top, left, right } = points;
        const distTop = Math.sqrt(Math.pow(x - top.x, 2) + Math.pow(y - top.y, 2));
        const distLeft = Math.sqrt(Math.pow(x - left.x, 2) + Math.pow(y - left.y, 2));
        const distRight = Math.sqrt(Math.pow(x - right.x, 2) + Math.pow(y - right.y, 2));

        const invDistTop = 1 / (distTop + 1e-6);
        const invDistLeft = 1 / (distLeft + 1e-6);
        const invDistRight = 1 / (distRight + 1e-6);
        
        const totalInvDist = invDistTop + invDistLeft + invDistRight;

        let gamma = invDistTop / totalInvDist;
        let alpha = invDistLeft / totalInvDist;
        let beta = invDistRight / totalInvDist;
        
        // Normalize to sum to 1
        const total = alpha + beta + gamma;
        alpha /= total;
        beta /= total;
        gamma /= total;

        return { alpha, beta, gamma };
    };
    
    const handleInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (disabled || !triangleRef.current) return;
        
        const rect = triangleRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const { alpha, beta, gamma } = positionToWeights(x, y);

        setConfig(prev => ({
            ...prev,
            hemisphereWeights: { alpha, beta, gamma }
        }));
    };

    const pos = weightsToPosition(config.hemisphereWeights.alpha, config.hemisphereWeights.beta, config.hemisphereWeights.gamma);

    return (
        <div className="flex flex-col items-center">
             <div
                ref={triangleRef}
                className="relative w-[200px] h-[200px] cursor-pointer"
                onMouseDown={(e) => { setIsDragging(true); handleInteraction(e); }}
                onMouseMove={(e) => isDragging && handleInteraction(e)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path
                        d={`M ${points.top.x} ${points.top.y} L ${points.left.x} ${points.left.y} L ${points.right.x} ${points.right.y} Z`}
                        fill="rgba(31, 41, 55, 0.5)"
                        stroke="rgb(75, 85, 99)"
                        strokeWidth="2"
                    />
                </svg>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-xs text-green-300">Central</p>
                    <p className="text-xs font-mono text-gray-400">γ: {config.hemisphereWeights.gamma.toFixed(2)}</p>
                </div>
                 <div className="absolute -bottom-2 left-2 text-center">
                    <p className="text-xs text-blue-300">Logical</p>
                     <p className="text-xs font-mono text-gray-400">α: {config.hemisphereWeights.alpha.toFixed(2)}</p>
                </div>
                <div className="absolute -bottom-2 right-2 text-center">
                    <p className="text-xs text-purple-300">Creative</p>
                     <p className="text-xs font-mono text-gray-400">β: {config.hemisphereWeights.beta.toFixed(2)}</p>
                </div>
                <motion.div
                    className="absolute w-5 h-5 bg-indigo-400 rounded-full border-2 border-white shadow-lg"
                    style={{
                        left: pos.x - 10,
                        top: pos.y - 10,
                    }}
                    whileTap={{ scale: 1.2 }}
                />
            </div>
             <p className="text-xs text-gray-500 mt-2 text-center">Drag the orb to balance the cognitive triad.</p>
        </div>
    );
};


export const CognitiveArchitectControls: React.FC<CognitiveArchitectControlsProps> = ({ smasConfig, setSmasConfig, homeostasisConfig, setHomeostasisConfig, disabled }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`bg-gray-800/50 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-3"
                disabled={disabled}
            >
                <div className="flex items-center space-x-2">
                    <BrainIcon className="w-5 h-5 text-indigo-300" />
                    <span className="font-semibold text-indigo-300">Architect's Cockpit</span>
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
                        <div className="p-3 pt-2 border-t border-gray-700/50 space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Cognitive Balance (Push-Pull)</h4>
                                <CognitiveBalanceVisualizer config={smasConfig} setConfig={setSmasConfig} disabled={disabled} />
                            </div>

                            <div className="space-y-4">
                               <h4 className="text-sm font-semibold text-gray-300 pt-4 border-t border-gray-700/50">System Homeostasis</h4>
                               <ConfigSlider
                                    label="Efficiency vs. Depth"
                                    value={homeostasisConfig.efficiencyVsDepth}
                                    onChange={(e) => setHomeostasisConfig(p => ({ ...p, efficiencyVsDepth: +e.target.value }))}
                                    disabled={disabled}
                                    description="Left for fast answers. Right for deep, multi-round debates."
                                />
                                <ConfigSlider
                                    label="Pruning Aggressiveness (D³STIB)"
                                    value={homeostasisConfig.pruningAggressiveness}
                                    onChange={(e) => setHomeostasisConfig(p => ({ ...p, pruningAggressiveness: +e.target.value }))}
                                    disabled={disabled}
                                    description="Controls how aggressively the system prunes redundant cognitive pathways."
                                />
                                <ConfigSlider
                                    label="Ethical Floor (BRONAS)"
                                    value={homeostasisConfig.ethicalFloor}
                                    onChange={(e) => setHomeostasisConfig(p => ({ ...p, ethicalFloor: +e.target.value }))}
                                    disabled={disabled}
                                    description="The non-negotiable minimum ethical score for a response."
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

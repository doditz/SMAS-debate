
// components/SmasConfigControls.tsx
import React from 'react';
import { SmasConfig } from '../types';

interface SmasConfigControlsProps {
    config: SmasConfig;
    setConfig: React.Dispatch<React.SetStateAction<SmasConfig>>;
    disabled: boolean;
}

export const SmasConfigControls: React.FC<SmasConfigControlsProps> = ({ config, setConfig, disabled }) => {
    return (
        <div className={`bg-gray-800/50 rounded-lg p-3 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-semibold text-indigo-300 mb-2">SMAS Configuration</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 flex justify-between">
                        <span>Max Personas (Dynamic Swarm)</span>
                        <span className="font-mono text-indigo-200">{config.maxPersonas}</span>
                    </label>
                    <input
                        type="range"
                        min="3"
                        max="12"
                        step="1"
                        value={config.maxPersonas}
                        onChange={(e) => setConfig(p => ({ ...p, maxPersonas: +e.target.value }))}
                        disabled={disabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        System scales from 3 up to {config.maxPersonas} active agents based on query complexity.
                    </p>
                </div>
                 <div>
                    <label className="text-xs text-gray-400 flex justify-between">
                        <span>Debate Rounds (Convergence)</span>
                        <span className="font-mono text-indigo-200">{config.debateRounds}</span>
                    </label>
                    <input
                        type="range"
                        min="2"
                        max="20"
                        step="1"
                        value={config.debateRounds}
                        onChange={(e) => setConfig(p => ({ ...p, debateRounds: +e.target.value }))}
                        disabled={disabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        Min 2 rounds. Extends dynamically (up to 20) if consensus/ARS score is insufficient.
                    </p>
                </div>
            </div>
        </div>
    );
};

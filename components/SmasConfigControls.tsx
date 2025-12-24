
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
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-indigo-300">SMAS Configuration</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Dynamic</span>
                    <button
                        onClick={() => setConfig(p => ({...p, dynamicPersonaSwitching: !p.dynamicPersonaSwitching}))}
                        disabled={disabled}
                        className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors ${config.dynamicPersonaSwitching ? 'bg-indigo-600' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block w-2.5 h-2.5 transform bg-white rounded-full transition-transform ${config.dynamicPersonaSwitching ? 'translate-x-4.5' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 flex justify-between">
                        <span>Max Personas (Dynamic Swarm)</span>
                        <span className="font-mono text-indigo-200">{config.maxPersonas}</span>
                    </label>
                    <input
                        type="range"
                        min="3"
                        max="8"
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
                        min="3"
                        max="12"
                        step="1"
                        value={config.debateRounds}
                        onChange={(e) => setConfig(p => ({ ...p, debateRounds: +e.target.value }))}
                        disabled={disabled}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        Dynamic range: 3 to {config.debateRounds} (max 12). Extends if consensus/ARS score is insufficient.
                    </p>
                </div>
            </div>
        </div>
    );
};

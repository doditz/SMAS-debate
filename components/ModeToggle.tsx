
// components/ModeToggle.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, WrenchScrewdriverIcon, ChartBarIcon } from './Icons';
import { AppMode, User } from '../types';

interface ModeToggleProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    user: User | null;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode, user }) => {
    const isAdmin = !!user;

    return (
        <div className="flex items-center space-x-1 bg-gray-950/80 p-1 rounded-full border border-gray-800 shadow-inner">
            <ModeButton 
                active={mode === 'user'} 
                onClick={() => setMode('user')} 
                icon={<UserIcon className="w-3.5 h-3.5" />} 
                label="User" 
            />
            {isAdmin && (
                <>
                    <ModeButton 
                        active={mode === 'architect'} 
                        onClick={() => setMode('architect')} 
                        icon={<WrenchScrewdriverIcon className="w-3.5 h-3.5" />} 
                        label="Architect" 
                    />
                    <ModeButton 
                        active={mode === 'benchmark'} 
                        onClick={() => setMode('benchmark')} 
                        icon={<ChartBarIcon className="w-3.5 h-3.5" />} 
                        label="Benchmark" 
                    />
                </>
            )}
        </div>
    );
};

const ModeButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`relative px-3 py-1.5 text-[11px] font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {active && (
            <motion.div 
                layoutId="mode-pill" 
                className="absolute inset-0 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
        )}
        <span className="relative z-10">{icon}</span>
        <span className="relative z-10 uppercase tracking-tighter">{label}</span>
    </button>
);

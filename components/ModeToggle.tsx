// components/ModeToggle.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, WrenchScrewdriverIcon } from './Icons';

interface ModeToggleProps {
    mode: 'user' | 'architect';
    setMode: (mode: 'user' | 'architect') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
    const isUserMode = mode === 'user';
    return (
        <div className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-full">
            <button
                onClick={() => setMode('user')}
                className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${isUserMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
                {isUserMode && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-indigo-600 rounded-full" />}
                <span className="relative z-10 flex items-center space-x-2"><UserIcon className="w-4 h-4" /> <span>User</span></span>
            </button>
            <button
                onClick={() => setMode('architect')}
                className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${!isUserMode ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
                {!isUserMode && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-indigo-600 rounded-full" />}
                <span className="relative z-10 flex items-center space-x-2"><WrenchScrewdriverIcon className="w-4 h-4" /> <span>Architect</span></span>
            </button>
        </div>
    );
};

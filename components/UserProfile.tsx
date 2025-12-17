
// components/UserProfile.tsx
import React, { useState, useEffect, useRef } from 'react';
// FIX: The containing types.ts file was implemented, making this import valid.
import { User } from '../types';
import { ChevronDownIcon } from './Icons';
import { TransparencyTag } from './TransparencyTag';

interface UserProfileProps {
    user: User | null;
    onLogin: (user: User) => void;
    onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogin, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleMockLogin = () => {
        // Deterministic avatar based on email hash simulation
        const email = 'demo@neuronas.ai';
        const mockUser: User = {
            name: 'Architect User',
            email: email,
            // Using a deterministic avatar service based on the email string
            picture: `https://ui-avatars.com/api/?name=Architect+User&background=6366f1&color=fff`
        };
        onLogin(mockUser);
    };

    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) {
        return (
            <button
                onClick={handleMockLogin}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-500"
            >
                Sign In (Demo)
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm hidden md:inline">{user.name}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                    <div className="p-3 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-semibold truncate">{user.name}</p>
                           <TransparencyTag type="EXECUTED" />
                        </div>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

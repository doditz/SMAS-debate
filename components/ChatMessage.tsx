// components/ChatMessage.tsx
import React, { useRef, useEffect } from 'react';
import { SendIcon, XIcon, PaperClipIcon } from './Icons';
import type { AppStatus, AttachedImage } from '../types';

interface ChatMessageProps {
    query: string;
    setQuery: (query: string) => void;
    onSend: () => void;
    onReset: () => void;
    disabled: boolean;
    status: AppStatus;
    attachedImage: AttachedImage | null;
    onFileUpload: (file: File) => void;
    onRemoveImage: () => void;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ query, setQuery, onSend, onReset, disabled, status, attachedImage, onFileUpload, onRemoveImage }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isBusy = status === 'loading' || status === 'batch_running';

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && query.trim()) {
                onSend();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled && query.trim()) {
            onSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
        // Reset the input value to allow uploading the same file again
        if(e.target) e.target.value = '';
    };

    const renderButton = () => {
        if (isBusy) {
            return (
                <button
                    type="button"
                    onClick={onReset}
                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors flex items-center justify-center"
                    title="Stop and Reset"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            );
        }
        return (
            <button
                type="submit"
                disabled={disabled || !query.trim()}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="relative p-4 bg-gray-800 border-t border-gray-700 rounded-b-lg">
            {attachedImage && (
                <div className="absolute bottom-full left-4 mb-2">
                    <div className="bg-gray-900/80 p-1.5 rounded-lg inline-block relative shadow-lg">
                        <img src={`data:${attachedImage.file.type};base64,${attachedImage.base64}`} className="h-20 w-20 object-cover rounded" alt="Attachment preview" />
                        <button onClick={onRemoveImage} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white hover:bg-red-500 transition-colors" title="Remove image">
                            <XIcon className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-end space-x-3">
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button type="button" className="p-2 text-gray-400 hover:text-white" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
                    <PaperClipIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2">
                     <textarea
                        ref={textareaRef}
                        rows={1}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={attachedImage ? "Describe what you want to change..." : "Enter a query or select a benchmark..."}
                        disabled={disabled}
                        className="w-full bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none max-h-40"
                    />
                </div>
                <div className="flex items-center">
                    {(status === 'loading' || status === 'batch_running') && <LoadingSpinner />}
                    {renderButton()}
                </div>
            </div>
        </form>
    );
};
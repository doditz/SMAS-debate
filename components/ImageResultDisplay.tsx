// components/ImageResultDisplay.tsx
import React from 'react';

interface ImageResultDisplayProps {
    original: string;
    edited: string;
    originalMimeType: string;
}

export const ImageResultDisplay: React.FC<ImageResultDisplayProps> = ({ original, edited, originalMimeType }) => {
    const originalSrc = `data:${originalMimeType};base64,${original}`;
    const editedSrc = `data:image/png;base64,${edited}`; // Gemini flash-image returns png

    return (
        <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-300 mb-4 text-center">Image Editing Result</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-center flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Original</h4>
                    <img src={originalSrc} alt="Original" className="rounded-lg max-h-80 w-auto shadow-md border-2 border-gray-700/50" />
                </div>
                <div className="text-center flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Edited</h4>
                    <img src={editedSrc} alt="Edited" className="rounded-lg max-h-80 w-auto shadow-md border-2 border-gray-700/50" />
                </div>
            </div>
        </div>
    );
};

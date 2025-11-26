"use client";

import React, { useState } from "react";
import { ParsedQuestions } from "@/lib/parser";

export const UploadJSON = ({
    setParsedQuestions,
    isProcessed,
    setIsProcessed,
}: {
    setParsedQuestions: React.Dispatch<React.SetStateAction<ParsedQuestions | null>>;
    isProcessed: boolean;
    setIsProcessed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsLoading(true);
            setIsProcessed(false);
            setError(null);

            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const jsonString = reader.result as string;
                    const parsedData = JSON.parse(jsonString) as ParsedQuestions;

                    // Validate the structure
                    if (typeof parsedData !== 'object' || parsedData === null) {
                        throw new Error('Invalid JSON structure');
                    }

                    setParsedQuestions(parsedData);
                    console.log("Loaded Questions:", parsedData);
                    setIsProcessed(true);
                } catch (parseError) {
                    setError('Invalid JSON file format');
                    console.error(parseError);
                }
            };
            reader.readAsText(file);
        } catch (err) {
            setError('Failed to read the JSON file');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <label className="px-6 py-3 border-2 border-blue-500 text-blue-700 dark:border-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center font-medium transition-colors">
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin h-5 w-5 border-4 border-blue-400 dark:border-blue-600 border-t-transparent rounded-full"></div>
                        <span>Loading...</span>
                    </div>
                ) : isProcessed ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">JSON Loaded ✔</span>
                ) : (
                    <span>Upload JSON</span>
                )}
                <input type="file" accept="application/json" className="hidden" onChange={handleChange} />
            </label>
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}
        </div>
    );
};

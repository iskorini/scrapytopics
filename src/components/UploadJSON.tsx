"use client";

import React, { useState } from "react";
import { ParsedQuestions } from "@/lib/parser";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UploadJSONProps = {
    setParsedQuestions: React.Dispatch<React.SetStateAction<ParsedQuestions | null>>;
    isProcessed: boolean;
    setIsProcessed: React.Dispatch<React.SetStateAction<boolean>>;
};

const validateQuestionsSchema = (data: unknown): data is ParsedQuestions => {
    if (typeof data !== 'object' || data === null) return false;

    const questions = data as Record<string, unknown>;

    // Validate each question has required structure
    return Object.values(questions).every(q => {
        if (typeof q !== 'object' || q === null) return false;
        const question = q as Record<string, unknown>;

        return (
            typeof question.question === 'string' &&
            typeof question.answers === 'object' &&
            Array.isArray(question.community_answer) &&
            Array.isArray(question.proposed_answer) &&
            typeof question.community_answer_score === 'string'
        );
    });
};

export const UploadJSON: React.FC<UploadJSONProps> = ({
    setParsedQuestions,
    isProcessed,
    setIsProcessed,
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

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                setError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                return;
            }

            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const jsonString = reader.result as string;
                    const parsedData = JSON.parse(jsonString);

                    // Validate the schema
                    if (!validateQuestionsSchema(parsedData)) {
                        throw new Error('Invalid question format');
                    }

                    setParsedQuestions(parsedData);
                    console.log("Loaded Questions:", parsedData);
                    setIsProcessed(true);
                } catch (parseError) {
                    setError('Invalid JSON file format. Please check the file structure.');
                    console.error(parseError);
                }
            };

            reader.onerror = () => {
                setError('Failed to read the file');
            };

            reader.readAsText(file);
        } catch (err) {
            setError('Failed to process the JSON file');
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

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
            setError(null); // Reset error when new file is selected
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
            <label
                htmlFor="json-upload"
                className="px-6 py-3 border-2 border-blue-500 text-blue-700 dark:border-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center font-medium transition-colors"
            >
                {isLoading ? (
                    <div className="flex items-center gap-2" role="status" aria-live="polite">
                        <div className="animate-spin h-5 w-5 border-4 border-blue-400 dark:border-blue-600 border-t-transparent rounded-full" aria-hidden="true"></div>
                        <span>Processing JSON file...</span>
                    </div>
                ) : isProcessed ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        JSON Loaded
                    </span>
                ) : (
                    <span>Upload JSON</span>
                )}
                <input
                    id="json-upload"
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleChange}
                    aria-describedby={error ? "upload-error" : undefined}
                    disabled={isLoading}
                />
            </label>
            {error && (
                <p
                    id="upload-error"
                    role="alert"
                    className="mt-2 text-sm text-red-600 dark:text-red-400 text-center"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

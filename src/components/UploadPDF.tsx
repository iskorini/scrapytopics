"use client";

import React, { useState } from "react";
import { parsePdfTextToQuestions, ParsedQuestions } from "@/lib/parser";


export const UploadPDF = ({
    setParsedQuestions,
    isProcessed,
    setIsProcessed,
}: {
    setParsedQuestions: React.Dispatch<React.SetStateAction<ParsedQuestions | null>>;
    isProcessed: boolean;
    setIsProcessed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [randomize, setRandomize] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsLoading(true); // Start loading
            setIsProcessed(false); // Reset processed state
            const reader = new FileReader();
            reader.onload = async () => {
                const encodedPdf = (reader.result as string).split(",")[1]; // Extract Base64 content
                const response = await fetch('/api/pdf2text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file_content: encodedPdf, filename: 'file.pdf' }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF text: ${response.statusText}`);
                }
                const data = await response.json();
                const text = data.text;
                //const text = await fetchPdfText(base64);
                const parsedQuestions = parsePdfTextToQuestions(text);
                setParsedQuestions(parsedQuestions);
                console.log("Parsed Questions:", parsedQuestions);
                setIsProcessed(true); // Mark as processed
            };
            reader.readAsDataURL(file); // Read file as Data URL
        } catch (err) {
            //setError("Failed to process the PDF file.");
            console.error(err);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="border rounded-2xl p-6 w-full max-w-md shadow-md bg-white dark:bg-gray-800 flex flex-col items-center gap-6">
            <div className="w-full">
                <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Settings</p>
                <label className="inline-flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={randomize}
                        onChange={(e) => setRandomize(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Randomize questions (not yet implemented)</span>
                </label>
            </div>
            <label className="px-4 py-2 border border-blue-400 text-blue-700 dark:border-blue-600 dark:text-blue-400 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center">
                {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-4 border-blue-400 dark:border-blue-600 border-t-transparent rounded-full"></div>
                ) : isProcessed ? (
                    <span className="text-green-500 dark:text-green-400 font-semibold">PDF Processed ✔</span>
                ) : (
                    <span className="text-gray-700 dark:text-gray-300">Upload a PDF file</span>
                )}
                <input type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
            </label>
        </div>
    );
};
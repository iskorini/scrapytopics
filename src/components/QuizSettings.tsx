"use client";

import React from "react";

type Props = {
    questionCount: number;
    onStartQuiz?: () => void;
};

export const QuizSettings: React.FC<Props> = ({ questionCount, onStartQuiz }) => {
    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6">
            <div className="mb-4">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Detected {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Ready to start practicing
                </p>
            </div>

            <div className="space-y-3">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm italic">Settings coming soon...</p>
                </div>
                {/* Placeholder for future settings */}
                {/* Example: Randomize order, difficulty filter, time limits, etc. */}
            </div>

            <button
                onClick={onStartQuiz}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 font-medium"
            >
                Start Quiz
            </button>
        </div>
    );
};

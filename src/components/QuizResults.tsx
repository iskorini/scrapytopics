"use client";

import React from "react";

type QuizStats = {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unanswered: number;
    timeElapsed?: number; // in seconds
};

type QuizResultsProps = {
    stats: QuizStats;
    onRestart: () => void;
};

export const QuizResults: React.FC<QuizResultsProps> = ({ stats, onRestart }) => {
    const percentage = stats.totalQuestions > 0
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
        : 0;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getPerformanceMessage = () => {
        if (percentage >= 90) return { text: "Excellent! 🎉", color: "text-green-600 dark:text-green-400" };
        if (percentage >= 75) return { text: "Great job! 👏", color: "text-blue-600 dark:text-blue-400" };
        if (percentage >= 60) return { text: "Good effort! 👍", color: "text-yellow-600 dark:text-yellow-400" };
        return { text: "Keep practicing! 💪", color: "text-orange-600 dark:text-orange-400" };
    };

    const performance = getPerformanceMessage();

    return (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Quiz Complete!
                </h2>
                <p className={`text-2xl font-semibold ${performance.color}`}>
                    {performance.text}
                </p>
            </div>

            {/* Main Layout: Score Circle on Left, Stats on Right */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-stretch">
                {/* Score Circle - Left Side */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                        <svg className="transform -rotate-90 w-64 h-64">
                            <circle
                                cx="128"
                                cy="128"
                                r="110"
                                stroke="currentColor"
                                strokeWidth="16"
                                fill="transparent"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            <circle
                                cx="128"
                                cy="128"
                                r="110"
                                stroke="currentColor"
                                strokeWidth="16"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 110}`}
                                strokeDashoffset={`${2 * Math.PI * 110 * (1 - percentage / 100)}`}
                                className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-7xl font-bold text-gray-900 dark:text-gray-100">
                                    {percentage}%
                                </div>
                                <div className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                                    Score
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid - Right Side */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-center">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                            {stats.correctAnswers}
                        </div>
                        <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                            Correct Answers
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
                        <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                            {stats.wrongAnswers}
                        </div>
                        <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                            Wrong Answers
                            {stats.unanswered > 0 && (
                                <span className="block text-xs mt-1 text-gray-600 dark:text-gray-400 font-normal">
                                    (including {stats.unanswered} unanswered)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600">
                        <div className="text-4xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                            {stats.totalQuestions}
                        </div>
                        <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                            Total Questions
                        </div>
                    </div>

                    {stats.timeElapsed !== undefined && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {formatTime(stats.timeElapsed)}
                            </div>
                            <div className="text-base text-gray-700 dark:text-gray-300 font-medium">
                                Time Elapsed
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={onRestart}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    Upload New Quiz
                </button>
            </div>
        </div>
    );
};

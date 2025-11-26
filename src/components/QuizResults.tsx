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
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Quiz Complete!
                </h2>
                <p className={`text-2xl font-semibold ${performance.color}`}>
                    {performance.text}
                </p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 80}`}
                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                            className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                                {percentage}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Score
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Correct Answers
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-2 border-red-200 dark:border-red-800">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {stats.wrongAnswers}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Wrong Answers
                        {stats.unanswered > 0 && (
                            <span className="block text-xs mt-1 text-gray-600 dark:text-gray-400">
                                (including {stats.unanswered} unanswered)
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                        {stats.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Total Questions
                    </div>
                </div>

                {stats.timeElapsed !== undefined && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {formatTime(stats.timeElapsed)}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Time Elapsed
                        </div>
                    </div>
                )}
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

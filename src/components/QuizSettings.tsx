"use client";

import React, { useState } from "react";

type QuizMode = 'all' | 'simulation';

type QuizSettingsProps = {
    questionCount: number;
    onStartQuiz?: (mode: QuizMode, simulationCount?: number) => void;
};

export const QuizSettings: React.FC<QuizSettingsProps> = ({ questionCount, onStartQuiz }) => {
    const [mode, setMode] = useState<QuizMode>('all');
    const [simulationCount, setSimulationCount] = useState<number>(Math.min(10, questionCount));

    const handleStart = () => {
        if (mode === 'simulation') {
            onStartQuiz?.(mode, simulationCount);
        } else {
            onStartQuiz?.(mode);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Detected {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose your practice mode
                </p>
            </div>

            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Quiz Mode
                </h3>

                {/* Simulation Mode */}
                <label
                    htmlFor="mode-simulation"
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${mode === 'simulation'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                >
                    <input
                        id="mode-simulation"
                        type="radio"
                        name="mode"
                        value="simulation"
                        checked={mode === 'simulation'}
                        onChange={() => setMode('simulation')}
                        className="mt-1 h-4 w-4 text-blue-600"
                        aria-describedby="mode-simulation-description"
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            Simulation Mode
                        </div>
                        <div id="mode-simulation-description" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Practice with a random selection of questions. Statistics will be shown at the end.
                        </div>
                        {mode === 'simulation' && (
                            <div className="mt-4 flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                <label htmlFor="question-count" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Number of questions:
                                </label>
                                <input
                                    id="question-count"
                                    type="number"
                                    min="1"
                                    max={questionCount}
                                    value={simulationCount}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val >= 1 && val <= questionCount) {
                                            setSimulationCount(val);
                                        }
                                    }}
                                    className="w-20 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label={`Number of questions (maximum ${questionCount})`}
                                />
                                <span className="text-sm text-gray-500 dark:text-gray-400" aria-label={`Maximum ${questionCount} questions`}>
                                    (max: {questionCount})
                                </span>
                            </div>
                        )}
                    </div>
                </label>

                {/* All Mode */}
                <label
                    htmlFor="mode-all"
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${mode === 'all'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                >
                    <input
                        id="mode-all"
                        type="radio"
                        name="mode"
                        value="all"
                        checked={mode === 'all'}
                        onChange={() => setMode('all')}
                        className="mt-1 h-4 w-4 text-blue-600"
                        aria-describedby="mode-all-description"
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            All Questions Mode
                        </div>
                        <div id="mode-all-description" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Practice all questions with free navigation. You can jump between questions and review your answers.
                        </div>
                    </div>
                </label>
            </div>

            <button
                onClick={handleStart}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`Start quiz in ${mode === 'simulation' ? `simulation mode with ${simulationCount} questions` : 'all questions mode'}`}
            >
                Start Quiz
            </button>
        </div>
    );
};

// components/QuestionCard.tsx
import React, { useEffect, useState } from "react";

type QuestionData = {
    question: string;
    answers: Record<string, string>;
    community_answer: string[];
    proposed_answer: string[];
    community_answer_score: string;
};

type Props = {
    questionNumber: number;
    data: QuestionData;
};

export const QuestionCard: React.FC<Props> = ({ questionNumber, data }) => {
    const [showSolution, setShowSolution] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

    useEffect(() => {
        setShowSolution(false);
        setSelectedAnswers([]);
    }, [questionNumber]);

    const isHighlighted = (key: string): boolean => {
        return showSolution && data.community_answer.includes(key);
    };

    const maxSelectable = data.proposed_answer.length;
    const canShowSolution = selectedAnswers.length === maxSelectable;

    const handleCheckboxChange = (key: string) => {
        if (showSolution) return;

        setSelectedAnswers(prev => {
            if (prev.includes(key)) {
                return prev.filter(k => k !== key);
            } else if (prev.length < maxSelectable) {
                return [...prev, key];
            }
            return prev;
        });
    };

    const getAnswerStyle = (key: string) => {
        const baseStyle = "px-2 py-1 rounded cursor-pointer transition-colors";
        if (isHighlighted(key)) {
            return `${baseStyle} bg-green-100 border border-green-300 dark:bg-green-800 dark:border-green-600`;
        }
        if (selectedAnswers.includes(key)) {
            return `${baseStyle} bg-blue-50 border border-blue-300 dark:bg-blue-900 dark:border-blue-600`;
        }
        return `${baseStyle} border border-gray-200 dark:bg-gray-700 dark:border-gray-600`;
    };

    return (
        <div className="border rounded-xl p-4 my-4 shadow-sm w-full max-w-5xl bg-white dark:bg-gray-800">
            <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Question {questionNumber}</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">{data.question}</p>
            <div className="space-y-1 mb-4">
                {Object.entries(data.answers).map(([key, value]) => (
                    <div
                        key={key}
                        className={getAnswerStyle(key)}
                        onClick={() => handleCheckboxChange(key)}
                    >
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedAnswers.includes(key)}
                                onChange={() => handleCheckboxChange(key)}
                                disabled={showSolution}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer disabled:cursor-default"
                            />
                            <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{key})</span>
                                <span className="text-gray-700 dark:text-gray-300"> {value}</span>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <button
                    className={`px-4 py-2 rounded ${showSolution || !canShowSolution
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        }`}
                    disabled={showSolution || !canShowSolution}
                    onClick={() => setShowSolution(true)}
                >
                    show solution
                </button>
            </div>

            {showSolution && (
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Community answer:</span>{" "}
                        {data.community_answer.join(", ")} ({data.community_answer_score})
                    </p>
                    <p>
                        <span className="italic text-gray-900 dark:text-gray-100">Correct answer:</span>{" "}
                        {data.proposed_answer.join(", ")}
                    </p>
                </div>
            )}
        </div>
    );
};
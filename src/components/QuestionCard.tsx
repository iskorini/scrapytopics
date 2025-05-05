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

    useEffect(() => {
        setShowSolution(false);
    }, [questionNumber]);

    const isHighlighted = (key: string): boolean => {
        return showSolution && data.community_answer.includes(key);
    };

    const getAnswerStyle = (key: string) => {
        return isHighlighted(key)
            ? "bg-green-100 border border-green-300 rounded px-2 py-1 dark:bg-green-800 dark:border-green-600"
            : "dark:bg-gray-700 dark:border-gray-600";
    };

    return (
        <div className="border rounded-xl p-4 my-4 shadow-sm w-full max-w-5xl bg-white dark:bg-gray-800">
            <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Question {questionNumber}</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">{data.question}</p>
            <div className="space-y-1 mb-4">
                {Object.entries(data.answers).map(([key, value]) => (
                    <div key={key} className={getAnswerStyle(key)}>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{key})</span>
                        <span className="text-gray-700 dark:text-gray-300"> {value}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <button
                    className={`px-4 py-2 rounded ${showSolution
                        ? "bg-gray-200 text-gray-600 cursor-default dark:bg-gray-700 dark:text-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        }`}
                    disabled={showSolution}
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
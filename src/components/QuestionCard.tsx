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
            ? "bg-green-100 border border-green-300 rounded px-2 py-1"
            : "";
    };

    return (
        <div className="border rounded-xl p-4 my-4 shadow-sm w-full max-w-xl bg-white">
            <h2 className="font-semibold mb-2">Question {questionNumber}</h2>
            <p className="mb-3">{data.question}</p>
            <div className="space-y-1 mb-4">
                {Object.entries(data.answers).map(([key, value]) => (
                    <div key={key} className={getAnswerStyle(key)}>
                        <span className="font-medium">{key})</span> {value}
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <button
                    className={`px-4 py-2 rounded ${showSolution
                        ? "bg-gray-200 text-gray-600 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    disabled={showSolution}
                    onClick={() => setShowSolution(true)}
                >
                    show solution
                </button>
            </div>

            {showSolution && (
                <div className="mt-4 text-sm text-gray-700">
                    <p>
                        <span className="font-semibold">Community answer:</span>{" "}
                        {data.community_answer.join(", ")} ({data.community_answer_score})
                    </p>
                    <p>
                        <span className="italic">Correct answer:</span>{" "}
                        {data.proposed_answer.join(", ")}
                    </p>
                </div>
            )}
        </div>
    );
};
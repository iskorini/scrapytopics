// components/QuestionCard.tsx
import React, { useEffect, useState, useRef } from "react";
import { validateQuestion } from "@/lib/validator";

type QuestionData = {
    question: string;
    answers: Record<string, string>;
    community_answer: string[];
    proposed_answer: string[];
    community_answer_score: string;
};

type QuestionCardProps = {
    questionNumber: number;
    data: QuestionData;
    selectedAnswers?: string[];
    showSolution?: boolean;
    isCorrect?: boolean | null;
    onAnswersChange?: (answers: string[]) => void;
    onSolutionShown?: (isCorrect: boolean) => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
    questionNumber,
    data,
    selectedAnswers: externalSelectedAnswers = [],
    showSolution: externalShowSolution = false,
    isCorrect: externalIsCorrect = null,
    onAnswersChange,
    onSolutionShown
}) => {
    const [showSolution, setShowSolution] = useState(externalShowSolution);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>(externalSelectedAnswers);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(externalIsCorrect);
    const isInitialMount = useRef(true);
    const prevQuestionNumber = useRef<number | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Reset solo quando cambia la domanda
    useEffect(() => {
        if (prevQuestionNumber.current !== null && prevQuestionNumber.current !== questionNumber) {
            setShowSolution(externalShowSolution);
            setSelectedAnswers(externalSelectedAnswers);
            setIsCorrect(externalIsCorrect);
            isInitialMount.current = true;

            // Focus sul nuovo contenuto per screen readers
            if (cardRef.current) {
                cardRef.current.focus();
            }
        }
        prevQuestionNumber.current = questionNumber;
    }, [questionNumber, externalShowSolution, externalSelectedAnswers, externalIsCorrect]);

    // Notifica il padre quando selectedAnswers cambia SOLO per interazioni dell'utente
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        // Controlla se le risposte sono diverse da quelle esterne
        const isDifferent = JSON.stringify(selectedAnswers.sort()) !== JSON.stringify(externalSelectedAnswers.sort());
        if (isDifferent) {
            onAnswersChange?.(selectedAnswers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAnswers]);

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

    const handleShowSolution = () => {
        const validationResult = validateQuestion(data.proposed_answer, selectedAnswers);
        setIsCorrect(validationResult);
        setShowSolution(true);
        onSolutionShown?.(validationResult);
    }

    return (
        <div
            ref={cardRef}
            tabIndex={-1}
            className="border rounded-xl p-4 my-4 shadow-sm w-full max-w-5xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            role="article"
            aria-labelledby={`question-${questionNumber}-title`}
        >
            <h2
                id={`question-${questionNumber}-title`}
                className="font-semibold mb-2 text-gray-900 dark:text-gray-100"
            >
                Question {questionNumber}
            </h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">{data.question}</p>

            {/* Live region for answer selection feedback */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {selectedAnswers.length} of {maxSelectable} answers selected
                {selectedAnswers.length === maxSelectable && " - Maximum reached"}
            </div>

            <div
                className="space-y-1 mb-4"
                role="group"
                aria-label={`Answers for question ${questionNumber}`}
            >
                {Object.entries(data.answers).map(([key, value]) => (
                    <div
                        key={key}
                        className={getAnswerStyle(key)}
                        onClick={() => handleCheckboxChange(key)}
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !showSolution) {
                                e.preventDefault();
                                handleCheckboxChange(key);
                            }
                        }}
                        role="button"
                        tabIndex={showSolution ? -1 : 0}
                        aria-pressed={selectedAnswers.includes(key)}
                        aria-disabled={showSolution}
                    >
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedAnswers.includes(key)}
                                onChange={() => handleCheckboxChange(key)}
                                disabled={showSolution}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer disabled:cursor-default"
                                aria-label={`Answer ${key}: ${value}`}
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
                    className={`px-4 py-2 rounded ${showSolution
                        ? isCorrect
                            ? "bg-green-600 text-white cursor-default dark:bg-green-500"
                            : "bg-red-600 text-white cursor-default dark:bg-red-500"
                        : !canShowSolution
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        }`}
                    disabled={showSolution || !canShowSolution}
                    onClick={handleShowSolution}
                    aria-label={showSolution
                        ? `Solution shown: ${isCorrect ? 'Correct answer' : 'Incorrect answer'}`
                        : 'Show solution for this question'
                    }
                    aria-live="polite"
                >
                    {showSolution
                        ? isCorrect
                            ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Correct!
                                </span>
                            )
                            : (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Incorrect
                                </span>
                            )
                        : 'Show solution'
                    }
                </button>
            </div>

            {showSolution && (
                <div
                    className="mt-4 text-sm text-gray-700 dark:text-gray-300"
                    role="region"
                    aria-label="Solution details"
                >
                    {
                        isCorrect !== null && (
                            <p
                                className={`mb-2 font-semibold flex items-center gap-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                aria-live="assertive"
                            >
                                {isCorrect ? (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Correct!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Incorrect
                                    </>
                                )}
                            </p>
                        )
                    }
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
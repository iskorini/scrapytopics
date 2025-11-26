'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadJSON } from '@/components/UploadJSON';
import { QuestionCard } from '@/components/QuestionCard';
import { QuizSettings } from '@/components/QuizSettings';
import { QuizResults } from '@/components/QuizResults';
import { ParsedQuestions } from '@/lib/parser';
import Image from 'next/image';

type QuizMode = 'all' | 'simulation';

export default function Home() {
  //const [error, setError] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestions | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [hideUploader, setHideUploader] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizMode, setQuizMode] = useState<QuizMode>('all');
  const [activeQuestions, setActiveQuestions] = useState<ParsedQuestions | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Stato per memorizzare le risposte selezionate per ogni domanda
  const [answersState, setAnswersState] = useState<Record<number, {
    selectedAnswers: string[];
    showSolution: boolean;
    isCorrect: boolean | null;
  }>>({});

  // Delay per nascondere l'uploader dopo parsing
  useEffect(() => {
    if (isProcessed) {
      const timeout = setTimeout(() => {
        setHideUploader(true);
        setShowSettings(true);
      }, 1200); // 1.2 secondi di delay per mostrare l'animazione

      return () => clearTimeout(timeout);
    }
  }, [isProcessed]);

  const handleNext = () => {
    if (!parsedQuestions) return;
    const next = currentQuestionIndex + 1;
    if (next <= Object.keys(parsedQuestions).length) {
      setCurrentQuestionIndex(next);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswersChange = useCallback((questionIndex: number, answers: string[]) => {
    setAnswersState(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        selectedAnswers: answers,
        showSolution: prev[questionIndex]?.showSolution || false,
        isCorrect: prev[questionIndex]?.isCorrect || null
      }
    }));
  }, []);

  const handleSolutionShown = useCallback((questionIndex: number, isCorrect: boolean) => {
    setAnswersState(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        selectedAnswers: prev[questionIndex]?.selectedAnswers || [],
        showSolution: true,
        isCorrect
      }
    }));
  }, []);

  return (

    <div className="grid grid-rows-[0px_0fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-gray-900">
      <header className="absolute top-4 left-4 flex items-center gap-2">
        <Image src="logo.svg" alt="Scrapytopics Logo" width="50" height="50" />
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Scrapy<span className="italic font-extralight">topics</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100"> - </span>
          <span className="text-lg font-extralight text-gray-600 dark:text-gray-100"> a delightful alternative </span>
        </span>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left transition-all duration-700 ease-in-out text-gray-900 dark:text-gray-100">
          {isProcessed ? 'Have fun' : 'Upload your JSON'}
        </h1>

        <AnimatePresence>
          {!hideUploader && (
            <motion.div
              key="uploader"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
            >
              <UploadJSON
                setParsedQuestions={setParsedQuestions}
                isProcessed={isProcessed}
                setIsProcessed={setIsProcessed}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {parsedQuestions && showSettings && !quizStarted && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            className="flex flex-col items-center gap-4"
          >
            <QuizSettings
              questionCount={Object.keys(parsedQuestions).length}
              onStartQuiz={(mode, simulationCount) => {
                setQuizMode(mode);
                setStartTime(Date.now());

                if (mode === 'simulation' && simulationCount) {
                  // Seleziona casualmente N domande
                  const allQuestionKeys = Object.keys(parsedQuestions);
                  const shuffled = [...allQuestionKeys].sort(() => Math.random() - 0.5);
                  const selected = shuffled.slice(0, simulationCount);

                  // Crea un nuovo oggetto con solo le domande selezionate
                  const selectedQuestions: ParsedQuestions = {};
                  selected.forEach((key, index) => {
                    selectedQuestions[(index + 1).toString()] = parsedQuestions[key];
                  });

                  setActiveQuestions(selectedQuestions);
                } else {
                  // Modalità 'all': usa tutte le domande
                  setActiveQuestions(parsedQuestions);
                }

                setCurrentQuestionIndex(1);
                setAnswersState({});
                setQuizStarted(true);
              }}
            />
          </motion.div>
        )}

        {activeQuestions && quizStarted && !showResults && (
          <motion.div
            key="question-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            className="flex flex-col items-center gap-4"
          >
            <QuestionCard
              questionNumber={currentQuestionIndex}
              data={activeQuestions[currentQuestionIndex.toString()]}
              selectedAnswers={answersState[currentQuestionIndex]?.selectedAnswers || []}
              showSolution={answersState[currentQuestionIndex]?.showSolution || false}
              isCorrect={answersState[currentQuestionIndex]?.isCorrect || null}
              onAnswersChange={(answers) => handleAnswersChange(currentQuestionIndex, answers)}
              onSolutionShown={(isCorrect) => handleSolutionShown(currentQuestionIndex, isCorrect)}
            />
            <div className="flex gap-4">
              {quizMode === 'all' && (
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 1}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                >
                  Previous Question
                </button>
              )}
              {quizMode === 'all' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentQuestionIndex || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue === '' || /^[0-9]*$/.test(newValue)) {
                        const parsedValue = newValue === '' ? 0 : parseInt(newValue, 10);
                        if (
                          activeQuestions &&
                          parsedValue >= 1 &&
                          parsedValue <= Object.keys(activeQuestions).length
                        ) {
                          setCurrentQuestionIndex(parsedValue);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newIndex = currentQuestionIndex;
                        if (
                          activeQuestions &&
                          newIndex >= 1 &&
                          newIndex <= Object.keys(activeQuestions).length
                        ) {
                          setCurrentQuestionIndex(newIndex);
                        }
                      }
                    }}
                    className="w-16 px-2 py-1 text-center border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    / {activeQuestions ? Object.keys(activeQuestions).length : 0}
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  const totalQuestions = activeQuestions ? Object.keys(activeQuestions).length : 0;
                  if (currentQuestionIndex === totalQuestions && quizMode === 'simulation') {
                    // Fine del quiz in modalità simulation
                    setShowResults(true);
                  } else {
                    handleNext();
                  }
                }}
                disabled={
                  quizMode === 'all' &&
                  activeQuestions &&
                  currentQuestionIndex === Object.keys(activeQuestions).length
                }
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-400 dark:hover:bg-blue-500"
              >
                {quizMode === 'simulation' && activeQuestions && currentQuestionIndex === Object.keys(activeQuestions).length
                  ? 'Finish Quiz'
                  : 'Next Question'
                }
              </button>
            </div>
          </motion.div>
        )}

        {showResults && activeQuestions && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          >
            <QuizResults
              stats={{
                totalQuestions: Object.keys(activeQuestions).length,
                correctAnswers: Object.values(answersState).filter(a => a.isCorrect === true).length,
                wrongAnswers: (() => {
                  const answeredWrong = Object.values(answersState).filter(a => a.isCorrect === false).length;
                  const unansweredCount = Object.keys(activeQuestions).length - Object.values(answersState).filter(a => a.showSolution).length;
                  return answeredWrong + unansweredCount;
                })(),
                unanswered: Object.keys(activeQuestions).length - Object.values(answersState).filter(a => a.showSolution).length,
                timeElapsed: startTime ? Math.floor((Date.now() - startTime) / 1000) : undefined
              }}
              onRestart={() => {
                setShowResults(false);
                setShowSettings(true);
                setQuizStarted(false);
                setCurrentQuestionIndex(1);
                setAnswersState({});
                setActiveQuestions(null);
              }}
            />
          </motion.div>
        )}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Scrapy Topics. All rights reserved.</p>
        <a
          href="https://github.com/iskorini"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-500 dark:text-blue-400"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
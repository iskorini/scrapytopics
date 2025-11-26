'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadJSON } from '@/components/UploadJSON';
import { QuestionCard } from '@/components/QuestionCard';
import { ParsedQuestions } from '@/lib/parser';
import Image from 'next/image';

export default function Home() {
  //const [error, setError] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestions | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [hideUploader, setHideUploader] = useState(false);

  // Delay per nascondere l’uploader dopo parsing
  useEffect(() => {
    if (isProcessed) {
      const timeout = setTimeout(() => {
        setHideUploader(true);
      }, 1200); // 1.2 secondi di delay per mostrare l’animazione

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

        {parsedQuestions && hideUploader && (
          <motion.div
            key="question-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            className="flex flex-col items-center gap-4"
          >
            <QuestionCard
              questionNumber={currentQuestionIndex}
              data={parsedQuestions[currentQuestionIndex.toString()]}
            />
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 1}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                Previous Question
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentQuestionIndex || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === '' || /^[0-9]*$/.test(newValue)) {
                      const parsedValue = newValue === '' ? 0 : parseInt(newValue, 10);
                      if (
                        parsedValue >= 1 &&
                        parsedValue <= Object.keys(parsedQuestions).length
                      ) {
                        setCurrentQuestionIndex(parsedValue);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newIndex = currentQuestionIndex;
                      if (
                        newIndex >= 1 &&
                        newIndex <= Object.keys(parsedQuestions).length
                      ) {
                        setCurrentQuestionIndex(newIndex);
                      }
                    }
                  }}
                  className="w-16 px-2 py-1 text-center border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  / {Object.keys(parsedQuestions).length}
                </span>
              </div>
              <button
                onClick={handleNext}
                disabled={
                  currentQuestionIndex === Object.keys(parsedQuestions).length
                }
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-400 dark:hover:bg-blue-500"
              >
                Next Question
              </button>
            </div>
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
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadPDF } from '@/components/UploadPDF';
import { QuestionCard } from '@/components/QuestionCard';
import { ParsedQuestions } from '@/lib/parser';

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left transition-all duration-700 ease-in-out">
          {isProcessed ? 'Have fun' : 'Upload your PDF'}
        </h1>

        <AnimatePresence>
          {!hideUploader && (
            <motion.div
              key="uploader"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.6 } }}
            >
              <UploadPDF
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
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous Question
              </button>
              <button
                onClick={handleNext}
                disabled={
                  currentQuestionIndex === Object.keys(parsedQuestions).length
                }
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Next Question
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Scrapy Topics. All rights reserved.</p>
        <a
          href="https://github.com/iskorini"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-blue-500"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
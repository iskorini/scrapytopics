'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UploadPDF } from '@/components/UploadPDF';
import { DownloadJSON } from '@/components/DownloadJSON';
import { ParsedQuestions } from '@/lib/parser';

export default function AdminPage() {
    const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestions | null>(null);
    const [isProcessed, setIsProcessed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Scrapytopics Logo" width="40" height="40" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Scrapy<span className="italic font-extralight">topics</span>
                            <span className="text-sm ml-2 text-gray-500 dark:text-gray-400">Admin</span>
                        </span>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        PDF to JSON Converter
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload a PDF file to parse questions and download as JSON
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Upload PDF
                            </h2>
                            <UploadPDF
                                setParsedQuestions={setParsedQuestions}
                                isProcessed={isProcessed}
                                setIsProcessed={setIsProcessed}
                            />
                        </div>

                        {parsedQuestions && isProcessed && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Download JSON
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Successfully parsed {Object.keys(parsedQuestions).length} questions
                                        </p>
                                    </div>
                                    <DownloadJSON parsedQuestions={parsedQuestions} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

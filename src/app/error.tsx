'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                {error.message && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {error.message}
                        </p>
                    </div>
                )}
                <button
                    onClick={reset}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors dark:bg-blue-400 dark:hover:bg-blue-500"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

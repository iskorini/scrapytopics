import React from 'react';
import { ParsedQuestions } from '@/lib/parser';

type DownloadJSONProps = {
    parsedQuestions: ParsedQuestions;
};

export const DownloadJSON: React.FC<DownloadJSONProps> = ({ parsedQuestions }) => {
    const handleDownload = () => {
        const jsonString = JSON.stringify(parsedQuestions, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `questions_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:bg-green-500 dark:hover:bg-green-600 font-medium"
        >
            Download JSON
        </button>
    );
};

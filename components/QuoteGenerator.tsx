import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getQuote } from '../services/geminiService';
import { QuoteData } from '../types';
import Card from './Card';
import { QuoteIcon } from './Icons';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded-md w-full animate-pulse"></div>
        <div className="h-6 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded-md w-1/2 ml-auto mt-2 animate-pulse"></div>
    </div>
);

const QuoteGenerator: React.FC = () => {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await getQuote();
            setQuote(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const content = useMemo(() => {
        if (loading && !quote) { // Show skeleton only on initial load
            return <LoadingSkeleton />;
        }
        if (error) {
            return <p className="text-red-400 text-center">{error}</p>;
        }
        if (quote) {
            return (
                 <blockquote className="text-center">
                    <p className="text-xl italic text-gray-300">"{quote.quote}"</p>
                    <footer className="mt-4 text-right text-cyan-400 font-semibold">— {quote.author}</footer>
                </blockquote>
            );
        }
        return null;
    }, [loading, error, quote]);

    return (
        <Card title="Motivational Quote" icon={<QuoteIcon className="w-6 h-6 text-cyan-300"/>}>
            <div className="min-h-[150px] flex items-center justify-center">
                 {content}
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={fetchQuote}
                    disabled={loading}
                    className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'New Quote'
                    )}
                </button>
            </div>
        </Card>
    );
};

export default QuoteGenerator;

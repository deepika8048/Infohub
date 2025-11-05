import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getCurrencyRates } from '../services/geminiService';
import { CurrencyRates } from '../types';
import Card from './Card';
import { CurrencyIcon } from './Icons';

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
        <div className="h-12 bg-gray-700 rounded-md w-full animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
        <div className="h-8 bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
    </div>
);

const CurrencyConverter: React.FC = () => {
    const [rates, setRates] = useState<CurrencyRates | null>(null);
    const [inrValue, setInrValue] = useState<string>('1000');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await getCurrencyRates();
            setRates(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const numericInrValue = parseFloat(inrValue) || 0;

    const convertedValues = useMemo(() => {
        if (!rates) return { usd: '...', eur: '...' };
        return {
            usd: (numericInrValue * rates.USD).toFixed(2),
            eur: (numericInrValue * rates.EUR).toFixed(2),
        };
    }, [numericInrValue, rates]);

    const content = useMemo(() => {
        if (loading) {
            return <LoadingSkeleton />;
        }
        if (error) {
            return <p className="text-red-400 text-center">{error}</p>;
        }
        return (
             <div className="space-y-4">
                <div>
                    <label htmlFor="inr-input" className="block text-sm font-medium text-gray-400 mb-1">
                        Amount in INR
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">₹</span>
                        <input
                            id="inr-input"
                            type="number"
                            value={inrValue}
                            onChange={(e) => setInrValue(e.target.value)}
                            placeholder="Enter amount in INR"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-8 pr-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                        <span className="font-medium text-gray-300">🇺🇸 USD</span>
                        <span className="text-2xl font-bold text-green-400">${convertedValues.usd}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                        <span className="font-medium text-gray-300">🇪🇺 EUR</span>
                        <span className="text-2xl font-bold text-blue-400">€{convertedValues.eur}</span>
                    </div>
                </div>
                 {rates && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                        Current rates: 1 INR = ${rates.USD.toFixed(5)} USD / €{rates.EUR.toFixed(5)} EUR
                    </p>
                )}
            </div>
        )
    }, [loading, error, inrValue, rates, convertedValues]);

    return (
        <Card title="Currency Converter" icon={<CurrencyIcon className="w-6 h-6 text-cyan-300"/>}>
           {content}
        </Card>
    );
};

export default CurrencyConverter;

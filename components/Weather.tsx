import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getWeather } from '../services/geminiService';
import { WeatherData, WeatherIconType } from '../types';
import Card from './Card';
import { SunIcon, CloudIcon, RainIcon, WindIcon, StormIcon, FogIcon, WeatherIcon } from './Icons';

const WeatherIconComponent: React.FC<{ icon: WeatherIconType, className: string }> = ({ icon, className }) => {
    switch (icon) {
        case 'SUN': return <SunIcon className={className} />;
        case 'CLOUD': return <CloudIcon className={className} />;
        case 'RAIN': return <RainIcon className={className} />;
        case 'STORM': return <StormIcon className={className} />;
        case 'WIND': return <WindIcon className={className} />;
        case 'FOG': return <FogIcon className={className} />;
        default: return <CloudIcon className={className} />;
    }
};

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
        <div className="h-10 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
        <div className="h-24 bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
            <div className="h-8 bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-8 bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-8 bg-gray-700 rounded-md animate-pulse"></div>
        </div>
    </div>
);

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
        try {
            setError(null);
            setLoading(true);
            const data = await getWeather(lat, lon);
            setWeather(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    setError(`Geolocation error: ${err.message}. Please enable location services.`);
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchWeatherData]);

    const weatherContent = useMemo(() => {
        if (loading) {
            return <LoadingSkeleton />;
        }
        if (error) {
            return <p className="text-red-400 text-center">{error}</p>;
        }
        if (weather) {
            return (
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-300">{weather.location}</h3>
                    <div className="my-4 flex justify-center items-center gap-4">
                        <WeatherIconComponent icon={weather.icon} className="w-24 h-24 text-yellow-300" />
                        <div>
                            <p className="text-6xl font-bold">{Math.round(weather.temperatureCelsius)}°C</p>
                            <p className="text-gray-400 text-lg capitalize">{weather.condition}</p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm sm:text-base">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="font-semibold text-cyan-400">Humidity</p>
                            <p>{weather.humidity}%</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="font-semibold text-cyan-400">Wind Speed</p>
                            <p>{weather.windSpeedKph} km/h</p>
                        </div>
                         <div className="bg-gray-700/50 p-3 rounded-lg col-span-2 sm:col-span-1">
                            <p className="font-semibold text-cyan-400">Condition</p>
                            <p>{weather.condition}</p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }, [loading, error, weather]);
    
    return (
        <Card title="Current Weather" icon={<WeatherIcon className="w-6 h-6 text-cyan-300" />}>
            {weatherContent}
        </Card>
    );
};

export default Weather;

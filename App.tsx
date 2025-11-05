import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import Weather from './components/Weather';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';
import { WeatherIcon, CurrencyIcon, QuoteIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Weather);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Weather:
        return <Weather />;
      case Tab.Currency:
        return <CurrencyConverter />;
      case Tab.Quote:
        return <QuoteGenerator />;
      default:
        return null;
    }
  };

  const tabs = useMemo(() => [
    { id: Tab.Weather, label: 'Weather', icon: <WeatherIcon className="w-6 h-6" /> },
    { id: Tab.Currency, label: 'Currency', icon: <CurrencyIcon className="w-6 h-6" /> },
    { id: Tab.Quote, label: 'Quote', icon: <QuoteIcon className="w-6 h-6" /> },
  ], []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">InfoHub</h1>
          <p className="text-gray-400 mt-2">Your daily information dashboard.</p>
        </header>

        <nav className="flex justify-center mb-8 bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl border border-gray-700 sticky top-4 z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

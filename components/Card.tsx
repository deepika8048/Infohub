import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-gray-700 flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold text-cyan-300">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;

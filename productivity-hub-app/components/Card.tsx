
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  titleIcon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, titleIcon, actionButton, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col ${className}`}>
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {titleIcon}
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {actionButton}
      </div>
      <div className="p-5 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;

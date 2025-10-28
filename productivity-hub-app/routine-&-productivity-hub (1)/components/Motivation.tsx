
import React, { useState, useEffect, useCallback } from 'react';
import { getMotivationalMessage } from '../services/geminiService';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';

const Motivation: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newMessage = await getMotivationalMessage();
      setMessage(newMessage);
    } catch (err) {
      setError('Failed to fetch a motivational message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RefreshButton = (
    <button onClick={fetchMessage} className="text-slate-400 hover:text-amber-500 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors" disabled={loading}>
        <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    </button>
  );

  return (
    <Card 
        title="Daily Motivation" 
        titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        actionButton={RefreshButton}
    >
      <div className="flex items-center justify-center h-full text-center">
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <blockquote className="text-slate-600 dark:text-slate-300 italic text-lg">
            "{message}"
          </blockquote>
        )}
      </div>
    </Card>
  );
};

export default Motivation;

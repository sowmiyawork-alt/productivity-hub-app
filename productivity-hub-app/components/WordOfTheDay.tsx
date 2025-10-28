
import React, { useState, useEffect, useCallback } from 'react';
import { getWordOfTheDay } from '../services/geminiService';
import { WordOfTheDayType } from '../types';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';

const WordOfTheDay: React.FC = () => {
  const [word, setWord] = useState<WordOfTheDayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newWord = await getWordOfTheDay();
      setWord(newWord);
    } catch (err) {
      setError('Failed to fetch the word of the day. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const RefreshButton = (
    <button onClick={fetchWord} className="text-slate-400 hover:text-sky-500 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors" disabled={loading}>
        <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    </button>
  );

  return (
    <Card 
        title="Word of the Day"
        titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        actionButton={RefreshButton}
    >
      <div className="flex flex-col justify-center h-full">
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && word && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{word.term}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{word.definition}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 italic">
                e.g., "{word.example}"
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WordOfTheDay;

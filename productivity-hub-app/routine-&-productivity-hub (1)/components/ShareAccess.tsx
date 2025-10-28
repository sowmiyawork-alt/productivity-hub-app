
import React, { useState } from 'react';
import Card from './Card';

const ShareAccess: React.FC = () => {
  const [email, setEmail] = useState('');
  const [validity, setValidity] = useState('24h');
  const [message, setMessage] = useState('');

  const validityOptions: { [key: string]: string } = {
    '24h': '24 hours',
    '7d': '7 days',
    '30d': '30 days',
    'permanent': 'permanently'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const validityText = validityOptions[validity];
      setMessage(`Access invitation sent to ${email} for ${validityText}.`);
      setEmail('');
      setValidity('24h');
      setTimeout(() => setMessage(''), 4000); // Clear message after 4 seconds
    }
  };

  return (
    <Card 
        title="Share Access"
        titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
    >
      <div className="flex flex-col justify-center h-full">
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Grant access to a friend or colleague to view your progress.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
            aria-label="Email for sharing access"
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"
          />
          <select
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            aria-label="Access validity period"
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="24h">For 24 hours</option>
            <option value="7d">For 7 days</option>
            <option value="30d">For 30 days</option>
            <option value="permanent">Permanently</option>
          </select>
          <button type="submit" className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-emerald-300" disabled={!email}>
            Invite
          </button>
        </form>
        {message && <p className="text-green-600 dark:text-green-400 mt-3 text-sm text-center">{message}</p>}
      </div>
    </Card>
  );
};

export default ShareAccess;

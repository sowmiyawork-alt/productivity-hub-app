import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onLogout: () => void;
  user: User | null;
}

const UserAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    // Simple hash function for a somewhat unique color
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    const intToRGB = (i: number) => {
        const c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }
    
    const bgColor = `#${intToRGB(hashCode(name))}`;

    return (
        <div 
            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: bgColor, opacity: 0.8 }}
            title={name}
        >
            {initial}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ onLogout, user }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Productivity Hub</h1>
        </div>
        {user && (
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.role}</div>
                </div>
                <UserAvatar name={user.name} />
                <button
                    onClick={onLogout}
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    aria-label="Log out"
                >
                    Logout
                </button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
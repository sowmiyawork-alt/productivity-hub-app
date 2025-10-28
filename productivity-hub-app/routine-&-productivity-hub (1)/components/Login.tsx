import React, { useState } from 'react';

interface LoginProps {
    onLogin: (email: string, password: string) => void;
    error: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Welcome Back!</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <p className="text-center text-sm text-red-500 dark:text-red-400">
                        Invalid credentials or account not approved.
                    </p>
                )}
                <div>
                    <label htmlFor="email-login" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                        id="email-login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                    />
                </div>
                <div>
                    <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <input
                        id="password-login"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-indigo-300">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;
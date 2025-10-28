import React, { useState } from 'react';

interface SignUpProps {
    onSignUp: (name: string, email: string, password: string) => void;
    error: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignUp(name, email, password);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {error && (
                    <p className="text-center text-sm text-red-500 dark:text-red-400">
                        An account with this email already exists.
                    </p>
                )}
                 <div>
                    <label htmlFor="name-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                        id="name-signup"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                    />
                </div>
                <div>
                    <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                        id="email-signup"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                    />
                </div>
                <div>
                    <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <input
                        id="password-signup"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-indigo-300">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default SignUp;
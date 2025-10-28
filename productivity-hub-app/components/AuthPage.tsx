import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
  authStatus: 'idle' | 'pending' | 'error';
  setAuthStatus: React.Dispatch<React.SetStateAction<'idle' | 'pending' | 'error'>>;
}

const PendingApproval: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Sign-up successful!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your account is now pending approval from an administrator. You will be notified once your account is active.
        </p>
        <button 
            onClick={onBack}
            className="w-full bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        >
            Back to Login
        </button>
    </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp, authStatus, setAuthStatus }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setAuthStatus('idle'); // Reset error/pending state on view toggle
  }

  const renderContent = () => {
    if (authStatus === 'pending') {
      return <PendingApproval onBack={() => { setAuthStatus('idle'); setIsLoginView(true); }} />;
    }
    if (isLoginView) {
      return <Login onLogin={onLogin} error={authStatus === 'error'} />;
    }
    return <SignUp onSignUp={onSignUp} error={authStatus === 'error'} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Productivity Hub</h1>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            {renderContent()}
            {authStatus !== 'pending' && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleToggleView}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        {isLoginView ? 'Don\'t have an account? Sign Up' : 'Already have an account? Log In'}
                    </button>
                </div>
            )}
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 mt-6 text-xs">
            © {new Date().getFullYear()} Productivity Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
import React from 'react';
import { User } from '../types';
import Card from './Card';

interface AdminDashboardProps {
  pendingUsers: User[];
  onUpdateUserStatus: (userId: string, status: 'approved' | 'rejected') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pendingUsers, onUpdateUserStatus }) => {
  return (
    <Card
      title="Admin Approval"
      titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
      className="border-2 border-violet-200 dark:border-violet-800"
    >
        {pendingUsers.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {pendingUsers.map(user => (
                    <li key={user.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{user.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <button
                                onClick={() => onUpdateUserStatus(user.id, 'approved')}
                                className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => onUpdateUserStatus(user.id, 'rejected')}
                                className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">No new users are awaiting approval.</p>
        )}
    </Card>
  );
};

export default AdminDashboard;
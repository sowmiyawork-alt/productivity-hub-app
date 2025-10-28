import React, { useState } from 'react';
import { Routine } from '../types';
import Card from './Card';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface RoutineListProps {
  routines: Routine[];
  onAddRoutine: (text: string) => void;
  onDeleteRoutine: (id: string) => void;
}

const RoutineItem: React.FC<{ routine: Routine; onDelete: () => void; }> = ({ routine, onDelete }) => (
    <li className="flex items-center justify-between p-3 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">
        <span className="text-slate-700 dark:text-slate-300">{routine.text}</span>
        <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors duration-200" aria-label="Delete routine item">
            <TrashIcon className="w-5 h-5" />
        </button>
    </li>
);


const RoutineList: React.FC<RoutineListProps> = ({ routines, onAddRoutine, onDeleteRoutine }) => {
  const [newRoutine, setNewRoutine] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoutine(newRoutine);
    setNewRoutine('');
  };

  return (
    <Card 
      title="My Routines"
      titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M7 7l10 10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
    >
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
            placeholder="Add a new routine..."
            className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
          />
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 disabled:bg-teal-300" disabled={!newRoutine.trim()}>
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
        <ul className="space-y-1 overflow-y-auto flex-grow pr-1">
            {routines.length > 0 ? (
                routines.map(routine => (
                    <RoutineItem 
                        key={routine.id} 
                        routine={routine}
                        onDelete={() => onDeleteRoutine(routine.id!)}
                    />
                ))
            ) : (
                <p className="text-center text-slate-500 py-4">No routines added yet. Start by adding one!</p>
            )}
        </ul>
      </div>
    </Card>
  );
};

export default RoutineList;
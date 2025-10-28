import React, { useState } from 'react';
import { Todo } from '../types';
import Card from './Card';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (text: string, time: string) => void;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  title: string;
  titleIcon: React.ReactNode;
  themeColor: 'indigo' | 'rose' | string;
}

// Define theme structure for type safety
interface Theme {
  ring: string;
  bg: string;
  hoverBg: string;
  disabledBg: string;
  text: string;
  border: string;
}

const themeClasses: { [key: string]: Theme } = {
  indigo: { ring: 'focus:ring-indigo-500', bg: 'bg-indigo-500', hoverBg: 'hover:bg-indigo-600', disabledBg: 'disabled:bg-indigo-300', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
  rose: { ring: 'focus:ring-rose-500', bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-600', disabledBg: 'disabled:bg-rose-300', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500' },
};

const TodoItem: React.FC<{ todo: Todo; onToggle: () => void; onDelete: () => void; theme: Theme; }> = ({ todo, onToggle, onDelete, theme }) => (
    <li className="flex items-center justify-between p-3 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            todo.completed
              ? `${theme.border} ${theme.bg}`
              : 'border-slate-300 dark:border-slate-600'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span
              className={`text-slate-700 dark:text-slate-300 transition-colors duration-200 ${
                todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {todo.text}
            </span>
            {todo.time && (
                <span className={`text-xs font-medium ${theme.text}`}>
                  {new Date(`1970-01-01T${todo.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            )}
        </div>
      </div>
      <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors duration-200 ml-2" aria-label="Delete todo">
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
);

const TodoList: React.FC<TodoListProps> = ({ todos, onAddTodo, onToggleTodo, onDeleteTodo, title, titleIcon, themeColor }) => {
  const [newTodo, setNewTodo] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTodo(newTodo, newTodoTime);
    setNewTodo('');
    setNewTodoTime('');
  };

  const currentTheme = themeClasses[themeColor] || themeClasses.indigo;

  return (
    <Card 
      title={title}
      titleIcon={titleIcon}
    >
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-grow flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className={`w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 ${currentTheme.ring} focus:outline-none transition-shadow`}
            />
            <input
              type="time"
              value={newTodoTime}
              onChange={(e) => setNewTodoTime(e.target.value)}
              className={`bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-2 text-sm ${currentTheme.ring} focus:outline-none transition-shadow`}
              aria-label="Time for new task"
            />
          </div>
          <button type="submit" className={`${currentTheme.bg} text-white px-4 py-2 rounded-lg ${currentTheme.hoverBg} transition-colors flex items-center justify-center gap-2 ${currentTheme.disabledBg}`} disabled={!newTodo.trim()}>
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
        <ul className="space-y-1 overflow-y-auto flex-grow pr-1">
          {todos.length > 0 ? (
            todos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={() => onToggleTodo(todo)} 
                onDelete={() => onDeleteTodo(todo.id!)}
                theme={currentTheme}
              />
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">All tasks completed. Well done!</p>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default TodoList;
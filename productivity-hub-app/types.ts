export interface Todo {
  id?: string;
  text: string;
  completed: boolean;
  time?: string;
}

export interface Routine {
  id?: string;
  text: string;
}

export interface WordOfTheDayType {
  term: string;
  definition: string;
  example: string;
}

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
}
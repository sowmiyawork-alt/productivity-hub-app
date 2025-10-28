import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Todo, Routine, User } from './types';
import Header from './components/Header';
import TodoList from './components/TodoList';
import RoutineList from './components/Routine';
import Motivation from './components/Motivation';
import WordOfTheDay from './components/WordOfTheDay';
import ShareAccess from './components/ShareAccess';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';


const App: React.FC = () => {
  // --- State Management ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'idle' | 'pending' | 'error'>('idle');

  // Firestore Data State
  const [professionalTodos, setProfessionalTodos] = useState<Todo[]>([]);
  const [personalTodos, setPersonalTodos] = useState<Todo[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  // --- Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            if (userData.status === 'approved') {
              setCurrentUser({ ...userData, id: firebaseUser.uid });
            } else {
              setAuthStatus(userData.status === 'pending' ? 'pending' : 'error');
              setCurrentUser(null);
              await signOut(auth); // Sign out user if not approved
            }
          }
        } catch (e) {
            console.error("Error fetching user document:", e);
            setCurrentUser(null);
            await signOut(auth);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // --- Data Listeners ---
  useEffect(() => {
    if (!currentUser) {
      setProfessionalTodos([]);
      setPersonalTodos([]);
      setRoutines([]);
      setPendingUsers([]);
      return;
    }
    
    // Todos Listeners
    const profTodoQuery = query(collection(db, 'users', currentUser.id, 'professionalTodos'), orderBy('time'));
    const profUnsub = onSnapshot(profTodoQuery, (snapshot) => {
      const todos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Todo[];
      setProfessionalTodos(todos);
    });
    
    const persTodoQuery = query(collection(db, 'users', currentUser.id, 'personalTodos'), orderBy('time'));
    const persUnsub = onSnapshot(persTodoQuery, (snapshot) => {
      const todos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Todo[];
      setPersonalTodos(todos);
    });

    // Routines Listener
    const routineQuery = query(collection(db, 'users', currentUser.id, 'routines'));
    const routineUnsub = onSnapshot(routineQuery, (snapshot) => {
      const routines = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Routine[];
      setRoutines(routines);
    });
    
    // Admin listener for pending users
    let adminUnsub = () => {};
    if (currentUser.role === 'admin') {
      const pendingUsersQuery = query(collection(db, 'users'), where('status', '==', 'pending'));
      adminUnsub = onSnapshot(pendingUsersQuery, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as User[];
        setPendingUsers(users);
      });
    }

    return () => {
      profUnsub();
      persUnsub();
      routineUnsub();
      adminUnsub();
    };
  }, [currentUser]);

  // --- Auth Handlers ---
  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      setAuthStatus('idle');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        role: 'user',
        status: 'pending',
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setAuthStatus('pending');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthStatus('error');
      }
      console.error("Sign up error:", error);
    }
  };
  
  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthStatus('idle');
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle setting the user state
    } catch (error) {
      setAuthStatus('error');
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const handleUpdateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { status });
    } catch (error) {
        console.error("Error updating user status:", error);
    }
  };

  // --- Todo & Routine Handlers ---
  const createTodoHandler = (collectionName: string) => async (text: string, time: string) => {
    if (text.trim() === '' || !currentUser) return;
    try {
      await addDoc(collection(db, 'users', currentUser.id, collectionName), { text, time, completed: false });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  
  const toggleTodoHandler = (collectionName: string) => async (todo: Todo) => {
    if (!currentUser || !todo.id) return;
    try {
      const todoDocRef = doc(db, 'users', currentUser.id, collectionName, todo.id);
      await updateDoc(todoDocRef, { completed: !todo.completed });
    } catch (error) {
        console.error("Error toggling todo:", error);
    }
  };

  const createDeleteHandler = (collectionName: string) => async (todoId: string) => {
    if (!currentUser || !todoId) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.id, collectionName, todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const addRoutine = async (text: string) => {
    if (text.trim() === '' || !currentUser) return;
    try {
      await addDoc(collection(db, 'users', currentUser.id, 'routines'), { text });
    } catch(error) {
      console.error("Error adding routine:", error);
    }
  };
  const deleteRoutine = async (routineId: string) => {
    if (!currentUser || !routineId) return;
    try {
        await deleteDoc(doc(db, 'users', currentUser.id, 'routines', routineId));
    } catch (error) {
        console.error("Error deleting routine:", error);
    }
  };
  
  // --- Render Logic ---
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} authStatus={authStatus} setAuthStatus={setAuthStatus} />;
  }
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header onLogout={handleLogout} user={currentUser} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        
        {currentUser.role === 'admin' && (
          <AdminDashboard 
            pendingUsers={pendingUsers}
            onUpdateUserStatus={handleUpdateUserStatus}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Motivation />
          <WordOfTheDay />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TodoList
                todos={professionalTodos}
                onAddTodo={createTodoHandler('professionalTodos')}
                onToggleTodo={toggleTodoHandler('professionalTodos')}
                onDeleteTodo={createDeleteHandler('professionalTodos')}
                title="Professional" themeColor="indigo"
                titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              />
              <TodoList
                todos={personalTodos}
                onAddTodo={createTodoHandler('personalTodos')}
                onToggleTodo={toggleTodoHandler('personalTodos')}
                onDeleteTodo={createDeleteHandler('personalTodos')}
                title="Personal" themeColor="rose"
                titleIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <RoutineList routines={routines} onAddRoutine={addRoutine} onDeleteRoutine={deleteRoutine} />
            <ShareAccess />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
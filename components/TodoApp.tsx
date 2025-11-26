"use client";

import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// server-backed todos (data persisted on server)

export default function TodoApp() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  // load current user from API using token
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        const body = await res.json();
        if (body?.user?.username) {
          setCurrentUser(body.user.username);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // load todos when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/todos', { headers: { Authorization: `Bearer ${token}` } });
        const body = await res.json();
        setTodos(body.todos || []);
      } catch {
        setTodos([]);
      }
    })();
  }, [currentUser]);

  const addTodo = async (text: string) => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const body = await res.json();
      if (res.ok && body.todo) setTodos((s) => [body.todo, ...s]);
    } catch {
      // ignore
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/todos', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
      setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    } catch {}
  };

  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('/api/todos', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
      setTodos((s) => s.filter((t) => t.id !== id));
    } catch {}
  };

  const handleRegister = (data: { username: string }) => {
    // registration handled via RegisterPageClient which stores token and redirects
    setCurrentUser(data.username);
    setTodos([]);
  };

  const handleLogin = (data: { username: string }) => {
    // login handled in LoginPageClient which stores token and redirects
    setCurrentUser(data.username);
  };

  // logout is handled in the header; TodoApp doesn't render its own logout UI anymore

  // This component is client-only, so computing the date here runs only
  // in the browser and avoids server/client mismatches.
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="todo-app w-full max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {currentUser ? `${currentUser} Todos — ${today}` : `Pinext Todos — ${today}`}
        </h2>
        {/* Header shows auth status and logout; TodoApp does not duplicate it */}
      </div>

      {!currentUser ? (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Register</h3>
            <RegisterForm onRegister={handleRegister} />
          </div>
          <div>
            <h3 className="font-medium mb-2">Login</h3>
            <LoginForm onLogin={(u) => handleLogin(u)} />
          </div>
        </div>
      ) : (
        <>
          <TodoForm onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          <div className="mt-4 text-sm muted">Todos are stored on the server (demo file store).</div>
        </>
      )}
    </section>
  );
}

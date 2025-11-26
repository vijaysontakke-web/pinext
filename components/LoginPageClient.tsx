"use client";

import React from "react";
import { toastError, toastSuccess } from '../lib/toast';
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPageClient() {
  const router = useRouter();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        toastError(body?.error || 'Login failed');
        return false;
      }
      if (body.token) {
        localStorage.setItem('auth_token', body.token);
        toastSuccess('Login successful');
      }
      router.push('/todos');
      return true;
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      toastError(message || 'Login failed');
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

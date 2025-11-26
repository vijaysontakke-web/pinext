"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";
import { toastError, toastSuccess } from '../lib/toast';

export default function RegisterPageClient() {
  const router = useRouter();

  const handleRegister = async (data: { username: string; email: string; mobile: string; gender: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body?.error && body.error.includes('breach')) {
          toastError(body.error);
          return false;
        }
        toastError(body?.error || 'Register failed');
        return false;
      }
      if (body.token) {
        localStorage.setItem('auth_token', body.token);
      }
      toastSuccess('Account created! Redirecting...');
      router.push('/todos');
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
}

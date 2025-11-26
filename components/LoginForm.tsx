"use client";

import React, { useState } from "react";

type LoginData = { username: string; password: string };

export default function LoginForm({ onLogin }: { onLogin: (data: LoginData) => Promise<boolean | void> | boolean | void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const u = username.trim();
    if (!u || !password) {
      setError("Please provide username and password.");
      return;
    }

    try {
      const result = await Promise.resolve(onLogin({ username: u, password }));
      // Only set success if the page-level handler actually succeeded
      if (result !== false) {
        setSuccess("Login successful — redirecting...");
      }
    } catch (err: unknown) {
      let message = "Login failed";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else if (err && typeof err === "object" && "message" in err) {
        const m = (err as { message?: unknown }).message;
        if (typeof m === "string") message = m;
      }
      setError(message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="form-control">
        <label className="label" htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          aria-label="Username"
          required
          className="input w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="relative form-control">
        <label className="label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          aria-label="Password"
          required
          className="input w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-2 text-sm muted"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {success && <div className="text-sm text-success">{success}</div>}
      {error && <div className="text-sm text-error">{error}</div>}
      <div className="flex gap-2">
        <button className="btn btn-primary">Login</button>
      </div>
    </form>
  );
}

"use client";

import React, { useState } from "react";

type RegisterData = {
  username: string;
  email: string;
  mobile: string;
  gender: string;
  password: string;
};

export default function RegisterForm({ onRegister }:{ onRegister: (data: RegisterData) => Promise<boolean | void> | boolean | void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState<string>("");
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

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const practicalEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/i;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      // if (!practicalEmail.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{6,15}$/.test(mobile)) {
      setError("Please enter a valid mobile number (6-15 digits).");
      return;
    }

    if (!gender) {
      setError("Please select a gender.");
      return;
    }

    try {
      const result = await Promise.resolve(onRegister({ username: u, email, mobile, gender, password }));
      // Only set success if registration actually succeeded (no breach or other error)
      if (result !== false) {
        setSuccess("Account created — redirecting...");
      }
    } catch (err) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="form-control">
        <label className="label" htmlFor="register-username">Username</label>
        <input
          id="register-username"
          name="username"
          aria-label="Username"
          required
          className="input w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          aria-label="Email address"
          required
          className="input w-full"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label" htmlFor="register-mobile">Mobile number</label>
        <input
          id="register-mobile"
          name="mobile"
          inputMode="numeric"
          aria-label="Mobile number"
          required
          className="input w-full"
          placeholder="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">Gender</label>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="gender" value="male" checked={gender==="male"} onChange={() => setGender("male")} />
            Male
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="gender" value="female" checked={gender==="female"} onChange={() => setGender("female")} />
            Female
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="gender" value="other" checked={gender==="other"} onChange={() => setGender("other")} />
            Other
          </label>
        </div>
      </div>
      <div className="relative">
        <label className="sr-only" htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type={showPassword ? "text" : "password"}
          aria-label="Password"
          required
          minLength={8}
          className="input w-full"
          placeholder="Password (min 8 chars)"
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
        <button className="btn btn-primary">Register</button>
      </div>
    </form>
  );
}

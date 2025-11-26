"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePageClient() {
  const [user, setUser] = useState<string | null>(null);
const [details, setDetails] = useState<any>(null);

useEffect(() => {
  const getUser = async () => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

    if (!token) {
      // OK now because it's async callback (not synchronous effect body)
      setUser(null);
      setDetails(null);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setUser(null);
        setDetails(null);
        return;
      }

      const body = await res.json();
      const u = body?.user?.username ?? null;

      setUser(u);
      setDetails(body?.user ?? null);
    } catch {
      setUser(null);
      setDetails(null);
    }
  };

  getUser();
}, []);


  if (!user) return <div>Please sign in to see your profile.</div>;
  if (!details) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <div className="space-y-2 text-sm">
        <div><strong>Username:</strong> {user}</div>
        <div><strong>Email:</strong> {details.email}</div>
        <div><strong>Mobile:</strong> {details.mobile}</div>
        <div><strong>Gender:</strong> {details.gender}</div>
        <div><strong>Joined:</strong> {new Date(details.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const body = await res.json();
        setUser(body?.user?.username || null);
      } catch {
        setUser(null);
      }
    };

    check();

    // update when other tabs change auth token
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') check();
    };
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, [pathname]);

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
    } catch {}
    setUser(null);
    router.push('/');
  };

  const linkClass = (path: string) =>
    `nav-link ${pathname === path ? 'active' : ''}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black shadow-sm h-20 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-full">
        <Image src="/pinext-logo.avif" alt="Pinext" width={62} height={62} className="h-16 w-auto" />
        <nav className="flex items-center gap-3">
          <Link href="/" className={linkClass("/")}>Home</Link>
          {!user ? (
            <>
              <Link href="/register" className={linkClass("/register")}>Register</Link>
              <Link href="/login" className={linkClass("/login")}>Login</Link>
            </>
          ) : (
            <>
              <Link href="/todos" className={linkClass("/todos")}>My Todos</Link>
              <Link href="/profile" className={linkClass("/profile")}>Profile</Link>
              <div className="ml-4 flex items-center gap-3">
                <span className="text-sm muted">Signed in as <strong>{user}</strong></span>
                <button onClick={logout} className="btn btn-ghost">Logout</button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client";

import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 font-sans">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600"
                >
                  Todo App
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/todos"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Todos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}

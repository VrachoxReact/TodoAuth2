"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Register
      </h2>
      {error && (
        <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>
      )}
      <AuthForm onSubmit={handleSubmit} buttonText="Register" />
    </div>
  );
}

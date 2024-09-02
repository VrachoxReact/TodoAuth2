"use client";

import { useEffect, useState } from "react";
import TodoList from "@/components/TodoList";
import { useRouter } from "next/navigation";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setTodos(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    };

    fetchTodos();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Your Todos</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <TodoList initialTodos={todos} />
      </div>
    </div>
  );
}

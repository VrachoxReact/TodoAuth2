import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTodo }),
    });
    if (res.ok) {
      const todo = await res.json();
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const deleteTodo = async (id: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow mr-2 p-2 border rounded"
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={todo.completed ? "line-through" : ""}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-auto px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

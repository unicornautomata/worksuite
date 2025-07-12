import React, { useEffect, useState, useCallback } from 'react';
import TodoList from '../components/TodoList';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch("https://todo-production-40cc.up.railway.app/api/todos", {
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch todos");

      const data = await response.json();
      console.log("Fetched todos:", data); // ✅ Add this line
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }, [username, password]);

  const toggleTodo = async (todo) => {
    try {
      await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(username + ":" + password),
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      fetchTodos();
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
        },
      });
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();

    // Set admin based on role stored in localStorage
    const role = localStorage.getItem("role");
    if (role === "ADMIN") setIsAdmin(true);
  }, [fetchTodos]);

  return (
    <div className="todo-page">
      <h2>My To-Do List</h2>
      <TodoList
        todos={todos}
        fetchTodos={fetchTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default TodoPage;

import React, { useState, useEffect } from "react";
import "../App.css";

// Replace with your Railway API URL
const API_URL = "https://todo-production-40cc.up.railway.app/api/todos";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const auth = JSON.parse(localStorage.getItem("auth")); // { username, password }

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: "Basic " + btoa(`${auth.username}:${auth.password}`),
        },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${auth.username}:${auth.password}`),
      },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (todo) => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${auth.username}:${auth.password}`),
      },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa(`${auth.username}:${auth.password}`),
      },
    });
    fetchTodos();
  };

  return (
    <div className="todo-container">
      <h2 className="title">📝 My To-Do List</h2>
      <div className="input-row">
        <input
          type="text"
          value={title}
          placeholder="Add a new task..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>➕ Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleTodo(todo)}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

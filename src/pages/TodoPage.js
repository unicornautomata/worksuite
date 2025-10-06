import React, { useState, useCallback, useEffect } from 'react';
import TodoList from '../components/TodoList';
import { useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";

function TodoPage() {
  const apiUrl = localStorage.getItem("apiserver");
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const role = localStorage.getItem('role');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!username || !password) {
      navigate('/login');
    }
  }, [username, password, navigate]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/todos`, {
        headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
      });

      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [username, password, apiUrl]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const safeTodo = DOMPurify.sanitize(newTodo);
    if (!safeTodo.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
        body: JSON.stringify({ title: safeTodo, completed: false }),
      });

      if (!response.ok) throw new Error('Failed to add todo');
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEditTodo = async (id, updatedTitle) => {
    try {
      const todo = todos.find(t => t.id === id);
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
        body: JSON.stringify({ ...todo, title: updatedTitle }),
      });

      if (!response.ok) throw new Error('Failed to update todo');
      fetchTodos();
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
      });

      if (!response.ok) throw new Error('Failed to delete todo');
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const response = await fetch(`${apiUrl}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
        body: JSON.stringify({ ...todo, completed: todo.completed }),
      });

      if (!response.ok) throw new Error('Failed to toggle todo');
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // ✅ Extract unique usernames from todos
  const uniqueUsers = [...new Set(todos.map(t => t.username))];

  // ✅ Apply filter only if ADMIN
  const filteredTodos = role === "ADMIN" && selectedUser
    ? todos.filter(t => t.username === selectedUser)
    : todos;

  return (
    <div className="todo-page" style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'left' }}>
        {role === "ADMIN" ? "To Do List (Global)" : "My To Do List"}
      </h2>

      {/* ✅ Input, Button, Combobox aligned nicely */}
      <form
        onSubmit={handleAddTodo}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          gap: '0.75rem'
        }}
      >
        {/* Input expands to fill available space */}
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new task"
          style={{ padding: '0.5rem', flexGrow: 1 }}
        />

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add</button>

        {/* Combobox (only for ADMIN) */}
        {role === "ADMIN" && (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              padding: '0.5rem',
              width: '350px'
            }}
          >
            <option value="">All Users</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}
      </form>

      <TodoList
        todos={filteredTodos}
        editTodo={handleEditTodo}
        deleteTodo={handleDeleteTodo}
        toggleTodo={handleToggleTodo}
      />
    </div>
  );
}

export default TodoPage;

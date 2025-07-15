import React, { useState, useCallback, useEffect } from 'react';
import TodoList from '../components/TodoList';
import { useNavigate } from 'react-router-dom';

function TodoPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const role = localStorage.getItem('role');
  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('https://todo-production-40cc.up.railway.app/api/todos', {
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
  }, [username, password]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('https://todo-production-40cc.up.railway.app/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
        body: JSON.stringify({ title: newTodo, completed: false }),
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
      const response = await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${id}`, {
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
      const response = await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${id}`, {
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
    console.log("✅ Current completed:", todo.completed);
    const response = await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ':' + password),
      },
      body: JSON.stringify({ ...todo, completed: todo.completed }),
    });
    console.log(response)
    if (!response.ok) throw new Error('Failed to toggle todo');

    fetchTodos(); // Refresh after update
  } catch (error) {
    console.error('Error toggling todo:', error);
  }
};

  const handleLogoff = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="todo-page" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{role === "ADMIN" ? "To Do List (Global)" : "My To Do List"}</h2>
        <span className="navbar-user">Hello, {username}</span>
        <button onClick={handleLogoff}>Logoff</button>
      </div>

      <form onSubmit={handleAddTodo} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new task"
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>Add</button>
      </form>

      <TodoList
        todos={todos}
        editTodo={handleEditTodo}
        deleteTodo={handleDeleteTodo}
        toggleTodo={handleToggleTodo}
      />
    </div>
  );
}

export default TodoPage;

import React, { useState, useCallback, useEffect } from 'react';
import TodoList from '../components/TodoList';
import { useNavigate } from 'react-router-dom';

function TodoPage() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'ADMIN';

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('https://todo-production-40cc.up.railway.app/api/todos', {
        headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
      });

      if (!response.ok) throw new Error('Failed to fetch todos');

      const data = await response.json();
      console.log('Fetched todos:', data); // For debugging
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [username, password]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`https://todo-production-40cc.up.railway.app/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ':' + password),
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      if (!response.ok) throw new Error('Failed to toggle todo');

      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
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

  const handleLogoff = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="todo-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My To-Do List</h2>
        <button onClick={handleLogoff}>Logoff</button>
      </div>
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

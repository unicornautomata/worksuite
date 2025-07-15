import React, { useState } from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, editTodo, deleteTodo, toggleTodo }) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    if (editingText.trim()) {
      editTodo(id, editingText);
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleToggleClick = async (todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await toggleTodo(updatedTodo);
    } catch (error) {
      console.error("Error toggling todo status:", error);
    }
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <TodoItem
  key={todo.id}
  todo={todo}
  isEditing={editingId === todo.id}
  editingText={editingText}
  setEditingText={setEditingText}
  startEdit={startEdit}
  handleEditSubmit={handleEditSubmit}
  onToggle={handleToggleClick}
  onDelete={deleteTodo}
  isAdmin={todo.role === "admin"} // ✅ infer admin by presence of username
/>
      ))}
    </ul>
  );
}

export default TodoList;

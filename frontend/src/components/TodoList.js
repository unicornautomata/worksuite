import React, { useState } from 'react';

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
    console.log("Toggling todo:", todo.id, "Current status:", todo.completed);
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
        <li key={todo.id} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '1px solid #ccc',
          backgroundColor: todo.completed ? '#f5f5f5' : 'transparent'
        }}>
          <span
            style={{
              flexGrow: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#333'
            }}
          >
            {todo.title}
          </span>

          <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
            {editingId !== todo.id && (
              <button
                onClick={() => handleToggleClick(todo)}
                style={{
                  backgroundColor: todo.completed ? '#ff9800' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  minWidth: '80px'
                }}
              >
                {todo.completed ? 'Undo' : 'Done'}
              </button>
            )}

            {editingId !== todo.id && (
              <button
                onClick={() => startEdit(todo)}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>

          {editingId === todo.id && (
            <form
              onSubmit={(e) => handleEditSubmit(e, todo.id)}
              style={{ marginLeft: '10px', flexGrow: 1 }}
            >
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ width: '100%', padding: '5px' }}
                autoFocus
              />
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
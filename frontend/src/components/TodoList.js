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
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
            style={{ marginRight: '10px' }}
          />

          {editingId === todo.id ? (
            <form onSubmit={(e) => handleEditSubmit(e, todo.id)} style={{ flexGrow: 1 }}>
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ width: '100%' }}
              />
            </form>
          ) : (
            <span style={{
              flexGrow: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#333',
              fontStyle: todo.completed ? 'italic' : 'normal'
            }}>
              {todo.title}
            </span>
          )}

          <>
            {editingId !== todo.id && (
              <button onClick={() => startEdit(todo)} style={{ marginLeft: '10px' }}>Edit</button>
            )}
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
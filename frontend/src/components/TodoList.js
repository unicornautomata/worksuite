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
          {/* Checkbox - now properly clickable */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
            style={{ 
              marginRight: '10px',
              cursor: 'pointer',
              width: '18px',
              height: '18px'
            }}
          />

          {editingId === todo.id ? (
            <form 
              onSubmit={(e) => handleEditSubmit(e, todo.id)} 
              style={{ flexGrow: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
            </form>
          ) : (
            <span 
              style={{
                flexGrow: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#888' : '#333',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => toggleTodo(todo)} // Allow clicking text to toggle too
            >
              {todo.title}
            </span>
          )}

          <div style={{ display: 'flex', marginLeft: '10px' }}>
            {editingId !== todo.id ? (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(todo);
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
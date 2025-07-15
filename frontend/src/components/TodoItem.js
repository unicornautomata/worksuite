import React from 'react';
import './TodoItem.css';

function TodoItem({
  todo,
  isEditing,
  editingText,
  setEditingText,
  startEdit,
  handleEditSubmit,
  onToggle,
  onDelete,
  isAdmin // ✅ added prop
}) {
  return (
    <li
      className="todo-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        backgroundColor: todo.completed ? '#f5f5f5' : 'transparent'
      }}
    >
      {!isEditing ? (
        <>
          <span
            style={{
              flexGrow: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#333'
            }}
          >
            {todo.title}
            {isAdmin && todo.username && (
              <span className="todo-username"> — {todo.username}</span>
            )}
          </span>

          <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
            <button
              onClick={() => onToggle(todo)}
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

            <button
              onClick={() => onDelete(todo.id)}
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
        </>
      ) : (
        <form
          onSubmit={(e) => handleEditSubmit(e, todo.id)}
          style={{ marginLeft: '10px', flexGrow: 1, display: 'flex' }}
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
  );
}

export default TodoItem;

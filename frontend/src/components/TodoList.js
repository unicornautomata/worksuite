import React, { useState } from 'react';

function TodoList({ todos, toggleTodo, deleteTodo, editTodo, isAdmin }) {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            marginBottom: '10px',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {/* Edit Mode */}
          {editId === todo.id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editTodo(todo.id, editValue);
                setEditId(null);
                setEditValue('');
              }}
            >
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                required
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <span
                onClick={() => toggleTodo(todo)}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginRight: '10px',
                }}
              >
                {todo.title}
              </span>

              {/* Admin-only Controls */}
              {isAdmin && (
                <>
                  <button onClick={() => {
                    setEditId(todo.id);
                    setEditValue(todo.title);
                  }}>
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '5px' }}>
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;

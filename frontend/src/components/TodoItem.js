import React from 'react';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, isAdmin }) {
  return (
    <li className="todo-item">
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        <span className="checkmark"></span>
      </label>

      <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
        {todo.title}
      </span>

      {isAdmin && (
        <button className="delete-btn" onClick={() => onDelete(todo.id)}>
          ✕
        </button>
      )}
    </li>
  );
}

export default TodoItem;

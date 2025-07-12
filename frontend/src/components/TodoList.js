import React, { useEffect } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ todos, fetchTodos, toggleTodo, deleteTodo, isAdmin }) => {
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <ul className="todo-list">
      {todos.length === 0 ? (
        <li className="empty">No tasks yet. Add one!</li>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            isAdmin={isAdmin}
          />
        ))
      )}
    </ul>
  );
};

export default TodoList;

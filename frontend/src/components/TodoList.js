import React, { useEffect } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ todos, fetchTodos, toggleTodo, deleteTodo, isAdmin }) => {
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // ✅ Option 1: include fetchTodos as dependency

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isAdmin={isAdmin}
        />
      ))}
    </ul>
  );
};

export default TodoList;

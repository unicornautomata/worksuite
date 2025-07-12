import React from 'react';
import TodoList from '../components/TodoList';

function TodoPage() {
  return (
    <div className="todo-page">
      <h2>My To-Do List</h2>
      <TodoList />
    </div>
  );
}

export default TodoPage;

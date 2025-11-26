"use client";

import React from "react";
import { Todo } from "./TodoApp";

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.completed ? "line-through muted" : ""}>{todo.text}</span>
      </label>
      <button
        onClick={() => onDelete(todo.id)}
        className="btn btn-ghost text-error"
        aria-label={`Delete ${todo.text}`}
      >
        Delete
      </button>
    </li>
  );
}

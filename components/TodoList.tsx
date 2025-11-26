"use client";

import React from "react";
import { Todo } from "./TodoApp";
import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  onToggle,
  onDelete,
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (todos.length === 0)
    return <div className="text-sm muted">No todos yet — add your first one!</div>;

  return (
    <ul className="space-y-2">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

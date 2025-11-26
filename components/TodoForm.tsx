"use client";

import React, { useState } from "react";

export default function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input
        className="input flex-1"
        placeholder="Add a new todo..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
}

import React, { useState } from "react";
import { usePrompts } from "../context/PromptContext.jsx";
import PromptCard from "./PromptCard.jsx";


export default function PromptGrid({ onView, onEdit, onRequestDelete }) {
  const { filteredPrompts, reorderPrompts, isLoading } = usePrompts();
  const [draggedId, setDraggedId] = useState(null);
  const [overId, setOverId] = useState(null);

  const handleDrop = (targetId) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    const ids = filteredPrompts.map((p) => p._id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, draggedId);
    reorderPrompts(next);
    setDraggedId(null);
    setOverId(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-sm border border-ink-900/10 bg-ink-900/5 dark:border-vellum-100/10 dark:bg-vellum-100/5"
          />
        ))}
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-ink-900/15 py-20 text-center dark:border-vellum-100/15">
        <p className="font-display text-xl text-ink-900 dark:text-vellum-50">
          No cards on this shelf yet
        </p>
        <p className="mt-1 max-w-sm font-body text-sm text-ink-700/60 dark:text-vellum-100/50">
          Try a different category, clear your search, or add a new prompt to
          get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredPrompts.map((prompt) => (
        <div
          key={prompt._id}
          className={overId === prompt._id ? "ring-2 ring-brass-500 rounded-sm" : ""}
        >
          <PromptCard
            prompt={prompt}
            onView={onView}
            onEdit={onEdit}
            onRequestDelete={onRequestDelete}
            isDragging={draggedId === prompt._id}
            dragHandlers={{
              draggable: true,
              onDragStart: () => setDraggedId(prompt._id),
              onDragOver: (e) => {
                e.preventDefault();
                setOverId(prompt._id);
              },
              onDragLeave: () => setOverId((id) => (id === prompt._id ? null : id)),
              onDrop: (e) => {
                e.preventDefault();
                handleDrop(prompt._id);
              },
              onDragEnd: () => {
                setDraggedId(null);
                setOverId(null);
              },
            }}
          />
        </div>
      ))}
    </div>
  );
}

import React from "react";
import { usePrompts } from "../context/PromptContext.jsx";

export default function PromptCard({
  prompt,
  onView,
  onEdit,
  onRequestDelete,
  dragHandlers,
  isDragging,
}) {
  const { toggleFavorite, togglePin, copyToClipboard, duplicatePrompt } = usePrompts();

  const formattedDate = new Date(prompt.createdDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article
      {...dragHandlers}
      onClick={() => onView(prompt)}
      className={`group relative flex cursor-pointer flex-col gap-2 rounded-sm border bg-vellum-50 p-4 shadow-card transition-all dark:bg-ink-800 ${
        prompt.isPinned
          ? "border-brass-500/60 ring-1 ring-brass-500/30"
          : "border-ink-900/10 dark:border-vellum-100/10"
      } ${isDragging ? "opacity-40" : "opacity-100"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="cursor-grab select-none pt-0.5 text-ink-700/30 dark:text-vellum-100/30"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          ⋮⋮
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold text-ink-900 dark:text-vellum-50">
            {prompt.title}
          </h3>
          <span className="mt-0.5 inline-block rounded-full border border-brass-500/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-brass-600 dark:text-brass-400">
            {prompt.category}
          </span>
        </div>
        {prompt.isPinned && (
          <span className="font-mono text-[10px] uppercase text-brass-500">pinned</span>
        )}
      </div>

      <p className="line-clamp-2 font-body text-sm text-ink-700 dark:text-vellum-100/70">
        {prompt.description || prompt.content}
      </p>

      {prompt.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-ink-900/5 px-1.5 py-0.5 font-mono text-[10px] text-ink-700/70 dark:bg-vellum-100/10 dark:text-vellum-100/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between border-t border-dashed border-ink-900/10 pt-2 dark:border-vellum-100/10">
        <span className="font-mono text-[10px] text-ink-700/50 dark:text-vellum-100/40">
          {formattedDate}
        </span>
        <div
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            title={prompt.isFavorite ? "Unfavorite" : "Favorite"}
            active={prompt.isFavorite}
            onClick={() => toggleFavorite(prompt._id)}
          >
            {prompt.isFavorite ? "★" : "☆"}
          </IconButton>
          <IconButton title="Pin" active={prompt.isPinned} onClick={() => togglePin(prompt._id)}>
            ▲
          </IconButton>
          <IconButton title="Copy" onClick={() => copyToClipboard(prompt.content)}>
            ⧉
          </IconButton>
          <IconButton title="Duplicate" onClick={() => duplicatePrompt(prompt._id)}>
            ⎘
          </IconButton>
          <IconButton title="Edit" onClick={() => onEdit(prompt)}>
            ✎
          </IconButton>
          <IconButton title="Delete" onClick={() => onRequestDelete(prompt)}>
            ✕
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function IconButton({ children, title, onClick, active }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-sm text-xs hover:bg-ink-900/10 dark:hover:bg-vellum-100/10 ${
        active ? "text-brass-500" : "text-ink-700 dark:text-vellum-100/70"
      }`}
    >
      {children}
    </button>
  );
}

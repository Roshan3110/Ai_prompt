import React from "react";
import { usePrompts } from "../context/PromptContext.jsx";

export default function PromptDetailsModal({ prompt, onClose, onEdit }) {
  const { copyToClipboard } = usePrompts();
  if (!prompt) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto scrollbar-thin rounded-sm border border-ink-900/10 bg-vellum-50 p-6 shadow-card dark:border-vellum-100/10 dark:bg-ink-800">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink-900 dark:text-vellum-50">
              {prompt.title}
            </h2>
            <span className="mt-1 inline-block rounded-full border border-brass-500/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-brass-600 dark:text-brass-400">
              {prompt.category}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-700/50 hover:text-ink-900 dark:text-vellum-100/50 dark:hover:text-vellum-50"
          >
            ✕
          </button>
        </div>

        {prompt.description && (
          <p className="mb-4 font-body text-sm italic text-ink-700/70 dark:text-vellum-100/60">
            {prompt.description}
          </p>
        )}

        <div className="mb-4 whitespace-pre-wrap rounded-sm border border-ink-900/10 bg-vellum-100/60 p-4 font-mono text-sm leading-relaxed text-ink-900 dark:border-vellum-100/10 dark:bg-ink-900 dark:text-vellum-100">
          {prompt.content}
        </div>

        {prompt.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-ink-900/5 px-2 py-0.5 font-mono text-[10px] text-ink-700/70 dark:bg-vellum-100/10 dark:text-vellum-100/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <dl className="mb-5 grid grid-cols-2 gap-2 font-mono text-[11px] text-ink-700/60 dark:text-vellum-100/50">
          <div>
            <dt className="uppercase tracking-wide">Created</dt>
            <dd>{formatDate(prompt.createdDate)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Last updated</dt>
            <dd>{formatDate(prompt.lastUpdatedDate)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Favorite</dt>
            <dd>{prompt.isFavorite ? "Yes ★" : "No"}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Pinned</dt>
            <dd>{prompt.isPinned ? "Yes ▲" : "No"}</dd>
          </div>
        </dl>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => copyToClipboard(prompt.content)}
            className="rounded-sm border border-ink-900/15 px-4 py-2 font-body text-sm dark:border-vellum-100/15"
          >
            Copy prompt
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="rounded-sm bg-ink-900 px-4 py-2 font-body text-sm font-semibold text-vellum-50 dark:bg-brass-500 dark:text-ink-900"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function DeleteConfirmDialog({ prompt, onCancel, onConfirm }) {
  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 p-4">
      <div className="w-full max-w-sm rounded-sm border border-ink-900/10 bg-vellum-50 p-6 shadow-card dark:border-vellum-100/10 dark:bg-ink-800">
        <h2 className="font-display text-lg text-ink-900 dark:text-vellum-50">
          Delete this prompt?
        </h2>
        <p className="mt-2 font-body text-sm text-ink-700/70 dark:text-vellum-100/60">
          “{prompt.title}” will be permanently removed. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-sm border border-ink-900/15 px-4 py-2 font-body text-sm dark:border-vellum-100/15"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(prompt._id)}
            className="rounded-sm bg-red-600 px-4 py-2 font-body text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../constants/categories.js";
import { usePrompts } from "../context/PromptContext.jsx";

const emptyForm = {
  title: "",
  content: "",
  category: CATEGORIES[0],
  tags: "",
  description: "",
};

export default function PromptFormModal({ open, onClose, editingPrompt }) {
  const { addPrompt, updatePrompt } = usePrompts();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingPrompt) {
      setForm({
        title: editingPrompt.title,
        content: editingPrompt.content,
        category: editingPrompt.category,
        tags: (editingPrompt.tags || []).join(", "),
        description: editingPrompt.description || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingPrompt, open]);

  if (!open) return null;

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    else if (form.title.length > 150) next.title = "Title must be under 150 characters";
    if (!form.content.trim()) next.content = "Prompt content is required";
    if (!CATEGORIES.includes(form.category)) next.category = "Choose a valid category";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      description: form.description.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingPrompt) {
        await updatePrompt(editingPrompt._id, payload);
      } else {
        await addPrompt(payload);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-sm border border-ink-900/10 bg-vellum-50 p-6 shadow-card dark:border-vellum-100/10 dark:bg-ink-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {editingPrompt ? "Edit prompt card" : "New prompt card"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-700/50 hover:text-ink-900 dark:text-vellum-100/50 dark:hover:text-vellum-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Title" error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass(errors.title)}
              placeholder="e.g. Landing page headline generator"
            />
          </Field>

          <Field label="Prompt content" error={errors.content}>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={5}
              className={inputClass(errors.content)}
              placeholder="Write the full prompt text here…"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputClass(errors.category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tags (comma separated)">
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className={inputClass()}
                placeholder="marketing, copy, seo"
              />
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className={inputClass()}
              placeholder="A short note on when to use this prompt"
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-ink-900/15 px-4 py-2 font-body text-sm dark:border-vellum-100/15"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-ink-900 px-4 py-2 font-body text-sm font-semibold text-vellum-50 disabled:opacity-60 dark:bg-brass-500 dark:text-ink-900"
            >
              {submitting ? "Saving…" : editingPrompt ? "Save changes" : "Create prompt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-wide text-ink-700/60 dark:text-vellum-100/50">
        {label}
      </span>
      {children}
      {error && <span className="font-body text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full rounded-sm border bg-vellum-50 px-3 py-2 font-body text-sm focus:outline-none focus:ring-1 dark:bg-ink-900 dark:text-vellum-100 ${
    error
      ? "border-red-400 focus:ring-red-400"
      : "border-ink-900/15 focus:border-brass-500 focus:ring-brass-500 dark:border-vellum-100/15"
  }`;
}

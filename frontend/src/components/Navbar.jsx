import React, { useRef } from "react";
import { usePrompts } from "../context/PromptContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar({ onAddNew }) {
  const { exportPrompts, importPromptsFromFile, isOnline } = usePrompts();
  const fileInputRef = useRef(null);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-900/10 bg-vellum-50/90 backdrop-blur dark:border-vellum-100/10 dark:bg-ink-900/90">
      <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-brass-500 font-display text-lg text-brass-500">
            §
          </span>
          <div>
            <h1 className="font-display text-lg leading-none tracking-tight">
              Index
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700/60 dark:text-vellum-100/50">
              AI Prompt Library
            </p>
          </div>
          <span
            className={`ml-2 hidden items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide sm:flex ${
              isOnline
                ? "bg-moss-500/10 text-moss-600 dark:text-moss-500"
                : "bg-red-500/10 text-red-600"
            }`}
            title={isOnline ? "Connected to backend" : "Offline — using local storage"}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-moss-500" : "bg-red-500"}`} />
            {isOnline ? "synced" : "offline"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-sm border border-ink-900/15 px-3 py-1.5 font-body text-xs font-medium hover:border-brass-500 hover:text-brass-600 dark:border-vellum-100/15 dark:hover:border-brass-400 dark:hover:text-brass-400"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importPromptsFromFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={exportPrompts}
            className="rounded-sm border border-ink-900/15 px-3 py-1.5 font-body text-xs font-medium hover:border-brass-500 hover:text-brass-600 dark:border-vellum-100/15 dark:hover:border-brass-400 dark:hover:text-brass-400"
          >
            Export
          </button>
          <ThemeToggle />
          <button
            onClick={onAddNew}
            className="rounded-sm bg-ink-900 px-3.5 py-1.5 font-body text-xs font-semibold text-vellum-50 shadow-card hover:bg-brass-600 dark:bg-brass-500 dark:text-ink-900 dark:hover:bg-brass-400"
          >
            + New prompt
          </button>
        </div>
      </div>
    </header>
  );
}

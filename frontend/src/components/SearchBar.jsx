import React, { useEffect, useState } from "react";
import { usePrompts } from "../context/PromptContext.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { SORT_OPTIONS } from "../constants/categories.js";

export default function SearchBar() {
  const { setSearchTerm, sortBy, setSortBy } = usePrompts();
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    setSearchTerm(debounced);
  }, [debounced, setSearchTerm]);

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/40 dark:text-vellum-100/40">
          ⌕
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search prompts by title or content…"
          className="w-full rounded-sm border border-ink-900/15 bg-vellum-50 py-2 pl-9 pr-3 font-body text-sm placeholder:text-ink-700/40 focus:border-brass-500 focus:outline-none focus:ring-1 focus:ring-brass-500 dark:border-vellum-100/15 dark:bg-ink-800 dark:text-vellum-100 dark:placeholder:text-vellum-100/30"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="rounded-sm border border-ink-900/15 bg-vellum-50 px-3 py-2 font-body text-sm focus:border-brass-500 focus:outline-none dark:border-vellum-100/15 dark:bg-ink-800 dark:text-vellum-100"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

import React from "react";
import { CATEGORIES } from "../constants/categories.js";
import { usePrompts } from "../context/PromptContext.jsx";

export default function Sidebar({ open, onClose }) {
  const { prompts, activeCategory, setActiveCategory, favoritesOnly, setFavoritesOnly } =
    usePrompts();

  const countFor = (cat) =>
    cat === "All" ? prompts.length : prompts.filter((p) => p.category === cat).length;

  const Item = ({ label, active, onClick, count }) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-left font-body text-sm transition-colors ${
        active
          ? "bg-ink-900 text-vellum-50 dark:bg-brass-500 dark:text-ink-900"
          : "text-ink-800 hover:bg-ink-900/5 dark:text-vellum-100 dark:hover:bg-vellum-100/5"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono text-[10px] opacity-60">{count}</span>
    </button>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-900/10 bg-vellum-50 p-4 transition-transform dark:border-vellum-100/10 dark:bg-ink-900 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-700/50 dark:text-vellum-100/40">
          Shelves
        </p>
        <nav className="flex flex-col gap-0.5">
          <Item
            label="All prompts"
            active={activeCategory === "All" && !favoritesOnly}
            count={countFor("All")}
            onClick={() => {
              setActiveCategory("All");
              setFavoritesOnly(false);
            }}
          />
          <Item
            label="★ Favorites"
            active={favoritesOnly}
            count={prompts.filter((p) => p.isFavorite).length}
            onClick={() => setFavoritesOnly((v) => !v)}
          />
        </nav>

        <div className="catalog-divider my-4 text-ink-900 dark:text-vellum-100" />

        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-700/50 dark:text-vellum-100/40">
          Categories
        </p>
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => (
            <Item
              key={cat}
              label={cat}
              active={activeCategory === cat && !favoritesOnly}
              count={countFor(cat)}
              onClick={() => {
                setActiveCategory(cat);
                setFavoritesOnly(false);
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

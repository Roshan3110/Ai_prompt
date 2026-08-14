import React from "react";
import { usePrompts } from "../context/PromptContext.jsx";

function StatCard({ label, value, index }) {
  return (
    <div className="relative rounded-sm border border-ink-900/10 bg-vellum-100/50 p-4 shadow-card dark:border-vellum-100/10 dark:bg-ink-800/50">
      <span className="absolute right-3 top-3 font-mono text-[10px] text-ink-700/40 dark:text-vellum-100/30">
        {index}
      </span>
      <p className="font-display text-3xl leading-none text-ink-900 dark:text-vellum-50">
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-700/60 dark:text-vellum-100/50">
        {label}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { stats } = usePrompts();

  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total prompts" value={stats.total} index="01" />
        <StatCard label="Favorites" value={stats.favorites} index="02" />
        <StatCard label="Categories used" value={stats.categories} index="03" />
        <StatCard label="Added this week" value={stats.recent.length} index="04" />
      </div>
    </section>
  );
}

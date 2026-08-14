import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SearchBar from "./components/SearchBar.jsx";
import PromptGrid from "./components/PromptGrid.jsx";
import PromptFormModal from "./components/PromptFormModal.jsx";
import PromptDetailsModal from "./components/PromptDetailsModal.jsx";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog.jsx";
import { usePrompts } from "./context/PromptContext.jsx";

export default function App() {
  const { deletePrompt } = usePrompts();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingPrompt, setViewingPrompt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditingPrompt(null);
    setFormOpen(true);
  };

  const openEdit = (prompt) => {
    setViewingPrompt(null);
    setEditingPrompt(prompt);
    setFormOpen(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onAddNew={openCreate} />

        <button
          onClick={() => setSidebarOpen(true)}
          className="m-3 self-start rounded-sm border border-ink-900/15 px-3 py-1 font-mono text-xs lg:hidden dark:border-vellum-100/15"
        >
          ☰ Shelves
        </button>

        <main className="flex-1 px-5 py-6 sm:px-8">
          <Dashboard />
          <SearchBar />
          <PromptGrid
            onView={setViewingPrompt}
            onEdit={openEdit}
            onRequestDelete={setDeleteTarget}
          />
        </main>

        <footer className="border-t border-ink-900/10 px-8 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-ink-700/40 dark:border-vellum-100/10 dark:text-vellum-100/30">
          Index — a small library for prompts worth keeping
        </footer>
      </div>

      <PromptFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editingPrompt={editingPrompt}
      />

      <PromptDetailsModal
        prompt={viewingPrompt}
        onClose={() => setViewingPrompt(null)}
        onEdit={openEdit}
      />

      <DeleteConfirmDialog
        prompt={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={(id) => {
          deletePrompt(id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

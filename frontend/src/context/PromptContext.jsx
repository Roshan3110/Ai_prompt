import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { api } from "../utils/api.js";
import { useToast } from "./ToastContext.jsx";

const PromptContext = createContext(null);

function makeLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PromptProvider({ children }) {
  // localStorage is the persistence layer required by the brief and
  // also acts as an offline cache in front of the backend API.
  const [prompts, setPrompts] = useLocalStorage("prompt-library-prompts", []);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const { showToast } = useToast();

  // Initial load: try the backend first, fall back to whatever is
  // already cached in localStorage if the API is unreachable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getPrompts();
        if (!cancelled) {
          setPrompts(res.data);
          setIsOnline(true);
        }
      } catch (err) {
        if (!cancelled) {
          setIsOnline(false);
          showToast("Backend unreachable — working from local storage", "error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPrompt = useCallback(
    async (data) => {
      const payload = {
        title: data.title.trim(),
        content: data.content.trim(),
        category: data.category,
        tags: data.tags,
        description: data.description?.trim() || "",
        isFavorite: false,
        isPinned: false,
        order: 0,
      };
      try {
        if (isOnline) {
          const res = await api.createPrompt(payload);
          setPrompts((prev) => [res.data, ...prev]);
        } else {
          throw new Error("offline");
        }
      } catch {
        const local = {
          ...payload,
          _id: makeLocalId(),
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString(),
        };
        setPrompts((prev) => [local, ...prev]);
      }
      showToast("Prompt created");
    },
    [isOnline, setPrompts, showToast]
  );

  const updatePrompt = useCallback(
    async (id, data) => {
      const patch = { ...data, lastUpdatedDate: new Date().toISOString() };
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...patch } : p))
      );
      try {
        if (isOnline && !id.startsWith("local-")) {
          await api.updatePrompt(id, patch);
        }
      } catch {
        setIsOnline(false);
      }
      showToast("Prompt updated");
    },
    [isOnline, setPrompts, showToast]
  );

  const deletePrompt = useCallback(
    async (id) => {
      setPrompts((prev) => prev.filter((p) => p._id !== id));
      try {
        if (isOnline && !id.startsWith("local-")) {
          await api.deletePrompt(id);
        }
      } catch {
        setIsOnline(false);
      }
      showToast("Prompt deleted");
    },
    [isOnline, setPrompts, showToast]
  );

  const duplicatePrompt = useCallback(
    async (id) => {
      const source = prompts.find((p) => p._id === id);
      if (!source) return;
      const { _id, createdDate, lastUpdatedDate, ...rest } = source;
      await addPrompt({ ...rest, title: `${source.title} (copy)` });
    },
    [prompts, addPrompt]
  );

  const toggleFavorite = useCallback(
    (id) => {
      const target = prompts.find((p) => p._id === id);
      if (!target) return;
      updatePrompt(id, { isFavorite: !target.isFavorite });
    },
    [prompts, updatePrompt]
  );

  const togglePin = useCallback(
    (id) => {
      const target = prompts.find((p) => p._id === id);
      if (!target) return;
      updatePrompt(id, { isPinned: !target.isPinned });
    },
    [prompts, updatePrompt]
  );

  const copyToClipboard = useCallback(
    async (content) => {
      try {
        await navigator.clipboard.writeText(content);
        showToast("Copied to clipboard");
      } catch {
        showToast("Could not copy — please copy manually", "error");
      }
    },
    [showToast]
  );

  const reorderPrompts = useCallback(
    (orderedIds) => {
      setPrompts((prev) => {
        const byId = Object.fromEntries(prev.map((p) => [p._id, p]));
        const reordered = orderedIds
          .map((id, index) => byId[id] && { ...byId[id], order: index })
          .filter(Boolean);
        const rest = prev.filter((p) => !orderedIds.includes(p._id));
        return [...reordered, ...rest];
      });
      const items = orderedIds.map((id, index) => ({ id, order: index }));
      api.reorderPrompts(items).catch(() => setIsOnline(false));
    },
    [setPrompts]
  );

  const exportPrompts = useCallback(() => {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-library-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported prompts as JSON");
  }, [prompts, showToast]);

  const importPromptsFromFile = useCallback(
    async (file) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("JSON file must contain an array of prompts");
        }
        const valid = parsed.filter(
          (p) => p && typeof p.title === "string" && typeof p.content === "string"
        );
        if (valid.length === 0) {
          throw new Error("No valid prompts found in file");
        }
        const withIds = valid.map((p) => ({
          title: p.title,
          content: p.content,
          category: p.category || "Others",
          tags: Array.isArray(p.tags) ? p.tags : [],
          description: p.description || "",
          isFavorite: !!p.isFavorite,
          isPinned: !!p.isPinned,
          order: 0,
          _id: makeLocalId(),
          createdDate: new Date().toISOString(),
          lastUpdatedDate: new Date().toISOString(),
        }));
        setPrompts((prev) => [...withIds, ...prev]);
        showToast(`Imported ${withIds.length} prompt(s)`);
        if (isOnline) {
          api.importPrompts(valid).catch(() => {});
        }
      } catch (err) {
        showToast(err.message || "Import failed — check the file format", "error");
      }
    },
    [isOnline, setPrompts, showToast]
  );

  const filteredPrompts = useMemo(() => {
    let list = [...prompts];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (favoritesOnly) {
      list = list.filter((p) => p.isFavorite);
    }

    list.sort((a, b) => {
      if (!!b.isPinned - !!a.isPinned !== 0) return !!b.isPinned - !!a.isPinned;
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdDate) - new Date(b.createdDate);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        case "newest":
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

    return list;
  }, [prompts, searchTerm, activeCategory, favoritesOnly, sortBy]);

  const stats = useMemo(
    () => ({
      total: prompts.length,
      favorites: prompts.filter((p) => p.isFavorite).length,
      categories: new Set(prompts.map((p) => p.category)).size,
      recent: [...prompts]
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 5),
    }),
    [prompts]
  );

  const value = {
    prompts,
    filteredPrompts,
    isLoading,
    isOnline,
    stats,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    favoritesOnly,
    setFavoritesOnly,
    sortBy,
    setSortBy,
    addPrompt,
    updatePrompt,
    deletePrompt,
    duplicatePrompt,
    toggleFavorite,
    togglePin,
    copyToClipboard,
    reorderPrompts,
    exportPrompts,
    importPromptsFromFile,
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
}

export function usePrompts() {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error("usePrompts must be used within a PromptProvider");
  return ctx;
}

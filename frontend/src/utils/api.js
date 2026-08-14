

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
  }

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  getPrompts: (params = "") => request(`/prompts${params}`),
  getPrompt: (id) => request(`/prompts/${id}`),
  createPrompt: (data) =>
    request("/prompts", { method: "POST", body: JSON.stringify(data) }),
  updatePrompt: (id, data) =>
    request(`/prompts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePrompt: (id) => request(`/prompts/${id}`, { method: "DELETE" }),
  reorderPrompts: (items) =>
    request("/prompts/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    }),
  importPrompts: (prompts) =>
    request("/prompts/import", {
      method: "POST",
      body: JSON.stringify({ prompts }),
    }),
};

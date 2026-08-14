# Index — AI Prompt Library

A full-stack app for creating, organizing, searching, and managing reusable
AI prompts. React (JSX, no TypeScript) on the frontend, Express + MongoDB on
the backend.

## Stack

- **Frontend:** React 18 + Vite, plain JSX (no TypeScript), Tailwind CSS,
  Context API for state management
- **Backend:** Node.js + Express, Mongoose (MongoDB)
- **Persistence:** All prompts are cached in `localStorage` on the client
  (works offline) and are the source of truth via the backend REST API when
  it's reachable

## Folder structure

```
ai-prompt-library/
├── backend/
│   ├── config/db.js
│   ├── controllers/promptController.js
│   ├── models/Prompt.js
│   ├── routes/promptRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── constants/categories.js
        ├── context/
        │   ├── PromptContext.jsx      # all CRUD, filter, sort, import/export, reorder
        │   ├── ThemeContext.jsx       # dark/light mode, persisted
        │   └── ToastContext.jsx       # toast notifications
        ├── hooks/
        │   ├── useLocalStorage.js
        │   └── useDebounce.js
        ├── utils/api.js               # fetch wrapper for the backend API
        └── components/
            ├── Navbar.jsx
            ├── Sidebar.jsx
            ├── Dashboard.jsx
            ├── SearchBar.jsx
            ├── PromptGrid.jsx         # grid + native drag & drop reordering
            ├── PromptCard.jsx
            ├── PromptFormModal.jsx    # add / edit
            ├── PromptDetailsModal.jsx
            ├── DeleteConfirmDialog.jsx
            └── ThemeToggle.jsx
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI to your MongoDB connection string
# (a free Atlas cluster works fine: https://www.mongodb.com/atlas)
npm run dev
```

The API runs at `http://localhost:5000/api`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api, edit if needed
npm run dev
```

Open `http://localhost:5173`.

If the backend isn't reachable, the app still works fully from
`localStorage` — you'll see an "offline" badge in the navbar instead of
"synced".

## API endpoints

| Method | Endpoint                | Description                       |
|--------|--------------------------|------------------------------------|
| GET    | /api/prompts             | List prompts (`?search=&category=&favorite=&sort=`) |
| GET    | /api/prompts/:id         | Get one prompt                    |
| POST   | /api/prompts             | Create a prompt                   |
| PUT    | /api/prompts/:id         | Update a prompt                   |
| DELETE | /api/prompts/:id         | Delete a prompt                   |
| PATCH  | /api/prompts/reorder     | Bulk-update card order (drag & drop) |
| POST   | /api/prompts/import      | Bulk import from JSON             |

## Features implemented

- Dashboard: total prompts, favorites, categories used, recently added
- Every card supports: create / edit / delete (with confirmation) /
  duplicate, favorite / unfavorite, pin to top, copy to clipboard,
  drag & drop reordering
- Search by title & content, filter by category, filter favorites only,
  sort by newest / oldest / A→Z / Z→A
- Fixed 10-category list (Coding, Marketing, Content Writing, Email,
  Resume, SQL, Design, Social Media, Productivity, Others)
- Export all prompts to JSON, import from JSON with validation
- Dark / light theme toggle, persisted across reloads
- Context API for global state, no Redux dependency
- LocalStorage persistence + Express/MongoDB backend with full CRUD API

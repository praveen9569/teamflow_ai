# TeamFlow AI

> AI-powered project and task management platform for teams. Built with React, Node.js, Express, and MongoDB.

---

## Screenshots

| Dashboard | Kanban Board |
|---|---|
| Stats, charts, activity feed, AI tips | Drag-column task management |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS (v4 via `@tailwindcss/vite`)
- React Router v6
- Axios (with request/response interceptors)
- Recharts (bar chart, pie chart)
- React Hot Toast
- React Icons

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication (7-day expiry)
- bcryptjs for password hashing
- express-validator for input validation
- Morgan for HTTP request logging

---

## Features

### Authentication
- Register / Login with JWT
- Persistent sessions (localStorage)
- Protected routes — auto-redirect to login on 401

### Role-Based Access
| Action | Admin | Member |
|---|---|---|
| Create / Delete projects | ✅ | ❌ |
| Edit projects | ✅ | ❌ |
| Manage all tasks | ✅ | Own tasks only |
| View own projects | ✅ | ✅ |

### Dashboard
- Stats cards: total projects, completed/pending/overdue tasks
- Bar chart (task overview) and Pie chart (status breakdown)
- Recent activity feed
- AI productivity tips

### Project Management
- Create, edit, delete projects (admin only)
- Assign/remove team members
- Deadline tracking with progress bars
- Project status: active / on-hold / completed / archived
- Color-coded project cards

### Task Management
- Kanban board (To Do / In Progress / Done)
- List view alternative
- Filters: search, status, priority, project
- Create, edit, delete tasks
- Assign tasks to project members
- Due dates with overdue detection
- Tags support

### AI Features (mock — no external APIs)
- **Auto description generation** — keyword-based from task title
- **Priority suggestions** — based on due date proximity
- **Productivity tips** — curated advice shown on dashboard and task form

---

## Project Structure

```
projec_t/
├── client/                   # Vite + React frontend
│   └── src/
│       ├── components/       # Sidebar, TopBar, KanbanBoard, TaskCard, Modal, etc.
│       ├── context/          # AuthContext
│       ├── layouts/          # AppLayout, AuthLayout
│       ├── pages/            # Login, Signup, Dashboard, Projects, Tasks
│       ├── services/         # api.js + resource service modules
│       └── utils/            # helpers (dates, formatting)
└── server/                   # Express backend
    ├── controllers/          # authController, projectController, taskController, aiController
    ├── middleware/            # authenticate, authorize, validate, errorHandler
    ├── models/               # User, Project, Task
    ├── routes/               # auth, projects, tasks, ai, users
    ├── services/             # aiService (mock AI logic)
    └── utils/                # connectDB, jwt, response
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd projec_t
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Server starts on `http://localhost:5000`

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

Client starts on `http://localhost:5173`

API calls are proxied to `localhost:5000` via Vite's proxy config — no CORS issues in dev.

---

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamflow
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### `client/.env` (optional)

```env
VITE_APP_NAME=TeamFlow AI
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Yes | List user's projects |
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects/:id` | Yes | Get project details |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes (owner/admin) | Delete project |
| GET | `/api/projects/:id/stats` | Yes | Task stats for project |
| POST | `/api/projects/:id/members` | Yes | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Yes | Remove member |

### Tasks
| Method | Endpoint | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | `/api/tasks/dashboard` | Yes | — | Dashboard stats + recent activity |
| GET | `/api/tasks` | Yes | `projectId, status, priority, assignee, search, page, limit` | List tasks |
| POST | `/api/tasks` | Yes | — | Create task |
| GET | `/api/tasks/:id` | Yes | — | Get task |
| PUT | `/api/tasks/:id` | Yes | — | Update task |
| DELETE | `/api/tasks/:id` | Yes | — | Delete task |

### AI
| Method | Endpoint | Auth | Query Params | Description |
|---|---|---|---|---|
| GET | `/api/ai/task-description` | Yes | `title` | Generate task description |
| GET | `/api/ai/suggest-priority` | Yes | `dueDate, projectDeadline` | Suggest priority |
| GET | `/api/ai/productivity-tips` | Yes | — | Get 3 productivity tips |

---

## Deployment

### Backend (e.g. Railway / Render)
1. Set environment variables on the platform
2. Build command: (none — it's Node.js)
3. Start command: `node index.js`

### Frontend (e.g. Vercel / Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Add `VITE_API_URL` if your backend is on a different domain and update `api.js` `baseURL`

> **Important:** Update the Vite proxy (or Axios `baseURL`) to your deployed API URL before production build.

---

## License

MIT

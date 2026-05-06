TeamFlow AI
===========

A full-stack, AI-powered project and task management SaaS platform.

Tech Stack
----------
* Frontend: React 18, Vite, Tailwind CSS v3, React Router v6, Recharts
* Backend: Node.js, Express.js, MongoDB Atlas (Mongoose)
* Auth: JWT authentication with bcrypt password hashing
* Deployment: Vercel (Frontend) and Render (Backend)

Features
--------
1. Role-Based Access Control (Admin vs. Member)
2. Interactive Dashboard with Stats & Charts
3. Project Management (Create, assign members, track progress)
4. Task Management (Kanban Board, List View, Advanced Filters)
5. Mock AI Features (Auto-descriptions, Priority Suggestions, Productivity Tips)

Local Setup Instructions
------------------------

1. Prerequisites
   - Node.js 18+ installed
   - MongoDB running locally or a MongoDB Atlas connection string

2. Backend Setup
   - cd server
   - npm install
   - Create a `.env` file based on `.env.example`:
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/teamflow  (or your Atlas URI)
     JWT_SECRET=your_super_secret_key
     JWT_EXPIRES_IN=7d
     CLIENT_URL=http://localhost:5173
     NODE_ENV=development
   - npm run dev
   (Server will run on http://localhost:5000)

3. Frontend Setup
   - cd client
   - npm install
   - Create a `.env` file based on `.env.example`:
     VITE_APP_NAME="TeamFlow AI"
   - npm run dev
   (Frontend will run on http://localhost:5173)

Deployment
----------
* Backend (Render):
  - Set root directory to `server`
  - Build Command: `npm install`
  - Start Command: `node index.js`
  - Environment Variables: Add MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, and CLIENT_URL (pointing to your Vercel URL).

* Frontend (Vercel):
  - Set root directory to `client`
  - Environment Variables: Add VITE_API_URL pointing to your Render backend URL (e.g., https://your-backend.onrender.com)
  - Vercel automatically uses `vercel.json` for React Router support.

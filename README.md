# Task Manager

A small MERN task manager. You can add tasks, list them, edit the title and
description, tick them off, and delete them. Both tiers handle failure: the API
returns proper status codes, and the UI shows a readable message when a request
goes wrong.

## Stack

- **MongoDB** + Mongoose for storage and schema validation
- **Express** on **Node.js** for the REST API (ES modules)
- **React** via Vite on the frontend, function components and hooks
- Plain CSS, no UI framework

## Requirements

- Node.js 18+ (built on v22) and npm
- [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/)
  running locally

## Running it

**1. Start MongoDB.** On Windows it usually runs as a service already
(`net start MongoDB`); on macOS use `brew services start mongodb-community`, on
Linux `sudo systemctl start mongod`. You don't need to create anything by hand:
Mongoose makes the `taskmanager` database and `tasks` collection on the first write.

**2. Backend:**

```bash
cd backend
npm install
cp .env.example .env   # PowerShell: copy .env.example .env
npm run dev
```

You should see `MongoDB connected: ...` and then `API listening on http://localhost:5000`.

**3. Frontend**, in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to port 5000, so there's nothing
else to configure.

## Environment variables

Only the backend needs them, in `backend/.env`:

| Variable      | Required | Default                                 | Notes                                                                |
| ------------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `MONGODB_URI` | Yes      | `mongodb://127.0.0.1:27017/taskmanager` | Connection string. The server exits at startup if it's missing.      |
| `PORT`        | No       | `5000`                                  | Change it and update the proxy in `frontend/vite.config.js` to match. |

## API

Base URL: `http://localhost:5000`

- `GET /api/tasks` — all tasks, newest first. `200`.
- `GET /api/tasks/:id` — one task. `200`, or `400` for a bad id and `404` if it's missing.
- `POST /api/tasks` — create a task. `201`, or `400` if the title is missing or blank.
- `PUT /api/tasks/:id` — update the title, description, or done state. `200`, or `400` for a bad id or body and `404` if it's missing.
- `DELETE /api/tasks/:id` — delete a task. `200`, or `400` for a bad id and `404` if it's missing.

A task looks like this:

```json
{
  "id": "6798b1f4c2a1d3e4f5a6b7c8",
  "title": "Write the README",
  "description": "Cover setup, stack, and env vars",
  "is_completed": false,
  "createdAt": "2026-08-13T02:31:16.482Z",
  "updatedAt": "2026-08-13T02:31:16.482Z"
}
```

`title` is required, `description` defaults to `""`, `is_completed` to `false`.
Errors come back as `{ "error": "message" }`.

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"2 litres"}'
```

## Layout

```
backend/src/
  config/db.js                  MongoDB connection
  models/Task.js                Mongoose schema
  controllers/taskController.js Handlers for the five endpoints
  routes/tasks.js               Routes
  middleware/errorHandler.js    404 + central error handling
  app.js, index.js              App assembly and entry point
frontend/src/
  api/tasks.js                  Fetch wrapper
  components/                   TaskForm, TaskList, TaskItem, ErrorBanner
  App.jsx                       State and handlers
  index.css                     Styling
```

## AI assistance

I used Claude Code on this project to turn the PRD into an implementation plan
with a traceability table, scaffold the backend and frontend, work through
error-handling edge cases (validating `:id` before hitting MongoDB so a bad id
returns `400` instead of a `CastError` becoming a `500`), and exercise every
endpoint and error path once it was done.

I picked the structure and conventions, reviewed the generated code, and tested
the app end to end before committing.

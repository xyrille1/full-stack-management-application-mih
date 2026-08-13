# Full-Stack Task Management Application

A simple task manager built on the MERN stack. It supports full CRUD: create tasks,
view them in a list, edit their details, mark them complete or incomplete, and delete
them. Errors are handled on both tiers — the API returns appropriate HTTP status
codes, and the UI surfaces a readable message when a request fails.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Database | **MongoDB** with Mongoose | Document store; Mongoose supplies the `Task` schema and validation |
| Backend | **Express** on **Node.js** | RESTful JSON API, ES modules |
| Frontend | **React** (via Vite) | Function components with hooks; Vite for the dev server and build |
| Styling | Hand-written CSS | No UI framework — the brief calls for basic styling and functional focus |

The stack is MERN as required: **M**ongoDB, **E**xpress, **R**eact, **N**ode.js.

## Prerequisites

- **Node.js 18+** (developed on v22) and npm
- **MongoDB Community Server** running locally — [installation guide](https://www.mongodb.com/docs/manual/administration/install-community/)

## Setup and Run

Three things need to be running: the database, the backend, then the frontend.

### 1. Database

Start MongoDB if it is not already running.

- **Windows** — MongoDB usually installs as a service that starts automatically.
  Verify with `sc query MongoDB`, or start it with:
  ```bash
  net start MongoDB
  ```
- **macOS (Homebrew)**
  ```bash
  brew services start mongodb-community
  ```
- **Linux (systemd)**
  ```bash
  sudo systemctl start mongod
  ```

No manual database or collection creation is needed — Mongoose creates the
`taskmanager` database and `tasks` collection on first write.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env    # Windows PowerShell: copy .env.example .env
npm run dev
```

The API starts on **http://localhost:5000**. You should see `MongoDB connected: ...`
followed by `API listening on http://localhost:5000`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` requests through
to the backend on port 5000, so no additional configuration is required.

## Environment Variables

Backend only, in `backend/.env` (copy from `backend/.env.example`):

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/taskmanager` | MongoDB connection string. The server exits on startup if this is missing. |
| `PORT` | No | `5000` | Port the API listens on. If you change it, update the proxy target in `frontend/vite.config.js`. |

The frontend needs no environment variables; it calls the API using relative
`/api` paths resolved by the Vite proxy.

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Success | Errors |
|---|---|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks (newest first) | `200` | — |
| GET | `/api/tasks/:id` | Retrieve a single task by ID | `200` | `400` malformed id, `404` not found |
| POST | `/api/tasks` | Create a new task | `201` | `400` missing or blank title |
| PUT | `/api/tasks/:id` | Update a task (toggle completion, edit title/description) | `200` | `400` malformed id or invalid body, `404` not found |
| DELETE | `/api/tasks/:id` | Delete a task | `200` | `400` malformed id, `404` not found |

### Task shape

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

`title` is required; `description` is optional and defaults to `""`; `is_completed`
defaults to `false`. Errors are returned as `{ "error": "message" }`.

### Example

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"2 litres"}'
```

## Project Structure

```
backend/
  src/
    config/db.js                  MongoDB connection
    models/Task.js                Mongoose schema
    controllers/taskController.js Request handlers for the five endpoints
    routes/tasks.js               Route definitions
    middleware/errorHandler.js    404 + central error handling
    app.js                        Express app assembly
    index.js                      Entry point
frontend/
  src/
    api/tasks.js                  Fetch wrapper for the API
    components/                   TaskForm, TaskList, TaskItem, ErrorBanner
    App.jsx                       State and handlers
    index.css                     Styling
```

## AI Assistance

I used **Claude (Claude Code)** to help build this project. Specifically, I used it to:

- Turn the requirements in `PRD.md` into a written implementation plan, including a
  traceability table mapping each requirement to where it is implemented, so nothing
  was missed.
- Scaffold the backend and frontend files, and write the initial implementation of
  the Express API, Mongoose model, and React components.
- Work through error-handling edge cases — for example, validating the `:id`
  parameter before querying MongoDB so a malformed id returns `400 Bad Request`
  instead of surfacing a `CastError` as a `500`.
- Verify the finished API by exercising every endpoint and error path.

I reviewed the generated code, chose the project structure and conventions, and
tested the application end-to-end before committing.

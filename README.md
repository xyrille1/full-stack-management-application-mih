# Full-Stack Task Manager

Add a task, edit it, mark it done, delete it. MongoDB and Mongoose for the
database, Express and Node for the API, React and Vite for the page, plain CSS
for the styling. If something goes wrong, the API answers with the right status
code and the page shows a plain message instead of failing silently.

## Before you start

You need Node.js 18 or newer (I used v22) and
[MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
installed and running.

## Running it

**1. Start MongoDB.** On Windows it usually starts on its own, otherwise run
`net start MongoDB`. On macOS use `brew services start mongodb-community`, on
Linux `sudo systemctl start mongod`. You don't need to set up the database
yourself, it's created the first time a task is saved.

**2. Start the API:**

```bash
cd backend
npm install
cp .env.example .env   # on Windows: copy .env.example .env
npm run dev
```

Wait for `API listening on http://localhost:5000`.

**3. Start the app** in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. It already knows to talk to the API on port 5000, so
nothing else to set up.

## Settings

Only the API needs them, in `backend/.env`:

- `MONGODB_URI` points at your database, `mongodb://127.0.0.1:27017/taskmanager`
  by default. The server won't start without it.
- `PORT` defaults to `5000`. If you change it, change the port in
  `frontend/vite.config.js` too.

## API

Everything lives under `http://localhost:5000`:

- `GET /api/tasks` gives you every task, newest first
- `GET /api/tasks/:id` gives you one task
- `POST /api/tasks` creates one and needs a title
- `PUT /api/tasks/:id` updates the title, description, or done state
- `DELETE /api/tasks/:id` deletes one

Creating returns `201`, everything else returns `200`. A bad id or a missing
title returns `400`, and a task that isn't there returns `404`. Failures come
back as `{ "error": "message" }`. A task looks like this:

```json
{
  "id": "6a7d38a74cf2d100226d14c0",
  "title": "Test",
  "description": "Mih full stack",
  "is_completed": false,
  "createdAt": "2026-08-13T03:23:19.623Z",
  "updatedAt": "2026-08-13T03:23:19.623Z"
}
```

Only the title is required. Description starts empty, tasks start unfinished.

## Files

```
backend/src/
  config/db.js                  connects to the database
  models/Task.js                what a task holds
  controllers/taskController.js the five endpoints
  routes/tasks.js               which URL runs what
  middleware/errorHandler.js    turns problems into clean responses
  app.js, index.js              puts it together and starts it
frontend/src/
  api/tasks.js                  calls the API
  components/                   TaskForm, TaskList, TaskItem, ErrorBanner
  App.jsx                       holds the tasks and the handlers
  index.css                     styling
```

## AI assistance

I used Claude Code to plan the work from the PRD, write the first version of the
files, sort out the error cases (like checking an id looks valid before asking
the database for it, so a junk id returns `400` rather than a server error), and
test every endpoint. I chose how the project is organised, read through
everything it wrote, and tested the app myself before committing.

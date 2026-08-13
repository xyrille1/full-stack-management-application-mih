import mongoose from 'mongoose';
import Task from '../models/Task.js';

/** Wraps an async handler so rejected promises reach the central error middleware. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Builds an Error carrying an HTTP status for the central error middleware. */
const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

/**
 * Rejects malformed ids with 400 before they reach Mongo. Without this a bad id
 * raises a CastError, which is a client mistake, not a server fault.
 */
const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError(400, `'${id}' is not a valid task id`);
  }
};

/** Titles must be a non-blank string whenever supplied. */
const normaliseTitle = (title) => {
  if (typeof title !== 'string' || title.trim() === '') {
    throw httpError(400, 'Title is required and must be a non-empty string');
  }
  return title.trim();
};

// GET /api/tasks - Retrieve a list of all tasks.
export const listTasks = asyncHandler(async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.status(200).json(tasks);
});

// GET /api/tasks/:id - Retrieve a single task by ID.
export const getTask = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const task = await Task.findById(req.params.id);
  if (!task) throw httpError(404, 'Task not found');

  res.status(200).json(task);
});

// POST /api/tasks - Create a new task.
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, is_completed } = req.body ?? {};

  const task = await Task.create({
    title: normaliseTitle(title),
    description: typeof description === 'string' ? description.trim() : '',
    is_completed: typeof is_completed === 'boolean' ? is_completed : false,
  });

  res.status(201).json(task);
});

// PUT /api/tasks/:id - Update an existing task (mark as completed, edit title, ...).
export const updateTask = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const { title, description, is_completed } = req.body ?? {};
  const updates = {};

  // Only whitelisted fields are applied, so a checkbox toggle and a full edit
  // can share this one endpoint without either clobbering unrelated fields.
  if (title !== undefined) updates.title = normaliseTitle(title);

  if (description !== undefined) {
    if (typeof description !== 'string') {
      throw httpError(400, 'Description must be a string');
    }
    updates.description = description.trim();
  }

  if (is_completed !== undefined) {
    if (typeof is_completed !== 'boolean') {
      throw httpError(400, 'is_completed must be a boolean');
    }
    updates.is_completed = is_completed;
  }

  if (Object.keys(updates).length === 0) {
    throw httpError(400, 'Provide at least one of: title, description, is_completed');
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!task) throw httpError(404, 'Task not found');

  res.status(200).json(task);
});

// DELETE /api/tasks/:id - Delete a task.
export const deleteTask = asyncHandler(async (req, res) => {
  assertValidId(req.params.id);

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw httpError(404, 'Task not found');

  res.status(200).json({ message: 'Task deleted', id: req.params.id });
});

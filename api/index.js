import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

/**
 * Serverless entry point for Vercel.
 *
 * backend/src/index.js is the local equivalent, but it calls app.listen() and
 * kills the process when the database is unreachable. Neither works here:
 * there is no long-lived server to listen on, and exiting takes down the whole
 * invocation instead of answering the request. So this file does the same two
 * jobs - connect, then hand the request to Express - in a shape serverless can
 * live with, while sharing the connection logic with local development.
 *
 * connectDB is imported rather than reimplemented on purpose: it must run on
 * the same mongoose instance the models registered themselves on, or queries
 * quietly wait on a connection that was never opened.
 */

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    // Same { error } shape the rest of the API uses, so the frontend's existing
    // error handling reads it without a special case. Written with the plain
    // Node response API rather than res.status().json(), which is sugar Vercel
    // adds and nothing else does.
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Database unavailable: ${err.message}` }));
    return;
  }

  // Every /api/* request is rewritten to this one function (see vercel.json),
  // while the Express routes are mounted on their full paths (/api/tasks). The
  // rewrite normally leaves req.url alone, but restore the prefix if it was
  // stripped - otherwise Express matches nothing and answers 404.
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url === '/' ? '' : req.url}`;
  }

  return app(req, res);
}

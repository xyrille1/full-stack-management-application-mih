import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect first: the API should not accept traffic without a database behind it.
await connectDB();

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

/**
 * A failed bind arrives as an 'error' event. Left unhandled, Node rethrows it as
 * an unhandled 'error' event and prints a stack trace, which buries the one line
 * that actually tells you what to do about it.
 */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use.\n\n` +
        `Another process is listening on it - often an earlier instance of this\n` +
        `server that was not shut down. Either stop it, or set a different PORT\n` +
        `in backend/.env (then update the proxy target in frontend/vite.config.js\n` +
        `to match).\n\n` +
        `  Windows:  netstat -ano | findstr :${PORT}   then  taskkill /PID <pid> /F\n` +
        `  macOS/Linux:  lsof -ti:${PORT} | xargs kill\n`
    );
  } else if (err.code === 'EACCES') {
    console.error(
      `\nNot permitted to bind port ${PORT}. Ports below 1024 need elevated\n` +
        `privileges - set a higher PORT in backend/.env.\n`
    );
  } else {
    console.error(`\nFailed to start the server: ${err.message}\n`);
  }

  process.exit(1);
});

import mongoose from 'mongoose';

/**
 * The in-flight connection, cached at module scope.
 *
 * Locally this is called once at startup and the cache never earns its keep.
 * On a serverless host it does: instances are frozen and reused between
 * requests, so without this every request would open a new connection and the
 * database would start refusing them once the limit is reached.
 */
let connecting = null;

/**
 * Connect to MongoDB, reusing an existing connection when there is one.
 *
 * Throws rather than exiting, so the caller decides what a failure means - a
 * dead process locally, a 503 on a serverless host.
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connecting) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    connecting = mongoose
      .connect(uri, {
        // The 30s default outlives a serverless function's own timeout, which
        // turns a bad connection string into a blank gateway error instead of
        // a message that names the problem.
        serverSelectionTimeoutMS: 8000,
        // Without this a query issued while disconnected sits in a buffer and
        // fails much later, far from the cause.
        bufferCommands: false,
      })
      .catch((err) => {
        // Drop the cache so the next call retries instead of replaying this
        // rejection for the life of the instance.
        connecting = null;
        throw err;
      });
  }

  const { connection } = await connecting;
  return connection;
};

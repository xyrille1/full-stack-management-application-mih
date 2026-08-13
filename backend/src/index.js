import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect first: the API should not accept traffic without a database behind it.
await connectDB();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

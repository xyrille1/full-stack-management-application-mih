import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

// Must stay last: everything unmatched falls through to 404, then the handler.
app.use(notFound);
app.use(errorHandler);

export default app;

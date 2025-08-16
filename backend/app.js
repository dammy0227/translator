import express from "express";
import cors from "cors";
import morgan from "morgan";

import languagesRoute from "./routes/languages.js";
import translateRoute from "./routes/translate.js";

const app = express();

// ✅ Allow both local dev & deployed frontend
app.use(cors({
  origin: [
    "https://translator-beige-mu.vercel.app", // Vercel frontend
    "http://localhost:5173"                   // Local dev
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/languages", languagesRoute);
app.use("/api/translate", translateRoute);

// 404 fallback
app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.originalUrl}` }));

export default app;

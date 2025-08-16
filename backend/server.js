import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "https://translator-beige-mu.vercel.app", // your frontend on Vercel
    "http://localhost:5173"                   // allow local dev
  ],
  methods: ["GET", "POST"],
}));

app.use(express.json());

export default app;

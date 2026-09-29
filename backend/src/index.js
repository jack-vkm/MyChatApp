import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
    
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());

// Health Routes
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "MyChatApp Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
  });
});

// Serve React Frontend (if build exists)
const frontendDistPath = path.join(__dirname, "../../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Express 5 compatible SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
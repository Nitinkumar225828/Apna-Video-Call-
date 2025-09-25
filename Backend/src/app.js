// app.js  (Backend entry point)

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import connectSocketServer from "./controllers/socketManager.js";
import userRouters from "./routers/users.routers.js";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

const app = express();

// ✅ Configure CORS to allow only your frontend origin in production
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // set CLIENT_URL in .env for production
  })
);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Create HTTP server and attach Socket.IO
const server = createServer(app);
connectSocketServer(server);

// API routes
app.use("/api/v1/users", userRouters);

// Simple health check route
app.get("/home", (req, res) => {
  res.send("Hello World");
});

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Start server only after successful DB connection
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

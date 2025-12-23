import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { initSocket } from "./realtime/socket.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

/* ---------- middleware ---------- */
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://https://saas-notes-app-gray.vercel.app/", // ✅ 必须是这个
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- socket ---------- */
app.set("io", io);

/* ---------- routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/health", (req, res) => {
  res.send("OK");
});

/* ---------- error handler ---------- */
app.use(globalErrorHandler);

/* ---------- start ---------- */
const PORT = process.env.PORT || 8080;

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

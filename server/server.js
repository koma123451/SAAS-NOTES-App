import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { initSocket } from "./realtime/socket.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import adminRoutes from './routes/admin.routes.js'
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

/* ---------- middleware ---------- */
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://saas-notes-app-gray.vercel.app", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "https://saas-notes-app-gray.vercel.app"
      ];
      
      const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);
      
      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);


/* ---------- socket ---------- */
app.set("io", io);

/* ---------- routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/admin",adminRoutes)
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

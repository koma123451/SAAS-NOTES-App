import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

export function createApp() {
  const app = express();

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
        const isAllowed =
          allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);
        return callback(null, isAllowed);
      },
      credentials: true,
    })
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/notes", noteRoutes);
  app.use("/api/admin", adminRoutes);

  app.get("/api/health", (req, res) => res.send("OK"));

  app.use(globalErrorHandler);

  return app;
}
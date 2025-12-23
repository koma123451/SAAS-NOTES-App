import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'
import http from "http";
import { initSocket } from "./realtime/socket.js";
import authRoutes from './routes/auth.routes.js'
import noteRoutes from './routes/note.routes.js'
import cors from 'cors';
import cookieParser from "cookie-parser";
import {globalErrorHandler} from './middleware/globalErrorHandler.js'
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = initSocket(server)
app.use(express.json())
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://black-yellow-eta.vercel.app"  // ← Frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.set("io",io)
app.use("/api/auth",authRoutes)
app.use("/api/notes",noteRoutes)
app.get("/api/health", (req, res) => {
  res.send("OK");
});

app.use(globalErrorHandler);
const PORT=process.env.PORT||8080
//connect DB
connectDB()

//Listener
server.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
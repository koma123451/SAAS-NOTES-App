import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import noteRoutes from './routes/note.routes.js'
import cors from 'cors';
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
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
app.use("/api/auth",authRoutes)
app.use("/api/notes",noteRoutes)
const PORT=process.env.PORT||8080
//connect DB
connectDB()

//Listener
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
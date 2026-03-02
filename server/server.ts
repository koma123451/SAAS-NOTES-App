import "dotenv/config";
import http from "http";

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./realtime/socket.js";

process.on("uncaughtException", (err) => console.error("🔥 uncaughtException:", err));
process.on("unhandledRejection", (reason) => console.error("🔥 unhandledRejection:", reason));

// 只在非 test 环境做强制 env 校验
if (process.env.NODE_ENV !== "test") {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }
}

const PORT = process.env.PORT || 8080;

async function startServer() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  const io = initSocket(server);
  app.set("io", io);

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
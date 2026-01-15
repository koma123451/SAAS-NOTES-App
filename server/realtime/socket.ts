import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export function initSocket(server: HTTPServer) {
  console.log("🟡 initSocket called");

  const io = new IOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://saas-notes-app-gray.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
}

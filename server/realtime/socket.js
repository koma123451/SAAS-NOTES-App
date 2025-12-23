import { Server } from "socket.io";

export function initSocket(server) {
  console.log("🟡 initSocket called");

  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://saas-notes-app-gray.vercel.app/", // ✅ 和 server.js 完全一致
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

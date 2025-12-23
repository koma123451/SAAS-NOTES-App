import { io } from "socket.io-client";
import { useNoteStore } from "../store/note.js";

const API_URL = import.meta.env.VITE_API_URL;
// https://xxx.up.railway.app/api

const SOCKET_URL = API_URL.replace("/api", "");
// https://xxx.up.railway.app

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

/* ---------- debug ---------- */
socket.on("connect", () => {
  console.log("🟢 socket connected (client)", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ socket disconnected (client)", reason);
});

socket.on("connect_error", (err) => {
  console.log("🔴 socket connect error", err.message);
});

socket.on("note:created", () => {
  useNoteStore.getState().getNotes();
});

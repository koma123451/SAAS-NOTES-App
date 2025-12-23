import { io } from "socket.io-client";
import {useNoteStore} from '../store/note.js'
// ⚠️ 一定要和后端 server.listen 的端口一致
const SOCKET_URL = "http://localhost:8080";

// 创建 socket 连接（一加载文件就会执行）
export const socket = io(SOCKET_URL, {
  withCredentials: true, // 允许携带 cookie（后面鉴权会用）
  transports: ["websocket"], // 强制用 websocket，避免降级干扰理解
});

// ===== 调试用监听 =====
socket.on("connect", () => {
  console.log("🟢 socket connected (client)", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ socket disconnected (client)", reason);
});

socket.on("connect_error", (err) => {
  console.log("🔴 socket connect error", err.message);
});

socket.on("note:created",()=>{
  useNoteStore.getState().getNotes();
 
})

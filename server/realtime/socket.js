import {Server} from "socket.io"

export function initSocket(server){
    console.log("🟡 initSocket called");
  const io = new Server(server,{
    cors:{
      origin: ["http://localhost:5173",
              "https://black-yellow-eta.vercel.app"],  // ← Frontend
      credentials:true        
            },
  });
  io.on("connection",(socket)=>{
    console.log("Socket connected");
    socket.on("disconnect",()=>{
      console.log(" Socket disconnected")
    })
  })

  return io;
}
import { io } from "socket.io-client";

let socket = null;

export function connectSocket(host, port) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(`http://${host}:${port}`, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  return socket;
}

export function getSocket() {
  return socket;
}
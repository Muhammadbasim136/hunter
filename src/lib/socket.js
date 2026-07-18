import { io } from "socket.io-client";
import { API_BASE_URL, getToken } from "./api";

let socket = null;

function socketsEnabled() {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_SOCKET === "true";
}

/** Lazily creates (or returns) the shared, authenticated socket connection. */
export function getSocket() {
  if (!socketsEnabled()) return null;
  if (socket) return socket;

  socket = io(API_BASE_URL, {
    autoConnect: false,
    auth: (cb) => cb({ token: getToken() }),
  });

  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (s && !s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
}

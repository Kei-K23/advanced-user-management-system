import { io } from "socket.io-client";

export const setupSocket = (token) => {
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
    auth: {
      token: `Bearer ${token}`,
    },
    autoConnect: false,
  });

  return socket;
};

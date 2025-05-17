import { io } from "socket.io-client";

export const setupSocket = (token) => {
  const socket = io("http://localhost:3000", {
    auth: {
      token: `Bearer ${token}`,
    },
    autoConnect: false,
  });

  return socket;
};

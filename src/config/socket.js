import { Server } from "socket.io";
import SessionService from "../services/sessionService.js";
import socketAuth from "../middleware/socketAuth.js";

let io;

export default class Socket {
  static init(httpServer) {
    io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
      console.log(
        `New socket connection: ${socket.id} for user ${socket.user.id}`
      );

      // Update session with socket ID
      SessionService.updateSocketId(socket.user.id, socket.id);

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    return io;
  }

  static getIO() {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
}

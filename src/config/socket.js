import { Server } from "socket.io";
import SessionService from "../services/sessionService.js";
import socketAuth from "../middleware/socketAuth.js";
import User from "../models/User.js";
import Session from "../models/Session.js";

let io;

export default class Socket {
  static init(httpServer) {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.use(socketAuth);

    io.on("connection", async (socket) => {
      console.log(
        `New socket connection: ${socket?.id} for user ${socket?.user?.id} from device - ${socket?.session?.deviceInfo?.device} - OS ${socket?.session?.deviceInfo?.os}`
      );

      // Update session with socket ID
      await SessionService.updateSocketId(
        socket.user.id,
        socket.id,
        socket?.session?.deviceInfo?.device
      );

      const updatedUser = await User.findByIdAndUpdate(
        socket?.user?.id,
        {
          isOnline: true,
        },
        { new: true, runValidators: true }
      );

      if (updatedUser?.role === "MEMBER") {
        const admins = await User.find({
          role: { $in: ["ADMIN", "SUPER_ADMIN"] },
        });

        const adminIds = admins.map((admin) => admin._id);

        const activeSessions = await Session.find({
          user: { $in: adminIds },
          active: true,
        });

        activeSessions.forEach(async (session) => {
          io.to(session.socketId).emit("notify_event", {
            message: "Notify to update users list",
          });
        });
      }

      socket.on("disconnect", async () => {
        console.log(`Socket disconnected: ${socket.id}`);

        const updatedUser = await User.findByIdAndUpdate(
          socket?.user?.id,
          {
            isOnline: false,
          },
          { new: true, runValidators: true }
        );

        if (updatedUser?.role === "MEMBER") {
          const admins = await User.find({
            role: { $in: ["ADMIN", "SUPER_ADMIN"] },
          });

          const adminIds = admins.map((admin) => admin._id);

          const activeSessions = await Session.find({
            user: { $in: adminIds },
            active: true,
          });

          activeSessions.forEach(async (session) => {
            io.to(session.socketId).emit("notify_event", {
              message: "Notify to update users list",
            });
          });
        }
      });
    });

    io.engine.on("connection_error", (err) => {
      console.log(err.req); // the request object
      console.log(err.code); // the error code, for example 1
      console.log(err.message); // the error message, for example "Session ID unknown"
      console.log(err.context); // some additional error context
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

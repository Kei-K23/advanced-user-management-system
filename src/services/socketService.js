import Session from "../models/Session.js";
import Socket from "../config/socket.js";
import User from "../models/User.js";

export default class SocketService {
  static async notifyUserLoggedOut(
    userId,
    userRole,
    currentSessionId,
    currentDevice
  ) {
    const io = Socket.getIO();

    // Find all active sessions except the current one
    const sessions = await Session.find({
      user: userId,
      active: true,
      "deviceInfo.device": currentDevice,
      _id: { $ne: currentSessionId },
      socketId: { $exists: true },
    });

    // Notify each session to logout
    sessions.forEach(async (session) => {
      io.to(session.socketId).emit("force_logout", {
        message: "You have been logged out from another device",
      });

      // Invalidate the session
      await Session.updateOne(
        { _id: session._id },
        { $set: { active: false } }
      );
    });

    // Check login user is member and them send notifi event to super admin user
    if (userRole === "MEMBER") {
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
  }

  static async notifyUserForceLoggedOut(userId) {
    const io = Socket.getIO();

    // Find all active sessions except the current one
    const sessions = await Session.find({
      user: userId,
      active: true,
      socketId: { $exists: true },
    });

    // Notify each session to logout
    sessions.forEach(async (session) => {
      io.to(session.socketId).emit("ban_force_logout", {
        message: "You have been logged out due to your account is banned",
      });

      // Invalidate the session
      await Session.updateOne(
        { _id: session._id },
        { $set: { active: false } }
      );
    });
  }
}

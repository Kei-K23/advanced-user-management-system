import Session from "../models/Session.js";
import Socket from "../config/socket.js";

class SocketService {
  static async updateSocketId(userId, socketId) {
    await Session.updateOne(
      { user: userId, active: true },
      { $set: { socketId } }
    );
  }

  static async notifyUserLoggedOut(userId, currentSessionId) {
    const io = Socket.getIO();

    // Find all active sessions except the current one
    const sessions = await Session.find({
      user: userId,
      active: true,
      _id: { $ne: currentSessionId },
      socketId: { $exists: true },
    });

    // Notify each session to logout
    sessions.forEach((session) => {
      io.to(session.socketId).emit("force_logout", {
        message: "You have been logged out from another device",
      });

      // Invalidate the session
      Session.updateOne({ _id: session._id }, { $set: { active: false } });
    });
  }
}

module.exports = SocketService;

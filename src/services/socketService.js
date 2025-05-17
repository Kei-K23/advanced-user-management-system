import Session from "../models/Session.js";
import Socket from "../config/socket.js";

export default class SocketService {
  static async notifyUserLoggedOut(userId, currentSessionId, currentDevice) {
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
  }
}

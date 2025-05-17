import Session from "../models/Session.js";
import AppError from "../utils/appError.js";

export default class SessionService {
  static async createSession(user, deviceInfo, token, expiresAt) {
    // Create new session
    const session = await Session.create({
      user: user._id,
      token,
      deviceInfo,
      expiresAt,
    });

    return session;
  }

  static async invalidateSession(token) {
    const session = await Session.findOneAndUpdate(
      { token, active: true },
      { $set: { active: false } },
      { new: true }
    );

    if (!session) {
      throw new AppError("No active session found with this token", 404);
    }

    return session;
  }

  static async getUserActiveSession(userId) {
    return await Session.findOne({ user: userId, active: true });
  }

  static async invalidateAllSessions(userId) {
    return await Session.updateMany(
      { user: userId, active: true },
      { $set: { active: false } }
    );
  }

  static async updateSocketId(userId, socketId, device) {
    return await Session.updateOne(
      { user: userId, "deviceInfo.device": device, active: true },
      { $set: { socketId } }
    );
  }
}

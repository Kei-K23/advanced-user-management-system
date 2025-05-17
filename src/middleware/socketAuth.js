import "dotenv/config";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import AppError from "../utils/appError.js";

export default async (socket, next) => {
  try {
    // 1) Get token from handshake
    const rawToken = socket.handshake.auth?.token;
    const token = rawToken.split(" ")[1];

    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if session is still active
    const session = await Session.findOne({
      token,
      user: decoded.id,
      active: true,
    });

    if (!session) {
      return next(new AppError("Invalid session", 401));
    }

    // Attach user and session to socket
    socket.user = { id: decoded.id };
    socket.session = session;

    next();
  } catch (err) {
    next(err);
  }
};

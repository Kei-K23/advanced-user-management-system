import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import SocketService from "../services/socketService.js";
import Session from "../models/Session.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const authUser = req.user;

  // Step 1: Get all users except the auth user
  const users = await User.find({
    _id: { $ne: authUser._id },
  }).lean();

  // Step 2: Fetch active sessions for those users
  const userIds = users.map((user) => user._id);

  const sessions = await Session.find({
    user: { $in: userIds },
    active: true,
  })
    .select("-token") // exclude token for security
    .lean();

  // Step 3: Group sessions by user ID
  const sessionMap = {};
  sessions.forEach((session) => {
    const uid = session.user.toString();
    if (!sessionMap[uid]) sessionMap[uid] = [];
    sessionMap[uid].push(session);
  });

  // Step 4: Add sessions to each user
  const usersWithSessions = users.map((user) => ({
    ...user,
    sessions: sessionMap[user._id.toString()] || [],
  }));

  successResponse(res, usersWithSessions, "Get all users with sessions", 200);
});

export const banUserById = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const bannedUser = await User.findByIdAndUpdate(
    userId,
    {
      accountStatus: "BAN",
    },
    { new: true }
  );

  if (!bannedUser) {
    return next(new AppError("User not found!", 404));
  }

  await SocketService.notifyUserForceLoggedOut(bannedUser._id);

  successResponse(res, null, "User banned successful", 200);
});

import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import SocketService from "../services/socketService.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const authUser = req.user;

  const users = await User.find({
    _id: {
      $ne: authUser._id,
    },
  }).lean();

  successResponse(res, users, "Get all users", 200);
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

import User from "../models/User.js";
import { successResponse } from "../utils/apiResponse.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const authUser = req.user;

  const users = await User.find({
    _id: {
      $ne: authUser._id,
    },
  }).lean();

  successResponse(res, users, "Get all users", 200);
});

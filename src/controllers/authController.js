import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SessionService from "../services/sessionService.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { successResponse } from "../utils/apiResponse.js";
import UserService from "../services/userService.js";
import SocketService from "../services/socketService.js";

const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const expiresIn = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expiresIn);

  // Get device info
  const deviceInfo = {
    browser: req.useragent.browser,
    os: req.useragent.os,
    device: req.useragent.isMobile
      ? "Mobile"
      : req.useragent.isDesktop
      ? "Desktop"
      : "Other",
    ip: req.ip,
  };

  // Create session
  const newSession = await SessionService.createSession(
    user,
    deviceInfo,
    token,
    expiresAt
  );

  await SocketService.notifyUserLoggedOut(user._id, newSession._id);

  // Remove password from output
  user.password = undefined;

  successResponse(res, { user, token }, "Logged in successfully", statusCode);
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email,
    accountStatus: {
      $ne: "DELETE",
    },
  })?.select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

export const register = catchAsync(async (req, res, next) => {
  const { username, email, displayName, password: pass } = req.body;

  // 1) Check if email and password exist
  if (!email || !pass || !username || !displayName) {
    return next(
      new AppError(
        "Please provide username, display name, email and password!",
        400
      )
    );
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    return next(new AppError("User already exist", 400));
  }

  const { password, ...newUser } = (
    await UserService.createUser(username, displayName, email, pass)
  ).toJSON();

  successResponse(res, newUser, "Register successful", 201);
});

export const logout = catchAsync(async (req, res, _next) => {
  // Invalidate current session
  await SessionService.invalidateSession(req.session.token);

  successResponse(res, null, "Logged out successfully");
});

export const getMe = catchAsync(async (req, res, _next) => {
  const user = req.user;

  successResponse(res, user, "Get auth user");
});

export const updateMe = catchAsync(async (req, res, next) => {
  const authUser = req.user;
  const { username, displayName, email } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    return next(new AppError("Username or email already taken", 400));
  }

  const { password, ...updatedUser } = (
    await User.findByIdAndUpdate(
      authUser._id,
      {
        $set: {
          username,
          email,
          displayName,
        },
      },
      { new: true, runValidators: true }
    )
  ).toJSON();

  successResponse(res, updatedUser, "Successfully update the user");
});

export const deleteMe = catchAsync(async (req, res, _next) => {
  const authUser = req.user;

  await SessionService.invalidateAllSessions(authUser._id);

  const { password, ...deletedUser } = (
    await User.findByIdAndUpdate(
      authUser._id,
      {
        $set: {
          accountStatus: "DELETE",
        },
      },
      { new: true, runValidators: true }
    )
  ).toJSON();

  successResponse(res, deletedUser, "Successfully delete the user");
});

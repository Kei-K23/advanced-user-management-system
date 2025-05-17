import jwt from "jsonwebtoken";
import User from "../models/User.js";
const SessionService = require("../services/sessionService");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
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
  SessionService.createSession(user, deviceInfo, token, expiresAt);

  // Remove password from output
  user.password = undefined;

  successResponse(res, { user, token }, "Logged in successfully", statusCode);
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  // Invalidate current session
  await SessionService.invalidateSession(req.session.token);

  successResponse(res, null, "Logged out successfully");
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // 5) Check if session is still active
  const session = await Session.findOne({
    token,
    user: currentUser._id,
    active: true,
  });

  if (!session) {
    return next(
      new AppError("Your session has expired or been invalidated!", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  req.session = session;
  next();
});

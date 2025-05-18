import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import UserService from "../services/userService.js";

export const authenticate = catchAsync(async (req, _res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await UserService.findUserById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if session is still active
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

  // 6) Grant access to protected route
  req.user = currentUser;
  req.session = session;
  next();
});

export const checkRole = ({ roles }) =>
  catchAsync(async (req, _res, next) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }

    next();
  });

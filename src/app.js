import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import useragent from "express-useragent";
import morgan from "morgan";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import authRoutes from "./routes/authRoutes.js";
import { successResponse } from "./utils/apiResponse.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendDistPath = join(__dirname, "../frontend/dist");

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// User agent parser
app.use(useragent.express());

// Server Frontend public static files
app.use(express.static(frontendDistPath));

// 2) ROUTES
app.get("/api/health-check", (_req, res) => {
  successResponse(res, null, "Server is running healthily");
});
app.use("/api/v1/auth", authRoutes);

// For all other routes, send back index.html (React Router support)
app.get("/", (req, res) => {
  res.sendFile(join(frontendDistPath, "index.html"));
});

// 3) ERROR HANDLING
app.use((req, _res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);

export default app;

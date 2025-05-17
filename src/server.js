import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import Socket from "./config/socket.js";

// Connect to database
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("DB connection successful!");
});

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
Socket.init(server);

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

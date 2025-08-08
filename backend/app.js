import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
import { Server as SocketIO } from 'socket.io';import morgan from "morgan";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new SocketIO(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Routes - Update to ES6 import
import routes from "./routes/index.js";
app.use("/api", routes);
io.on('connection', (socket) => {
  socket.on('joinSession', ({ sessionId, role }) => {
    socket.join(sessionId);
  });

  socket.on('slideChange', ({ sessionId, slideIndex }) => {
    socket.to(sessionId).emit('slideChange', { slideIndex });
  });

  socket.on('disconnect', () => {});
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIO } from "socket.io";
import morgan from "morgan";
import { getAverageAttentionBySlide } from "./models/session.js";
import { leaveSession } from "./models/session.js";
import { updateCurrentPage } from "./models/slide.js";
dotenv.config();
import { endSession } from "./models/session.js";
import { avgAttentionLogs } from "./models/session.js";

const app = express();
const server = http.createServer(app);
export const io = new SocketIO(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Routes - Update to ES6 import
import routes from "./routes/index.js";
app.use("/api", routes);
io.on("connection", (socket) => {
  socket.on("joinSession", ({ sessionId, role, name, participantUuid }) => {
    socket.join(sessionId);
    if (role === "teacher") {
      socket.join(`teacher-session-${sessionId}`);
    }
    socket.to(`teacher-session-${sessionId}`).emit("newParticipant", {
      participantUuid: participantUuid,
      name,
      role,
    });

    socket.on(
      "leaveSession",
      async ({ sessionId, participantUuid, role, name }) => {
        await leaveSession(sessionId, participantUuid);
        io.to(sessionId).emit("participantLeft", { participantUuid, name });
        socket.leave(sessionId);
        if (role === "teacher") {
          socket.leave(`teacher-session-${sessionId}`);
        }
      }
    );
    socket.on(
      "attentionChange",
      ({ participantUuid, attention, sessionId }) => {
        io.to(`teacher-session-${sessionId}`).emit(
          "participantAttentionChange",
          { participantUuid, attention }
        );
      }
    );

    socket.on("endSession", async ({ sessionId }) => {
      await endSession(sessionId);
      io.to(sessionId).emit("sessionEnded");
      socket.leave(sessionId);
    });

    socket.on(
      "slideChange",
      async ({ sessionId, slideIndex, previousSlideIndex }) => {
        try {
          await updateCurrentPage(sessionId, slideIndex);
          socket.to(sessionId).emit("slideChange", { slideIndex });
          if (previousSlideIndex) {
            const { data } = await getAverageAttentionBySlide(
              sessionId,
              previousSlideIndex
            );
            io.to(`teacher-session-${sessionId}`).emit("pageAverageAttention", {
              page: previousSlideIndex,
              avgAttention: data.avg_score ?? null,
            });
            const avgAttention = data.avg_score ?? null;
            if (avgAttention) {
              await avgAttentionLogs(
                sessionId,
                previousSlideIndex,
                avgAttention
              );
            }
          }
        } catch (e) {
          console.error("updateCurrentPage error:", e.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

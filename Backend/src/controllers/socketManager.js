import { Server } from "socket.io";

const connections = {};
const messages = {};
const timeOnline = {};

/**
 * Initializes the Socket.IO server and sets up all real-time event handlers.
 * @param {import('http').Server} server
 */
export const connectSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*", // tighten this in production
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);

    // User joins a room
    socket.on("join-call", (path) => {
      if (!connections[path]) connections[path] = [];
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify all participants about the new user
      connections[path].forEach((participantId) => {
        io.to(participantId).emit("user-joined", socket.id, connections[path]);
      });

      // Send existing chat history to the new user
      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"]
          );
        });
      }
    });

    // Forward WebRTC signaling messages
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // Handle chat messages inside a room
    socket.on("chat-message", (data, sender) => {
      const roomKey = Object.entries(connections).find(([, ids]) =>
        ids.includes(socket.id)
      )?.[0];

      if (!roomKey) return;

      if (!messages[roomKey]) messages[roomKey] = [];

      messages[roomKey].push({
        sender,
        data,
        "socket-id-sender": socket.id,
      });

      connections[roomKey].forEach((id) => {
        io.to(id).emit("chat-message", data, sender, socket.id);
      });

      console.log("💬", roomKey, ":", sender, data);
    });

    // Clean up when user disconnects
    socket.on("disconnect", () => {
      const joinedAt = timeOnline[socket.id];
      const diffTime = joinedAt ? Math.abs(new Date() - joinedAt) : 0;
      console.log(`❎ Socket disconnected: ${socket.id} (online ${diffTime} ms)`);

      delete timeOnline[socket.id];

      for (const [roomKey, ids] of Object.entries(connections)) {
        if (ids.includes(socket.id)) {
          // Notify others in the room
          ids.forEach((id) => {
            io.to(id).emit("user-left", socket.id);
          });

          // Remove this socket from the room
          connections[roomKey] = ids.filter((id) => id !== socket.id);

          // Remove room if empty
          if (connections[roomKey].length === 0) {
            delete connections[roomKey];
          }

          break; // socket can only be in one room
        }
      }
    });
  });

  return io;
};

export default connectSocketServer;

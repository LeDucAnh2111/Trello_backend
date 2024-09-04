import ApiError from "@/uilt/ApiError";
import { WHITELIST_DOMAIN } from "@/uilt/constants";
import { StatusCodes } from "http-status-codes";
import socket from "socket.io";

let io;

const socket_connect = async (server) => {
  io = socket(server, {
    cors: {
      origin: "http://localhost:3001", // URL của client hoặc danh sách các URL cho phép
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    const origin = socket.handshake.headers.origin;
    if (WHITELIST_DOMAIN.includes(origin)) {
      return next();
    } else {
      return next(
        new ApiError(StatusCodes.SERVICE_UNAVAILABLE, "Socket not connected")
      );
    }
  });
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinBoard", (boardId) => {
      socket.join(boardId);
    });

    socket.on("leaveBoard", (boardId) => {
      socket.leave(boardId);
      console.log("user leaved successfully");
    });
  });
};

const get_socket = () => {
  if (!io) {
    throw new ApiError(StatusCodes.SERVICE_UNAVAILABLE, "Socket not connected");
  }
  return io;
};

export const config_socket = { socket_connect, get_socket };

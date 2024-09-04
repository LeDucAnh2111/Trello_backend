const { config_socket } = require("@/config/socketIo");

const ToRoom = (nameRoom, nameEvent, data) => {
  config_socket.get_socket().to(nameRoom).emit(nameEvent, data);
};

export const emitSocket = { ToRoom };

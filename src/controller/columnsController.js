import { config_socket } from "@/config/socketIo";
import { columnsService } from "@/services/columnService";
import ApiError from "@/uilt/ApiError";
import { emitSocket } from "@/uilt/emitSocket";
import { StatusCodes } from "http-status-codes";

const createColumn = async (req, res, next) => {
  try {
    const respone = await columnsService.createNew(req.body);
    res.status(StatusCodes.OK).json(respone);
    config_socket.get_socket().to(req.body.boardId).emit("newColumn", respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const updateColumn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const respone = await columnsService.updateById(id, req.body);
    res.status(StatusCodes.OK).json(respone);
    emitSocket.ToRoom(respone.boardId.toString(), "newCardOrderIds", respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const supportMovingCards = async (req, res, next) => {
  try {
    const respone = await columnsService.supportMovingCards(req.body);
    res.status(StatusCodes.OK).json(respone);
    emitSocket.ToRoom(respone.boardId.toString(), "movingCards", respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const result = await columnsService.deleteColumnById(req.params.id);
    res.status(StatusCodes.OK).json(result);
    emitSocket.ToRoom(result.boardId.toString(), "deletedColumn", result);
  } catch (error) {
    next(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};
export const columnController = {
  createColumn,
  updateColumn,
  supportMovingCards,
  deleteColumn,
};

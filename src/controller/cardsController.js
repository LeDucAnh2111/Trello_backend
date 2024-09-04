import { config_socket } from "@/config/socketIo";
import { cardsService } from "@/services/cardService";
import ApiError from "@/uilt/ApiError";
import { emitSocket } from "@/uilt/emitSocket";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  try {
    const respone = await cardsService.createNew(req.body);
    res.status(StatusCodes.OK).json(respone);
    emitSocket.ToRoom(req.body.boardId, "newCard", respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const update = async (req, res, next) => {
  try {
    const respone = await cardsService.updateById(req.params.id, req.body);
    res.status(StatusCodes.OK).json(respone);
    emitSocket.ToRoom(respone.boardId.toString(), "updatedCard", respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const result = await cardsService.deleteCard(req.params.id);
    res.status(StatusCodes.OK).json(result);
    emitSocket.ToRoom(result.boardId.toString(), "deletedCard", result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

export const cardsController = { createNew, update, deleteCard };

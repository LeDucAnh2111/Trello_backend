import ApiError from "@/uilt/ApiError";
import { boardService } from "@/services/boardService";
import { StatusCodes } from "http-status-codes";
import { config_socket } from "@/config/socketIo";

const createBoard = async (req, res, next) => {
  try {
    const createBoardResponse = await boardService.createNew(req.body);

    res.status(StatusCodes.OK).json(createBoardResponse);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
    // res.status(500).json({ error: error.message });
  }
};

const getBoards = async (req, res, next) => {
  try {
    const boards = await boardService.findAll();
    res.status(StatusCodes.OK).json(boards);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getBoard = async (req, res, next) => {
  try {
    const board = await boardService.findById(req.params.id);
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const detailBoard = await boardService.getDetail(id);
    res.status(StatusCodes.OK).json(detailBoard);
  } catch (error) {
    next(new ApiError(error.statusCode, error));
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await boardService.updateById(id, data);

    if (data.columnOrderIds) {
      config_socket
        .get_socket()
        .to(req.params.id)
        .emit("updateColumnOrderIds", data);
    }
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

export const boardsController = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  getDetail,
};

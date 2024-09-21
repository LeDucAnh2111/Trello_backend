import { users_boardsService } from "@/services/users_boardsService";
import ApiError from "@/util/ApiError";
import e from "express";

const { StatusCodes } = require("http-status-codes");

const getUsersByBoardId = async (req, res, next) => {
  try {
    const response = await users_boardsService.getUsersByBoardId(req.params.id);
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteById = async (req, res, next) => {
  try {
    req.body.userId = req.user.idUser;
    req.body.boardId = req.params.id;
    const respone = await users_boardsService.deleteById(req.body);
    res.status(StatusCodes.OK).json(respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getBoard = async (req, res, next) => {
  try {
    let { page } = req.query;
    if (!page) {
      page = 0;
    } else {
      page = page - 1;
    }
    const respone = await users_boardsService.getBoard(req.body, page);
    respone.userId = req.body.userId.toString();
    res.status(StatusCodes.OK).json(respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const search = async (req, res, next) => {
  try {
    const resopne = await users_boardsService.search(req.body);
    res.status(StatusCodes.OK).json(resopne);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};
export const users_boardsController = {
  deleteById,
  getUsersByBoardId,
  getBoard,
  search,
};

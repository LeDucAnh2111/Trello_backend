import ApiError from "@/uilt/ApiError";
import { createNew } from "@/services/boardService";
import { StatusCodes } from "http-status-codes";

const createBoard = async (req, res, next) => {
  try {
    const createBoardResponse = await createNew(req.body);

    res.status(200).json(createBoardResponse);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
    // res.status(500).json({ error: error.message });
  }
};

export const boardController = { createBoard };

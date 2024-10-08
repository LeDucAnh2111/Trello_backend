import slugify from "@/util/plugFormatString";
import { boardModel } from "@/models/boardModel";
import ApiError from "@/util/ApiError";
import { StatusCodes } from "http-status-codes";
import { DeepClone } from "@/util/deepClone";
import { users_boardsModel } from "@/models/users_boardsModel";
import { userModel } from "@/models/userModal";

const createNew = async (data, idUser) => {
  try {
    const newBoard = {
      ...data,
      plug: slugify(data.title),
    };
    // create new board
    const createNewBoard = await boardModel.createNew(newBoard);

    // add boards and users in users_boards

    const findOneBoard = await boardModel.findOneByID(
      createNewBoard.insertedId
    );
    await users_boardsModel.createNew({
      userId: idUser,
      boardId: findOneBoard._id.toString(),
      role: "admin",
    });

    return findOneBoard;
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const boards = await boardModel.findAll();
    return boards;
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    const boards = await boardModel.findOneByID(id);
    return boards;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (id) => {
  try {
    const board = await boardModel.getDetail(id);

    if (!board) {
      throw new Erorr(StatusCodes.NOT_FOUND, "Detail not found");
    }
    const resBoard = DeepClone(board);

    // đưa card vào bên trong column theo _id
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) => {
        return card.columnId.equals(column._id);
      });
    });

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    const updatedBoard = await boardModel.updateByID(id, data);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  findAll,
  findById,
  updateById,
  getDetail,
};

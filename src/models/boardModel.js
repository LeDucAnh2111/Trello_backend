import { Get_DB } from "@/config/mongodb";
import Joi from "joi";
const BOARD_COLLECTTION_NAME = "boards";
const BOARD_COLLECTTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(5).max(50).trim().strict(),
  plug: Joi.string().required().min(5).max(50).trim().strict(),
  description: Joi.string().required().min(5).max(50).trim().strict(),

  columnOrderIds: Joi.array().items(Joi.string()).default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now()),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const createNew = async (data) => {
  try {
    const newBoard = await Get_DB().collection("boards").insertOne(data);
    return newBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByID = async (id) => {
  try {
    const collection = await Get_DB().collection("boards").findOne({ _id: id });
    return collection;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTTION_NAME,
  BOARD_COLLECTTION_SCHEMA,
  createNew,
  findOneByID,
};

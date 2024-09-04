import { Get_DB } from "@/config/mongodb";
import { ObjectId, ReturnDocument } from "mongodb";
import Joi from "joi";
import slugify from "@/uilt/plugFormatString";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";
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
    const newData = await BOARD_COLLECTTION_SCHEMA.validateAsync(data);

    const newBoard = await Get_DB().collection("boards").insertOne(newData);
    return newBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByID = async (id) => {
  try {
    const objId = new ObjectId(id);

    const collection = await Get_DB()
      .collection("boards")
      .findOne({ _id: objId });

    return collection;
  } catch (error) {
    throw new Error(error);
  }
};

const getDetail = async (id) => {
  try {
    const objId = new ObjectId(id);

    const collection = await Get_DB()
      .collection("boards")
      .aggregate([
        { $match: { _id: objId } },
        {
          $lookup: {
            from: columnModel.COLUMN_MODEL_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_MODEL_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
          },
        },
      ])
      .toArray();

    return collection[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const findAll = async () => {
  try {
    const boards = await Get_DB().collection("boards").find().toArray();
    return boards;
  } catch (error) {
    throw new Error(error);
  }
};

const updateByID = async (id, updatedData) => {
  const objId = new ObjectId(id);
  if (updatedData.columnOrderIds) {
    updatedData.columnOrderIds = updatedData.columnOrderIds.map(
      (id) => new ObjectId(id)
    );
  } else {
    updatedData.updatedAt = Date.now();
    if (updatedData.title) {
      updatedData.plug = slugify(updatedData.title);
    }
  }

  const result = await Get_DB().collection("boards").updateOne(
    { _id: objId },
    {
      $set: updatedData,
    }
  );

  return result;
};
const pushColumnIds = async (id, value) => {
  const objId = new ObjectId(id);
  const data = await Get_DB()
    .collection("boards")
    .updateOne(
      { _id: objId },
      { $push: { columnOrderIds: new ObjectId(value) } },
      { ReturnDocument: "after" }
    );
  return data;
};

const deleteItemColumnOrderIdsByIdColumn = async (id, columnId) => {
  try {
    console.log(columnId);

    const result = await Get_DB()
      .collection("boards")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { columnOrderIds: new ObjectId(columnId) } },
        { returnDocument: ReturnDocument.AFTER }
      );
    console.log(result);

    return result;
  } catch (error) {
    throw error;
  }
};

export const boardModel = {
  BOARD_COLLECTTION_NAME,
  BOARD_COLLECTTION_SCHEMA,
  createNew,
  findOneByID,
  findAll,
  updateByID,
  getDetail,
  pushColumnIds,
  deleteItemColumnOrderIdsByIdColumn,
};

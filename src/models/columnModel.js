import { Get_DB } from "@/config/mongodb";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/util/ruleObject_IdMongoDb";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { boardModel } from "./boardModel";
import { Socket } from "socket.io";
import { config_socket } from "@/config/socketIo";
const COLUMN_MODEL_NAME = "columns";

const COLUMN_MODEL_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().min(5).max(50).trim().strict(),
  description: Joi.string().optional(),
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createAt: Joi.date().timestamp("javascript").default(Date.now()),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const createNew = async (data) => {
  try {
    // check value
    const newData = await COLUMN_MODEL_SCHEMA.validateAsync(data);
    newData.boardId = new ObjectId(data.boardId);
    // create new column in database here
    const result = await Get_DB().collection("columns").insertOne(newData);

    // update columnOrderIds of boards in database
    // await boardModel.pushColumnIds(newData.boardId, result.insertedId);
    return result;
  } catch (error) {
    console.error("Error creating new column", error.message);
    throw error;
  }
};

const findOneByID = async (id) => {
  // find one column by id
  try {
    const objId = new ObjectId(id);
    const result = await Get_DB().collection("columns").findOne({ _id: objId });
    return result;
  } catch (error) {
    throw error;
  }
};

const pushColumnIds = async (id, data) => {
  try {
    const objId = new ObjectId(id);
    const result = await Get_DB()
      .collection("columns")
      .updateOne(
        { _id: objId },
        { $push: { cardOrderIds: new ObjectId(data) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw error;
  }
};

const updateByID = async (id, data) => {
  try {
    if (data.cardOrderIds) {
      data.cardOrderIds = data?.cardOrderIds?.map((idCard) => {
        return new ObjectId(idCard);
      });
    } else {
      data.updatedAt = Date.now();
    }
    const result = Get_DB()
      .collection("columns")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { new: true }
      );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteColumnById = async (id) => {
  try {
    const result = await Get_DB()
      .collection("columns")
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteItemCardOrderIdsByIdCard = async (id, cardId) => {
  try {
    const result = await Get_DB()
      .collection("columns")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { cardOrderIds: new ObjectId(cardId) } }
      );
    return result;
  } catch (error) {
    throw error;
  }
};

export const columnModel = {
  COLUMN_MODEL_NAME,
  COLUMN_MODEL_SCHEMA,
  createNew,
  findOneByID,
  pushColumnIds,
  updateByID,
  deleteColumnById,
  deleteItemCardOrderIdsByIdCard,
};

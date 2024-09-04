import { Get_DB } from "@/config/mongodb";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/uilt/ruleObject_IdMongoDb";
import Joi from "joi";
import { ObjectId } from "mongodb";

const CARD_MODEL_NAME = "cards";

const CARD_MODEL_SCHEMA = Joi.object({
  boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().min(5).max(50).trim().strict(),
  description: Joi.string().optional(),

  createAt: Joi.date().timestamp("javascript").default(Date.now()),
  updateAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const createNew = async (data) => {
  try {
    const newData = await CARD_MODEL_SCHEMA.validateAsync(data);
    newData.boardId = new ObjectId(data.boardId);
    newData.columnId = new ObjectId(data.columnId);
    const result = await Get_DB().collection("cards").insertOne(newData);
    return result;
  } catch (error) {
    throw error;
  }
};

const findOneByID = async (id) => {
  try {
    const ObjId = new ObjectId(id);

    const result = await Get_DB().collection("cards").findOne({ _id: ObjId });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    const ObjId = new ObjectId(id);
    if (data.columnId) {
      data.columnId = new ObjectId(data.columnId);
    } else {
      data.updateAt = Date.now();
    }

    const result = await Get_DB()
      .collection("cards")
      .findOneAndUpdate(
        { _id: ObjId },
        { $set: data },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteColumnById = async (id) => {
  try {
    const result = await Get_DB()
      .collection("cards")
      .deleteMany({
        columnId: new ObjectId(id),
      });
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const result = await Get_DB()
      .collection("cards")
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw error;
  }
};

export const cardModel = {
  CARD_MODEL_NAME,
  CARD_MODEL_SCHEMA,
  createNew,
  findOneByID,
  updateById,
  deleteColumnById,
  deleteById,
};

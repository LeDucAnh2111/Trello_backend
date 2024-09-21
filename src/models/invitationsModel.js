import { ObjectId } from "mongodb";

const { Get_DB } = require("@/config/mongodb");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("@/util/ruleObject_IdMongoDb");
const Joi = require("joi");

const schemaInvitations = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  invitedBy: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  comment: Joi.string().optional(),
  status: Joi.string()
    .valid("pending", "accepted", "declined")
    .default("pending"),
  dateSent: Joi.date().timestamp("javascript").default(Date.now()),
  changedStatus: Joi.date().timestamp("javascript").optional(),
});

const collectionName = "invitations";

const createNew = async (data) => {
  try {
    const invitations = await schemaInvitations.validateAsync(data);
    invitations.userId = new ObjectId(invitations.userId);
    invitations.boardId = new ObjectId(invitations.boardId);
    invitations.invitedBy = new ObjectId(invitations.invitedBy);
    const result = await Get_DB()
      .collection(collectionName)
      .insertOne(invitations);
    return result;
  } catch (error) {
    throw error;
  }
};

const findOne = async (data) => {
  try {
    const result = await Get_DB().collection(collectionName).findOne(data);

    return result;
  } catch (error) {
    throw error;
  }
};

const getByUserId = async (userId, status) => {
  try {
    console.log(userId);

    const result = await Get_DB()
      .collection(collectionName)
      .aggregate([
        {
          $match: { userId: new ObjectId(userId), status: "pending" },
        },
        {
          $lookup: {
            from: "boards",
            localField: "boardId",
            foreignField: "_id",
            as: "boardDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "invitedBy",
            foreignField: "_id",
            as: "invitedByDetails",
          },
        },
        { $unwind: "$boardDetails" }, // Phân tách mảng boardDetails
        { $unwind: "$invitedByDetails" }, // Phân tách mảng boardDetails
        {
          $project: {
            _id: 1,
            userId: 1,
            boardId: 1,
            invitedBy: 1,
            comment: 1,
            dateSent: 1,
            boardTitle: "$boardDetails.title",
            invitedByFullName: "$invitedByDetails.username",
            invitedByEmail: "$invitedByDetails.email",
          },
        },
      ])
      .toArray();
    // console.log(">>> check model: ", result);

    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data, status = false, ...value) => {
  try {
    const boardId = new ObjectId(data.boardId);
    const userId = new ObjectId(data.userId);

    const result = await Get_DB()
      .collection(collectionName)
      .updateOne({ userId, boardId }, { $set: { status } });
    return result;
  } catch (error) {
    throw error;
  }
};

export const invitationsModel = {
  createNew,
  findOne,
  getByUserId,
  update,
};

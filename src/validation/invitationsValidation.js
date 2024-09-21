import ApiError from "@/util/ApiError";
import { StatusCodes } from "http-status-codes";

const {
  OBJECT_ID_RULE_MESSAGE,
  OBJECT_ID_RULE,
} = require("@/util/ruleObject_IdMongoDb");
const Joi = require("joi");

const createNew = async (req, res, next) => {
  const schemaInvitations = Joi.object({
    userIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    invitedBy: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    comment: Joi.string().optional(),
  });

  try {
    req.body.invitedBy = req.user.idUser;
    await schemaInvitations.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const update = async (req, res, next) => {
  const schemaUpdateInvitation = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid("accepted", "declined"),
  });
  try {
    req.body.userId = req.user.idUser;
    await schemaUpdateInvitation.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const getByUserId = async (req, res, next) => {
  const schemaGetInvitation = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    req.body.userId = req.user.idUser;
    await schemaGetInvitation.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const invitationsValidation = { createNew, update, getByUserId };

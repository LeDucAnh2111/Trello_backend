import { RULE_EMAIL, RULE_EMAIL_MESSAGE } from "@/util/ruleEmail";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/util/ruleObject_IdMongoDb";

const { default: ApiError } = require("@/util/ApiError");
const { PASSWORD_RULE, PASSWORD_RULE_MESSAGE } = require("@/util/rulePassword");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const createNew = async (req, res, next) => {
  const schemaUser = Joi.object({
    username: Joi.string().required().min(8).messages({
      "string.base": "Username is not a string",
      "string.empty": "Username is required",
      "string.min": "Username should be at least 8 characters long",
    }),
    email: Joi.string()
      .required()
      .pattern(RULE_EMAIL)
      .message(RULE_EMAIL_MESSAGE),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE),
  });
  try {
    await schemaUser.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const login = async (req, res, next) => {
  const schemaUser = Joi.object({
    username: Joi.string().required().min(8).messages({
      "string.base": "Username is not a string",
      "string.empty": "Username is required",
      "string.min": "Username should be at least 8 characters long",
    }),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE),
  });
  try {
    await schemaUser.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const search = async (req, res, next) => {
  const schemaSearchUser = Joi.object({
    name: Joi.string().required(),
    boardId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    await schemaSearchUser.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};
export const userValidation = {
  createNew,
  login,
  search,
};

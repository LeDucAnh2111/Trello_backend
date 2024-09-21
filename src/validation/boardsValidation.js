import ApiError from "@/util/ApiError";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/util/ruleObject_IdMongoDb";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

const schemaBoards = Joi.object({
  title: Joi.string().required().min(5).max(50).trim().strict().messages({
    "string.base": "Title is not a string",
    "string.min": "Insufficient string length",
    "string.max": "String length exceeds the limit",
    "string.empty": "Title is required",
    "any.required": "Title is required",
    "string.trim": "Title must not contain leading or trailing spaces",
  }),
  description: Joi.string()
    .optional()
    .min(5)
    .max(255)
    .trim()
    .strict()
    .messages({
      "string.base": "Description is not a string",
      "string.min": "Insufficient string length",
      "string.max": "String length exceeds the limit",
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.trim": "Description must not contain leading or trailing spaces",
    }),
  // other fields...  // Add more fields as needed. For example, members, lists, etc.
});

const validateUpdateBoard = Joi.object({
  title: Joi.string().min(5).max(50).trim().strict().optional().messages({
    "string.base": "Title is not a string",
    "string.min": "Insufficient string length",
    "string.max": "String length exceeds the limit",
    "string.empty": "Title is required",
    "string.trim": "Title must not contain leading or trailing spaces",
  }),
  description: Joi.string()
    .min(5)
    .max(255)
    .trim()
    .strict()
    .optional()
    .messages({
      "string.base": "Title is not a string",
      "string.min": "Insufficient string length",
      "string.max": "String length exceeds the limit",
      "string.empty": "Title is required",
      "string.trim": "Title must not contain leading or trailing spaces",
    }),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE))
    .optional()
    .messages({
      "array.base": "columnOrderIds must be an array",
      "array.items":
        "Each item in columnOrderIds must be a valid string matching the ObjectId pattern",
      "string.base": "Each item in columnOrderIds must be a string",
      "string.pattern.base":
        "Each item in columnOrderIds must match the ObjectId pattern",
    }),

  // other fields...  // Add more fields as needed. For example, members, lists, etc.
});

const createBoard = async (req, res, next) => {
  try {
    const boardData = req.body;
    await schemaBoards.validateAsync(boardData, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const searchBoard = async (req, res, next) => {
  const schemaSearch = Joi.object({
    value: Joi.string().required(),
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .required()
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    req.body.userId = req.user.idUser;
    await schemaSearch.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const updateBoard = async (req, res, next) => {
  try {
    validateUpdateBoard.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const boardValidation = {
  createBoard,
  updateBoard,
  searchBoard,
};

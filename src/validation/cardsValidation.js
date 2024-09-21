import ApiError from "@/util/ApiError";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/util/ruleObject_IdMongoDb";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

const schemaCards = Joi.object({
  title: Joi.string().required().min(5).max(150).trim().strict().messages({
    "string.base": "Title is not string",
    "string.empty": "Title is required",
    "string.min": "Title should be at least 5 characters long",
    "string.max": "Title should not exceed 150 characters",
    "string.trim": "Title must not contain leading or trailing spaces",
  }),
  description: Joi.string()
    .optional()
    .min(5)
    .max(256)
    .trim()
    .strict()
    .messages({
      "string.base": "Description is not a string",
      "string.min": "Insufficient string length",
      "string.max": "String length exceeds the limit",
      "string.empty": "Description is optional",
      "string.trim": "Description must not contain leading or trailing spaces",
    }),
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
});

const createNew = async (req, res, next) => {
  try {
    await schemaCards.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const update = async (req, res, next) => {
  try {
    const schemaUpdateCard = Joi.object({
      title: Joi.string().required().min(5).max(150).trim().strict().messages({
        "string.base": "Title is not string",
        "string.empty": "Title is required",
        "string.min": "Title should be at least 5 characters long",
        "string.max": "Title should not exceed 150 characters",
        "string.trim": "Title must not contain leading or trailing spaces",
      }),
      description: Joi.string()
        .optional()
        .min(5)
        .max(255)
        .trim()
        .strict()
        .messages({
          "string.base": "Title is not string",
          "string.empty": "Title is required",
          "string.min": "Title should be at least 5 characters long",
          "string.max": "Title should not exceed 150 characters",
          "string.trim": "Title must not contain leading or trailing spaces",
        }),
    });

    await schemaUpdateCard.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const schemaDeleteCard = Joi.object({
      id: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await schemaDeleteCard.validateAsync({ id: req.params.id });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const cardsValidation = { createNew, update, deleteCard };

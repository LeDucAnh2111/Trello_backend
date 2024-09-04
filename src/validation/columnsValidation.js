import ApiError from "@/uilt/ApiError";
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/uilt/ruleObject_IdMongoDb";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

const createNew = async (req, res, next) => {
  try {
    const schemaColumns = Joi.object({
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
          "string.base": "Title is not string",
          "string.empty": "Title is required",
          "string.min": "Title should be at least 5 characters long",
          "string.max": "Title should not exceed 256 characters",
          "string.trim": "Title must not contain leading or trailing spaces",
        }),
      boardId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    });
    await schemaColumns.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const supportMovingCards = async (req, res, next) => {
  const schemaColumns = Joi.object({
    currentCard: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    idColumnsPrevColumn: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    cardOrderedPrevColumn: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .default([]),
    idColumnsNextColumn: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    cardOrderedsNextColumn: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .default([]),
  });

  try {
    await schemaColumns.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const update = async (req, res, next) => {
  try {
    const schemaColumns = Joi.object({
      title: Joi.string().optional().min(5).max(150).trim().strict().messages({
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
          "string.base": "Title is not string",
          "string.empty": "Title is required",
          "string.min": "Title should be at least 5 characters long",
          "string.max": "Title should not exceed 256 characters",
          "string.trim": "Title must not contain leading or trailing spaces",
        }),
      cardOrderIds: Joi.array()
        .optional()
        .items(
          Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        ),
    });
    await schemaColumns.validateAsync(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const deleteColumn = async (req, res, next) => {
  const schemaColumns = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE),
  });
  try {
    console.log(req.params.id);

    await schemaColumns.validateAsync({ id: req.params.id });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const columnsValidation = {
  createNew,
  supportMovingCards,
  update,
  deleteColumn,
};

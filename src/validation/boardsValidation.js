import ApiError from "@/uilt/ApiError";
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
    .required()
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

const createBoard = async (req, res, next) => {
  try {
    const boardData = req.body;
    const value = await schemaBoards.validateAsync(boardData, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const boardValidation = {
  createBoard,
};

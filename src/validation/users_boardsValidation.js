const { default: ApiError } = require("@/util/ApiError");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("@/util/ruleObject_IdMongoDb");
const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const getUsersByBoard = async (req, res, next) => {
  const schemaUsers_boards = Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });
  try {
    const boardId = req.params.id;
    await schemaUsers_boards.validateAsync({ boardId });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

const getBoard = async (req, res, next) => {
  const schemaSearch = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    role: Joi.string().valid("admin", "member").default("admin").optional(),
    value: Joi.string().optional(),
  });
  try {
    req.body.userId = req.user.idUser;

    req.body = await schemaSearch.validateAsync(req.body, {
      abortEarly: false,
    });

    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error));
  }
};

export const users_boardsValidation = { getUsersByBoard, getBoard };

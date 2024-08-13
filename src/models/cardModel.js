import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/uilt/ruleObject_IdMongoDb";
import Joi from "joi";

const CARD_MODEL_NAME = "cards";

const CARD_MODEL_SCHEMA = Joi.object({
  boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().min(5).max(50).trim().strict(),
  description: Joi.string().optional(),

  createAt: Joi.date().timestamp("javascript").default(Date.now()),
  updateat: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

export { CARD_MODEL_NAME, CARD_MODEL_SCHEMA };

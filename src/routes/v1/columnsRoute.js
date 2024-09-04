import { columnController } from "@/controller/columnsController";
import { columnsValidation } from "@/validation/columnsValidation";
import express from "express";

const Router = express.Router();

Router.route("/")
  .get()
  .post(columnsValidation.createNew, columnController.createColumn);

Router.route("/supports/moving_card").put(
  columnsValidation.supportMovingCards,
  columnController.supportMovingCards
);

Router.route("/:id")
  .put(columnsValidation.update, columnController.updateColumn)
  .delete(columnsValidation.deleteColumn, columnController.deleteColumn);
export default Router;

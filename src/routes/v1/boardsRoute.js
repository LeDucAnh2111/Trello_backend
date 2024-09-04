import express from "express";
import { boardValidation } from "@/validation/boardsValidation";
import { boardsController } from "@/controller/boardsController";
const Router = express.Router();

Router.route("/")
  .get(boardsController.getBoards)
  .post(boardValidation.createBoard, boardsController.createBoard);

Router.route("/:id")
  .get(boardsController.getDetail)
  .put(boardValidation.updateBoard, boardsController.updateBoard);

export default Router;

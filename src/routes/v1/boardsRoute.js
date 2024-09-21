import express from "express";
import { boardValidation } from "@/validation/boardsValidation";
import { boardsController } from "@/controller/boardsController";
import { checkTokenMiddleware } from "@/middleware/checkTokenMiddleware";
const Router = express.Router();

Router.route("/")
  .get(checkTokenMiddleware, boardsController.getBoards)
  .post(
    checkTokenMiddleware,
    boardValidation.createBoard,
    boardsController.createBoard
  );

Router.route("/:id")
  .get(boardsController.getDetail)
  .put(
    boardValidation.updateBoard,
    checkTokenMiddleware,
    boardsController.updateBoard
  );

export default Router;

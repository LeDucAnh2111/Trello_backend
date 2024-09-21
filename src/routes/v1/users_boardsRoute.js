import { users_boardsController } from "@/controller/users_boardsController";
import { checkTokenMiddleware } from "@/middleware/checkTokenMiddleware";
import { users_boardsValidation } from "@/validation/users_boardsValidation";
import express from "express";
const Router = express.Router();

Router.route("/:id")
  .get(
    checkTokenMiddleware,
    users_boardsValidation.getUsersByBoard,
    users_boardsController.getUsersByBoardId
  )
  .delete(checkTokenMiddleware, users_boardsController.deleteById);

Router.route("/").post(
  checkTokenMiddleware,
  users_boardsValidation.getBoard,
  users_boardsController.getBoard
);

Router.route("/search").post(
  checkTokenMiddleware,
  users_boardsValidation.getBoard,
  users_boardsController.search
);

export default Router;

import express from "express";
import { boardValidation } from "@/validation/boardsValidation";
import { boardController } from "@/controller/boardController";
const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.json({ message: "Route get boards" });
  })
  .post(boardValidation.createBoard, boardController.createBoard);

export default Router;

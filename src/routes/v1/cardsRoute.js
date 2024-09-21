import { cardsController } from "@/controller/cardsController";
import { checkTokenMiddleware } from "@/middleware/checkTokenMiddleware";
import { cardsValidation } from "@/validation/cardsValidation";
import express from "express";

const app = express();
const Router = express.Router();

Router.route("/")
  .get()
  .post(
    checkTokenMiddleware,
    cardsValidation.createNew,
    cardsController.createNew
  );

Router.route("/:id")
  .put(cardsValidation.update, cardsController.update)
  .delete(cardsValidation.deleteCard, cardsController.deleteCard);

export default Router;

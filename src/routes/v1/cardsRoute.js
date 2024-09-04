import { cardsController } from "@/controller/cardsController";
import { cardsValidation } from "@/validation/cardsValidation";
import express from "express";

const app = express();
const Router = express.Router();

Router.route("/")
  .get()
  .post(cardsValidation.createNew, cardsController.createNew);

Router.route("/:id")
  .put(cardsValidation.update, cardsController.update)
  .delete(cardsValidation.deleteCard, cardsController.deleteCard);

export default Router;

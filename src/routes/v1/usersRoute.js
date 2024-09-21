import { userController } from "@/controller/usersController";
import { checkTokenMiddleware } from "@/middleware/checkTokenMiddleware";
import { userValidation } from "@/validation/usersValidation";
import express from "express";

const Router = express.Router();

Router.route("/register").post(
  userValidation.createNew,
  userController.createNew
);

Router.route("/login").post(userValidation.login, userController.login);
Router.route("/logout").post(checkTokenMiddleware, userController.logout);

Router.route("/search").post(
  checkTokenMiddleware,
  userValidation.search,
  userController.search
);

Router.route("/").get(checkTokenMiddleware, userController.getByID);
export default Router;

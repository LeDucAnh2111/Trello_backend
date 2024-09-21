import { invitationsController } from "@/controller/invitationsController";
import { checkTokenMiddleware } from "@/middleware/checkTokenMiddleware";
import { invitationsValidation } from "@/validation/invitationsValidation";
import express from "express";
const Router = express.Router();

Router.route("/")
  .get(checkTokenMiddleware, invitationsController.getByUserId)
  .post(
    checkTokenMiddleware,
    invitationsValidation.createNew,
    invitationsController.createNew
  )
  .put(
    checkTokenMiddleware,
    invitationsValidation.update,
    invitationsController.update
  );

export default Router;

import express from "express";
import boardsRoute from "./boardsRoute";
import columnsRoute from "./columnsRoute";
import cardsRoute from "./cardsRoute";
const Router = express.Router();

Router.get("/", async (req, res) => {
  res.status(200).json({ messages: "Borads API is ready" });
});

Router.use("/boards", boardsRoute);

Router.use("/columns", columnsRoute);

Router.use("/cards", cardsRoute);

export const APIs_V1 = Router;

import express from "express";
import boardsRoute from "./boardsRoute";
const Router = express.Router();

Router.get("/", async (req, res) => {
  res.status(200).json({ messages: "Borads API is ready" });
});

Router.use("/boards", boardsRoute);

export const APIs_V1 = Router;

import express from "express";
import boardsRoute from "./boardsRoute";
import columnsRoute from "./columnsRoute";
import cardsRoute from "./cardsRoute";
import authsRouter from "./authRoute";
import usersRoute from "./usersRoute";
import invitationsRoute from "./invitationsRoute";
import users_boardsRoute from "./users_boardsRoute";
const Router = express.Router();

Router.get("/", async (req, res) => {
  res.status(200).json({ messages: "Borads API is ready" });
});
Router.use("/users", usersRoute);
Router.use("/auth", authsRouter);

// Router.use(passport.authenticate("jwt", { session: false }));
Router.use("/boards", boardsRoute);

Router.use("/columns", columnsRoute);

Router.use("/cards", cardsRoute);
Router.use("/invitations", invitationsRoute);
Router.use("/users-boards", users_boardsRoute);

export const APIs_V1 = Router;

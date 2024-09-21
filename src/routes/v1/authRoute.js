import { userController } from "@/controller/usersController";
import { createToken } from "@/util/token";
import express from "express";
import passport from "passport";
const Router = express.Router();

Router.route("/google").get(
  passport.authenticate("google", { scope: ["profile", "email"] })
);

Router.route("/google/callback").get(userController.loginByGoogle);

// passport.authenticate("google", { failureRedirect: "/login" }),
// (req, res) => {
//   // Xác thực thành công, chuyển hướng người dùng
//   console.log(">> check user on google", req?.user);
//   createToken()
//   res.json({ success: true, message: "Login successful!" });
// }
export default Router;

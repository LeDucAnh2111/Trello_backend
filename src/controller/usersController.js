import { usersService } from "@/services/userService";
import ApiError from "@/util/ApiError";
import passport from "passport";

const { StatusCodes } = require("http-status-codes");

const createNew = async (req, res, next) => {
  try {
    const result = await usersService.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const login = async (req, res, next) => {
  try {
    const result = await usersService.login(req.body);
    res.cookie("userConfirmation", result.userConfirmation, {
      httpOnly: true, // Cookie không thể được truy cập qua JavaScript
      // secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường sản xuất
      maxAge: 3600000, // Thời gian sống của cookie (1 giờ)
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getByID = async (req, res, next) => {
  try {
    const user = await usersService.getByID(req.user?.idUser);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const loginByGoogle = async (req, res, next) => {
  try {
    passport.authenticate("google", async (err, user, info) => {
      if (err) {
        throw new Error(err);
      }
      const respone = await usersService.loginByGoogle(user);
      res.cookie("userConfirmation", respone.userConfirmation, {
        httpOnly: true, // Cookie không thể được truy cập qua JavaScript
        // secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường sản xuất
        maxAge: 3600000, // Thời gian sống của cookie (1 giờ)
      });
      // res.status(StatusCodes.OK).json(respone);
      res.redirect("http://localhost:3001/");
    })(req, res, next);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER, error));
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("userConfirmation");
    res.status(StatusCodes.OK).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const search = async (req, res, next) => {
  try {
    const respone = await usersService.search(req.body);
    res.status(StatusCodes.OK).json(respone);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

export const userController = {
  createNew,
  login,
  getByID,
  loginByGoogle,
  logout,
  search,
};

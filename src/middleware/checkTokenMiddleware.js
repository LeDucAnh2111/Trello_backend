import ApiError from "@/util/ApiError";

const { StatusCodes } = require("http-status-codes");
const passport = require("passport");

export const checkTokenMiddleware = (req, res, next) => {
  try {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new Error("Token is not valid");
      }
      // Nếu xác thực thành công, gán user vào req và chuyển tiếp tới middleware tiếp theo
      req.user = user;
      next();
    })(req, res, next);
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, error));
  }
};

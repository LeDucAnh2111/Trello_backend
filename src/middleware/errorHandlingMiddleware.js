import { StatusCodes } from "http-status-codes";
import "dotenv/config";
export const errorHandlingMiddleware = (err, req, res, next) => {
  console.log("=====", err.message);

  // kiểm tra nếu lỗi được đưa về đây không có status thì sẽ cho err 1 status mặc định là 500
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  //Kiểm tra nếu không có message lỗi được đưa về thì mình dùng một message mặc định để gửi về theo mã lỗi của status
  err.message = err.message || StatusCodes[err.status];

  //tạo 1 biến để kiểm tra những gì muốn trả về client
  const responseError = {
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
  };

  if (process.env.BUILD_MODE === "production") {
    console.log("check mode");

    delete responseError.stack;
  }

  res.status(responseError.status).json({ error: responseError });
};

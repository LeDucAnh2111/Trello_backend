import express, { json, Router } from "express";
import "dotenv/config";
import { ConnectMongoDb, Get_DB } from "@/config/mongodb";
import { APIs_V1 } from "@/routes/v1";
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware";
const PORT = process.env.APP_PORT || 3000;
const URL = "localhost";
const DB_HOST = process.env.MONGODB_URL;

const Action = () => {
  const app = express();
  app.use(express.json());
  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  app.listen(PORT, URL, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// kiểm tra khi mongodb được kết nối thì nó mới bắt đầu chạy action
ConnectMongoDb()
  .then(() => {
    Action();
  })
  .catch((error) => {
    console.error(error);
  });

// tắt kết nối với mongodb nhưng hiện tại đang lỗi chưa hoạt động
// process.on("SIGINT", async function () {
//   // Thử đóng kết nối
//   await Close_DB();

//   process.exit(0); // Kết thúc tiến trình sau khi đóng kết nối
// });

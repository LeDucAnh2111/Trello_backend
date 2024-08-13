import { MongoClient } from "mongodb";
import "dotenv/config";
const MONGODB_URL = process.env.MONGODB_URL;
const NAMEDB = "DB_Trello";

const client = new MongoClient(MONGODB_URL);

let connectMongodb = null;

export async function ConnectMongoDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    connectMongodb = client.db(NAMEDB);
  } catch (error) {
    console.error("Can not connect to MongoDB", error);
  }
}

export const Get_DB = () => {
  if (!connectMongodb) {
    console.log("Mongo is not connected");
    throw new Error("not connected to mongodb");
  }
  return connectMongodb;
};

export const Close_DB = async () => {
  console.log("Bắt đầu đóng kết nối mongodb...");
  try {
    await client.close(); // Đảm bảo rằng client.close() là một hàm async và bạn đang chờ đợi nó
    console.log("mongodb đã được ngắt");
  } catch (err) {
    console.error("Đóng kết nối mongodb gặp lỗi:", err);
  }
};

import { hashPassword, comparePassword } from "@/config/bcrypt";
import { ObjectId } from "mongodb";

const { Get_DB } = require("@/config/mongodb");
const Joi = require("joi");

// idGoogle: profile.id,
// name: profile.name,
// email: profile.emails[0].value,
// avatar: profile.photos[0].value,
const collectionName = "users";
const schemaUser = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  idGoogle: Joi.string().optional(),
  password: Joi.string().optional(),
}).or("password", "idGoogle");

const createNew = async (data) => {
  try {
    const user = await schemaUser.validateAsync(data);
    if (user.password) {
      user.password = hashPassword(user.password);
    }
    const result = await Get_DB().collection(collectionName).insertOne(user);
    return result;
  } catch (error) {
    throw error;
  }
};

const login = async (user) => {
  try {
    const result = await Get_DB()
      .collection(collectionName)
      .findOne({ username: user.username });
    if (!result) {
      throw new Error("User not found");
    }
    const isValidPassword = comparePassword(user.password, result.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const getByID = async (id) => {
  try {
    const result = await Get_DB()
      .collection(collectionName)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw error;
  }
};

const getByKey = async (key, value) => {
  try {
    const result = await Get_DB()
      .collection(collectionName)
      .findOne({ [key]: value });
    return result;
  } catch (error) {
    throw error;
  }
};

const loginByGoogle = async (user) => {
  try {
    const result = await Get_DB()
      .collection(collectionName)
      .findOne({ idGoogle: user.idGoogle });
    return result;
  } catch (error) {
    throw error;
  }
};

const search = async (data) => {
  try {
    const result = await Get_DB()
      .collection(collectionName)
      .aggregate([
        {
          $match: {
            username: { $regex: data.name, $options: "i" }, // Tìm theo tên người dùng
          },
        },
        {
          $lookup: {
            from: "users_boards",
            localField: "_id",
            foreignField: "userId",
            as: "userBoards",
          },
        },
        {
          $match: {
            "userBoards.boardId": { $ne: new ObjectId(data.boardId) }, // Kiểm tra user không có boardId được truyền vào
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1, // Lấy thông tin board của user đầu tiên
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw error;
  }
};

export const userModel = {
  createNew,
  login,
  getByID,
  getByKey,
  loginByGoogle,
  search,
};

import { userModel } from "@/models/userModal";
import { createToken } from "@/util/token";

const createNew = async (user) => {
  try {
    const checkUsername = await userModel.getByKey("username", user.username);
    if (checkUsername) {
      throw new Error("Username already exists");
    }
    const result = await userModel.createNew(user);
    return result;
  } catch (error) {
    throw error;
  }
};

const login = async (user) => {
  try {
    const result = await userModel.login(user);
    const token = createToken({
      idUser: result._id.toString(),
      username: result.username,
    });
    return { message: "login success", userConfirmation: token };
  } catch (error) {
    throw error;
  }
};

const getByID = async (id) => {
  try {
    const result = await userModel.getByID(id);
    delete result.password;
    return result;
  } catch (error) {
    throw error;
  }
};

const getByKey = async (key, value) => {
  try {
    const result = await userModel.getByKey(data.key, data.value);
    return result;
  } catch (error) {
    throw error;
  }
};

const loginByGoogle = async (user) => {
  try {
    const checkUser = await userModel.getByKey("idGoogle", user.idGoogle);
    if (!checkUser) {
      await userModel.createNew(user);
    }
    const result = await userModel.loginByGoogle(user);
    const token = createToken({
      idUser: result._id.toString(),
      username: result.username,
    });
    return { message: "login success", userConfirmation: token };
  } catch (error) {
    throw error;
  }
};

const search = async (data) => {
  try {
    const result = await userModel.search(data);
    return result;
    return result;
  } catch (error) {
    throw error;
  }
};

export const usersService = {
  createNew,
  login,
  getByID,
  getByKey,
  loginByGoogle,
  search,
};

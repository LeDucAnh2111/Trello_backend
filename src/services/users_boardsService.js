import { userModel } from "@/models/userModal";
import { users_boardsModel } from "@/models/users_boardsModel";

const getUsersByBoardId = async (id) => {
  try {
    const boards = await users_boardsModel.findByRequest({ boardId: id });
    const usersPromises = boards.map(async (board) => {
      const user = await userModel.getByID(board.userId);
      return user;
    });
    const users = await Promise.all(usersPromises);
    const responeUser = users.map((user) => {
      return {
        userId: user._id,
        username: user.username,
        email: user.email,
      };
    });
    return responeUser;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (data) => {
  try {
    // nếu chỉ có id user từ token mà không có id người rời (trường hợp người dùng tự out)
    if (!data.userIdOut) {
      const user = await users_boardsModel.findOne({
        userId: data.userId,
        boardId: data.boardId,
        role: "member",
      });

      if (!user)
        throw new Error(
          "You cannot leave the board because you are an administrator."
        );
      const result = await users_boardsModel.deleteById({
        userId: data.userId,
        boardId: data.boardId,
      });
      return result;
    }
    // nếu có id có id user từ token và cũng có id người rời (trường hợp bị admin đá)
    // - kiểm tra người dùng đó có phải là admin của boards đó không
    const user = await users_boardsModel.findOne({
      userId: data.userId,
      boardId: data.boardId,
      role: "admin",
    });
    if (!user) throw new Error("user is not administrator");
    const userOut = await users_boardsModel.findOne({
      userId: data.userId,
      boardId: data.boardId,
      role: "admin",
    });
    if (userOut) throw new Error("user you want to kick is administrator");
    // - nếu đúng, thì xóa
    const result = await users_boardsModel.deleteById({
      userId: data.userIdOut,
      boardId: data.boardId,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getBoard = async (data, page) => {
  try {
    const boardsOfUsers = await users_boardsModel.getBoard(data, page);

    return boardsOfUsers;
  } catch (error) {
    throw error;
  }
};

const search = async (data) => {
  try {
    const { userId, value } = data;
    const result = await users_boardsModel.search(userId, value);
    return result;
  } catch (error) {
    throw error;
  }
};

export const users_boardsService = {
  deleteById,
  getUsersByBoardId,
  getBoard,
  search,
};

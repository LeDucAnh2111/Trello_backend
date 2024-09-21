import { userModel } from "@/models/userModal";
import { users_boardsModel } from "@/models/users_boardsModel";
import { ObjectId } from "mongodb";

const { invitationsModel } = require("@/models/invitationsModel");

const createNew = async (data) => {
  try {
    const errorArray = [];
    const users = [];
    // Tạo mảng các Promise từ việc xử lý từng phần tử trong mảng userIds
    const promises = data.userIds.map(async (userId) => {
      try {
        // Kiểm tra người dùng đã tham gia boards này chưa
        const userInBoards = await users_boardsModel.findOne({
          userId: userId,
          boardId: data.boardId,
        });

        // Kiểm tra người được mời đã được mời lần nào chưa
        const userInvited = await invitationsModel.findOne({
          userId: new ObjectId(userId),
          boardId: new ObjectId(data.boardId),
          status: "pending",
        });

        // Nếu người dùng đã được vào hoặc đã được mời trước đó thì đưa ra lỗi
        if (userInBoards || userInvited) {
          errorArray.push(userId);
          // Thay vì ném lỗi, lưu lỗi vào mảng errorArray
          return; // Ngừng xử lý cho userId hiện tại
        }

        // Tạo lời mời mới
        const newInvitation = {
          userId,
          boardId: data.boardId,
          invitedBy: data.invitedBy,
        };
        await invitationsModel.createNew(newInvitation);
        users.push(newInvitation.userId);
      } catch (error) {
        errorArray.push(userId); // Lưu lỗi vào mảng errorArray
      }
    });

    // Đợi tất cả các Promise hoàn thành
    await Promise.all(promises);

    // Kiểm tra và ném lỗi nếu có
    if (errorArray.length > 0) {
      const usernamesPromises = errorArray.map(async (idUser) => {
        const user = await userModel.getByID(idUser);
        return user.username;
      });

      const usernames = await Promise.all(usernamesPromises);

      throw new Error(`${usernames.join(", ")}`);
    }

    return { message: "invitation sent", users };
  } catch (error) {
    throw error;
  }
};

const getByUserId = async (userId, status) => {
  try {
    const result = await invitationsModel.getByUserId(userId, status);
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (data) => {
  try {
    const status = data.status;

    delete data.status;
    const result = await invitationsModel.update(data, status);
    if (status === "accepted") await users_boardsModel.createNew(data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const invitationsService = { createNew, getByUserId, update };

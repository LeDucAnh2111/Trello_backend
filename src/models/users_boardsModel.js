import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "@/util/ruleObject_IdMongoDb";
import { ObjectId } from "mongodb";

const { Get_DB } = require("@/config/mongodb");
const Joi = require("joi");

const schemaUsers_boards = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  role: Joi.string().valid("admin", "member").default("member"),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now),
  deletedAt: Joi.date().when("isDeleted", {
    is: true, // Điều kiện khi isDeleted là true
    then: Joi.date().required(), // Nếu điều kiện đúng, trường deletedAt là bắt buộc
    otherwise: Joi.date().optional(), // Nếu điều kiện không đúng, trường deletedAt là tùy chọn
  }),
  isDeleted: Joi.boolean().default(false), // Trường này dùng để quyết định xem liệu trường deletedAt có cần phải kiểm tra không
});

const collectionName = "users_boards";

const createNew = async (data) => {
  try {
    const relation = await schemaUsers_boards.validateAsync(data);
    const result = await Get_DB()
      .collection(collectionName)
      .insertOne({
        ...relation,
        userId: new ObjectId(relation.userId),
        boardId: new ObjectId(relation.boardId),
      });
    return result;
  } catch (error) {
    throw error;
  }
};

const findByRequest = async (data) => {
  try {
    data.boardId = new ObjectId(data.boardId);
    const result = await Get_DB()
      .collection(collectionName)
      .find(data)
      .toArray();

    return result;
  } catch (error) {
    throw error;
  }
};

const findOne = async (data) => {
  try {
    if (data.userId && data.boardId) {
      data = {
        ...data,
        userId: new ObjectId(data.userId),
        boardId: new ObjectId(data.boardId),
      };
    }
    const result = await Get_DB().collection(collectionName).findOne(data);

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (data) => {
  try {
    if (data.userId && data.boardId) {
      data = {
        ...data,
        userId: new ObjectId(data.userId),
        boardId: new ObjectId(data.boardId),
      };
    }
    const result = await Get_DB().collection(collectionName).deleteOne(data);

    return result;
  } catch (error) {
    throw error;
  }
};

// const getBoard = async (data,page) => {
//   try {
//     const { userId } = data;
//     console.log(data);

//     const result = await Get_DB()
//       .collection(collectionName)
//       .find({ userId: new ObjectId(userId) })

//       .toArray();
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

const getBoard = async (data, page) => {
  try {
    data.userId = new ObjectId(data.userId);

    console.log(data);

    const result = await Get_DB()
      .collection(collectionName)
      .aggregate([
        {
          $facet: {
            totalCount: [
              {
                $match: {
                  ...data,
                },
              },
              { $count: "total" }, // Đếm tổng số tài liệu
            ],
            pagedData: [
              {
                $match: {
                  ...data,
                },
              },
              {
                $lookup: {
                  from: "boards",
                  localField: "boardId",
                  foreignField: "_id",
                  as: "boardDetail",
                },
              },
              { $skip: page * 10 }, // Bỏ qua tài liệu
              { $limit: 10 }, // Giới hạn số lượng tài liệu trả về
              {
                $project: {
                  _id: { $arrayElemAt: ["$boardDetail._id", 0] }, // Chọn phần tử đầu tiên của mảng
                  title: { $arrayElemAt: ["$boardDetail.title", 0] },
                  description: {
                    $arrayElemAt: ["$boardDetail.description", 0],
                  }, // Chọn phần tử đầu tiên của mảng
                  createdAt: { $arrayElemAt: ["$boardDetail.createdAt", 0] },
                  // Chọn phần tử đầu tiên của mảng
                },
              },
            ],
          },
        },
        {
          $project: {
            totalCount: { $arrayElemAt: ["$totalCount.total", 0] }, // Lấy số lượng tổng từ totalCount
            pagedData: 1, // Giữ dữ liệu phân trang
          },
        },
      ])
      .toArray();

    // Trả về kết quả với tổng số tài liệu và dữ liệu phân trang
    return result[0];
  } catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
};

const search = async (userId, value) => {
  try {
    const regexPattern = `[${value}]`;

    const result = await Get_DB()
      .collection(collectionName)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "boards",
            localField: "boardId",
            foreignField: "_id",
            as: "boardDetail",
          },
        },
        // { $unwind: "$boardDetail" }, // Phân tách mảng boardDetail
        {
          $match: {
            "boardDetail.title": new RegExp(regexPattern, "i"),
          },
        },
        {
          $project: {
            _id: { $arrayElemAt: ["$boardDetail._id", 0] },
            title: { $arrayElemAt: ["$boardDetail.title", 0] },
            createdAt: { $arrayElemAt: ["$boardDetail.createdAt", 0] },
            role: 1,
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw error;
  }
};
export const users_boardsModel = {
  createNew,
  findOne,
  deleteById,
  findByRequest,
  getBoard,
  search,
};

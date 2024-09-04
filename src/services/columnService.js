import { boardModel } from "@/models/boardModel";
import { cardModel } from "@/models/cardModel";
import { columnModel } from "@/models/columnModel";

const createNew = async (data) => {
  try {
    const result = await columnModel.createNew(data);

    // lấy dữ liệu theo id ra cho người dùng xem
    const column = await columnModel.findOneByID(result.insertedId);
    column.cards = [];
    // push id columns vào trong columnsOrderIds của boards
    await boardModel.pushColumnIds(column.boardId, column._id);
    return column;
  } catch (error) {
    throw error;
  }
};

//
const updateById = async (id, data) => {
  try {
    const updatedBoard = await columnModel.updateByID(id, data);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const supportMovingCards = async (data) => {
  try {
    // update previousColumns
    await columnModel.updateByID(data.idColumnsPrevColumn, {
      cardOrderIds: data.cardOrderedPrevColumn,
    });
    // update nextColumns
    await columnModel.updateByID(data.idColumnsNextColumn, {
      cardOrderIds: data.cardOrderedsNextColumn,
    });
    // update
    const result = await cardModel.updateById(data.currentCard, {
      columnId: data.idColumnsNextColumn,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteColumnById = async (id) => {
  try {
    // tìm column theo id được chuyền lên
    const column = await columnModel.findOneByID(id);
    // xóa colum
    await columnModel.deleteColumnById(column._id);
    // xóa cacd theo columns id
    await cardModel.deleteColumnById(column._id);
    // xóa columnOrderIds của board
    await boardModel.deleteItemColumnOrderIdsByIdColumn(
      column.boardId,
      column._id
    );
    // trả về kế quả nếu đã xóa được
    return {
      message: "Deleted successfully",
      columnId: id,
      boardId: column.boardId,
    };
  } catch (error) {
    throw error;
  }
};

export const columnsService = {
  createNew,
  updateById,
  supportMovingCards,
  deleteColumnById,
};

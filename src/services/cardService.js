import { cardModel } from "@/models/cardModel";
import { columnModel } from "@/models/columnModel";

const createNew = async (data) => {
  try {
    const result = await cardModel.createNew(data);

    // lấy dữ liệu theo id ra cho người dùng xem
    const card = await cardModel.findOneByID(result.insertedId);
    // push id card vào trong cardsOrderIds của boards
    await columnModel.pushColumnIds(card.columnId, card._id);
    return card;
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    const result = await cardModel.updateById(id, data);
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteCard = async (id) => {
  try {
    const card = await cardModel.findOneByID(id);
    await columnModel.deleteItemCardOrderIdsByIdCard(card.columnId, card._id);
    await cardModel.deleteById(card._id);

    return {
      message: "Deleted successfully",
      cardId: id,
      columnId: card.columnId.toString(),
      boardId: card.boardId.toString(),
    };
  } catch (error) {
    throw error;
  }
};

export const cardsService = { createNew, updateById, deleteCard };

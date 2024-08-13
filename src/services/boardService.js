import slugify from "@/uilt/plugFormatString";
import { boardModel } from "@/models/boardModel";
const createNew = async (data) => {
  try {
    const newBoard = {
      ...data,
      plug: slugify(data.title),
    };
    // create new board
    const createNewBoard = await boardModel.createNew(newBoard);
    const findOneBoard = await boardModel.findOneByID(
      createNewBoard.insertedId
    );

    console.log(createNewBoard);

    return findOneBoard;
  } catch (error) {
    throw error;
  }
};

export { createNew };

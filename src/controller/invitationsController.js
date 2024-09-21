import { config_socket } from "@/config/socketIo";
import { invitationsService } from "@/services/invitationsService";
import ApiError from "@/util/ApiError";
import { StatusCodes } from "http-status-codes";
import { Socket } from "socket.io";

const createNew = async (req, res, next) => {
  try {
    const result = await invitationsService.createNew(req.body);
    result.users.forEach((element) => {
      config_socket
        .get_socket()
        .to(element)
        .emit("invitations", { "new invitations": true });
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const status = "pending";
    const invitations = await invitationsService.getByUserId(userId, status);
    res.status(StatusCodes.OK).json(invitations);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const update = async (req, res, next) => {
  try {
    req.body.userId = req.user.idUser;
    const { ...data } = req.body;
    const result = await invitationsService.update(data);
    config_socket
      .get_socket()
      .to(req.body.userId)
      .emit("updateInvitations", { "new invitations": true });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

export const invitationsController = { createNew, getByUserId, update };

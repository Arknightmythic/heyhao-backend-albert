import { NextFunction, Response } from "express";
import { CustomeRequest } from "../types/CustomResquest";

import * as chatService from "../services/chatServices";
import { createMessageSchema, createRoomPersonalSchema } from "../utils/schema/chat";

export const createRoomPersonal = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = createRoomPersonalSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path}-${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "validation Error",
        detail: errorMessage,
      });
    }

    const data = await chatService.createRoomPersonal(
      req?.user?.id ?? "",
      parse.data.user_id
    );

    return res.json({
      succes: true,
      message: "success to create room",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const data = await chatService.getRecentsRoom(
      req?.user?.id ?? "",
    );

    return res.json({
      succes: true,
      message: "success to get rooms",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomMessages = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {roomId} = req.params
    const data = await chatService.getRoomMessages(
      roomId
    );

    return res.json({
      succes: true,
      message: "success to get messages",
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const createMessage = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = createMessageSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path}-${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "validation Error",
        detail: errorMessage,
      });
    }

    const data = await chatService.createMessage(
      parse.data,
      req?.user?.id ?? "",
      req.file
    );

    return res.json({
      succes: true,
      message: "success to create messages",
      data,
    });
  } catch (error) {
    next(error);
  }
};

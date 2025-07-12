import type { NextFunction, Request, Response } from "express";
import { CustomeRequest } from "../types/CustomResquest";
import { groupFreeSchema } from "../utils/schema/group";
import * as groupService from "../services/groupServices"
import fs from "node:fs";

export const createFreeGroup = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupFreeSchema.safeParse(req.body);

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

    if(!req.file){
        return res.status(400).json({
        success: false,
        message: "file photo is required"
      });
    }

    const group = await groupService.createFreeGroup(parse.data, req.file.filename, req?.user?.id ?? "")

    return res.json({
        success: true,
        message:"create group success",
        data: group
    })

  } catch (error) {
    if (req.file) {
          fs.unlinkSync(req.file.path);
        }
    next(error);
  }
};

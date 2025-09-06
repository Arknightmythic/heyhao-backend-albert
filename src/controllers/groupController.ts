import type { NextFunction, Request, Response } from "express";
import { CustomeRequest } from "../types/CustomResquest";
import { groupFreeSchema, groupPaidSchema, joinFreeGroups } from "../utils/schema/group";
import * as groupService from "../services/groupServices";
import fs from "node:fs";

export const getDiscoverGroups = async(req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      const{name} =req.query
      const data = await groupService.getDiscoverGroups(name as string ?? "")

      return res.json({
      success: true,
      message: "get all group success",
      data: data,
    });
    } catch (error) {
      next(error)
    }
  }


export const getOwnGroups = async(
  req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      
      const data = await groupService.getMyOwngroup(req.user?.id ?? '')

      return res.json({
      success: true,
      message: "get myowngroup success",
      data: data,
    });
    } catch (error) {
      next(error)
    }
  }
export const getDiscoverePeople = async(req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      const{name} =req.query
      const data = await groupService.getDiscoverePeople(name as string ?? "", req?.user?.id)

      return res.json({
      success: true,
      message: "get all User success",
      data: data,
    });
    } catch (error) {
      next(error)
    }
  }
export const findDetailGroup = async(
  req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      const{id} =req.params
      const data = await groupService.findDetailGroup(id, req.user?.id ?? "")

      return res.json({
      success: true,
      message: "get detail group success",
      data: data,
    });
    } catch (error) {
      next(error)
    }
  }

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file photo is required",
      });
    }

    const group = await groupService.upsertFreeGroup(
      parse.data,
      req?.user?.id ?? "",
      req.file.filename,
    );

    return res.json({
      success: true,
      message: "create group success",
      data: group,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};
export const updateFreeGroup = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {groupId} = req.params
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

   
    const group = await groupService.upsertFreeGroup(
      parse.data,
      req?.user?.id ?? "",
      req?.file?.filename,
      groupId
    );

    return res.json({
      success: true,
      message: "update group success",
      data: group,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const createPaidGroup = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  // let filesToCleanup: (Express.Multer.File | Express.Multer.File[])[] = [];
  try {
    const parse = groupPaidSchema.safeParse(req.body);

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

    const file = req.files as {photo?:Express.Multer.File[], assets?: Express.Multer.File[]}


    if (!file.photo) {
      return res.status(400).json({
        success: false,
        message: "file photo is required",
      });
    }

    if(!file.assets){
      return res.status(400).json({
        success: false,
        message: "file assets is required",
      });
    }

    const assets = file.assets.map((file) => file.filename)
    const group = await groupService.upsertPaidGroup(parse.data, req?.user?.id ?? "",file.photo[0].filename, assets)

    return res.json({
      success: true,
      message: "create group success",
      data: group,
    });
  } catch (error) {

    next(error)
  }
};

export const updatePaidGroup = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {

  try {
    const{groupId} = req.params
    const parse = groupPaidSchema.safeParse(req.body);

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

    const file = req.files as {photo?:Express.Multer.File[], assets?: Express.Multer.File[]}



    // filesToCleanup = [file.photo, ...file.assets];
    const assets = file?.assets?.map((file) => file.filename)
    const group = await groupService.upsertPaidGroup(parse.data,  req?.user?.id ?? "", file?.photo?.[0].filename, assets, groupId)

    return res.json({
      success: true,
      message: "update group success",
      data: group,
    });
  } catch (error) {
 
    next(error)
  }
};


export const createMemberFreeGroup = async(
  req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      const parse = joinFreeGroups.safeParse(req.body);

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

    const data = await groupService.addMemberFreeGroups(parse.data.group_id, req?.user?.id ?? "")

    return res.json({
      success:true,
      message:"success to join the groups",
      data
    })
    } catch (error) {
      next(error)
    }
}


export const deleteAssetGroup = async(
  req: CustomeRequest,
  res: Response,
  next: NextFunction) =>{
    try {
      const {id} = req.params

    const data = await groupService.deleteAssetGroup(id)

    return res.json({
      success:true,
      message:"success delete asset group",
      data
    })
    } catch (error) {
      next(error)
    }
}
import type { NextFunction, Request, Response } from "express";
import { resetPasswordSchema, signInSchema, signUpSchema } from "../utils/schema/user";
import * as userService from "../services/userServices";
import fs from "node:fs";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Upload photo is required",
      });
    }

    const parse = signUpSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path}-${err.message}`
      );

      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "validation Error",
        detail: errorMessage,
      });
    }

    const newUser = await userService.signUp(parse.data, req.file);
    return res.json({
      success: true,
      message: "create user message",
      detail: newUser,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.safeParse(req.body);

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

    const data = await userService.signin(parse.data);
    return res.json({
      success: true,
      message: "sign in success",
      detail: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmailReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.pick({ email: true }).safeParse(req.body);
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

    await userService.getEmailReset(parse.data.email);

    return res.json({
      success: true,
      message: "reset link send to email",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = resetPasswordSchema.safeParse(req.body);

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

    const {tokenId} = req.params

    await userService.updatePassword(parse.data, tokenId)
    return res.json({
      success: true,
      message: "Reset Password success"
    })
  } catch (error) {
    next(error);
  }
};

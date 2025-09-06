import { NextFunction, Response } from "express";
import { CustomeRequest } from "../types/CustomResquest";
import { joinFreeGroups } from "../utils/schema/group";
import * as transactionsService from "../services/transactionServices";
import { withDrawSchema } from "../utils/schema/transactions";

export const createTransaction = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
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

    const data = await transactionsService.createTransaction(
      parse.data.group_id,
      req?.user?.id ?? ""
    );

    return res.json({
      success: true,
      message: "success to create transactions",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransactions = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionsService.updateTransaction(req.body.order_id, req.body.transaction_status)
    
    return res.json({
      success:true,
      message:"success update transaction",
      data
    })
  
  } catch (error) {
    next(error)
  }
};

export const getRevenueStat = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionsService.getRevenueStat(req?.user?.id ?? "")
    
    return res.json({
      success:true,
      message:"success get Revenue stat",
      data
    })
  
  } catch (error) {
    next(error)
  }
};

export const getHistoryPayouts = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionsService.getHistoryPayouts(req?.user?.id ?? "")
    
    return res.json({
      success:true,
      message:"success get history payouts",
      data
    })
  
  } catch (error) {
    next(error)
  }
};

export const getBalance = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await transactionsService.getBalance(req?.user?.id ?? "")
    
    return res.json({
      success:true,
      message:"success get balance",
      data
    })
  
  } catch (error) {
    next(error)
  }
};


export const createWithDraw = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = withDrawSchema.safeParse(req.body);

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

    const data = await transactionsService.createWithDraw(
      parse.data,
      req?.user?.id ?? ""
    );

    return res.json({
      success: true,
      message: "success to create withdraw",
      data,
    });
  } catch (error) {
    next(error);
  }
};

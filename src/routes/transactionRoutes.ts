import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as transactionsController from "../controllers/transactionController"
const transactionRoute = express.Router()


transactionRoute.post(
    "/transactions",
    verifyToken,
    transactionsController.createTransaction
    
)

transactionRoute.post(
    "/transactions/handle-payment",
    transactionsController.updateTransactions
)
transactionRoute.get(
    "/revenue",
    verifyToken,
    transactionsController.getRevenueStat
)

transactionRoute.get(
    "/payouts",
    verifyToken,
    transactionsController.getHistoryPayouts
)
transactionRoute.post(
    "/payouts",
    verifyToken,
    transactionsController.createWithDraw
)

transactionRoute.get(
    "/balance",
    verifyToken,
    transactionsController.getBalance
)

export default transactionRoute
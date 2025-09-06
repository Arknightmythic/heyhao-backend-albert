import * as groupRepositories from "../repositories/groupRepositories";
import * as transactionRepositories from "../repositories/transactionRepositories";
import * as userRepositories from "../repositories/userRepositories";
import { withdrawavalues } from "../utils/schema/transactions";
export const createTransaction = async (groupId: string, userId: string) => {
  const checkmember = await groupRepositories.getMemberbyId(userId, groupId);

  if (checkmember) {
    throw new Error("you already joined group");
  }

  const group = await groupRepositories.groupFindById(groupId);

  if (group.type === "FREE") {
    throw new Error("this is free");
  }

  const transaction = await transactionRepositories.createTransaction({
    price: group.price,
    owner: {
      connect: {
        id: group.room.members[0].user_id,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
    type: "PENDING",
    group: {
      connect: {
        id: groupId,
      },
    },
  });

  const user = await userRepositories.getUserById(userId);

  const MidtransUrl = process.env.MIDTRANS_URL ?? "";
  const MidtransSecretKey = process.env.MIDTRANS_AUTH_STRING ?? "";

  const midtransResponse = await fetch(MidtransUrl, {
    method: "POST",
    body: JSON.stringify({
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: user.email,
      },
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${MidtransSecretKey}`,
    },
  });

  const midtransJson = await midtransResponse.json();

  return midtransJson;
};

export const updateTransaction = async (order_id: string, status: string) => {
  switch (status) {
    case "capture":
    case "settlement": {
      const transaction = await transactionRepositories.updateTransaction(
        order_id,
        "SUCCESS"
      );
      const group = await groupRepositories.groupFindById(transaction.group_id);

      await groupRepositories.addMemberToGroup(
        group.room_id,
        transaction.user_id
      );

      return{
        transaction_id:transaction.id
      } 
    }
     case "pending": {
      console.log(`Transaction with order_id: ${order_id} is still pending.`);
      // Tidak ada perubahan status di database, biarkan tetap 'PENDING'
      return {
        message: "Transaction is pending",
        order_id: order_id,
      };
    }

    case "deny":
    case "cancel":
    case "expire":
    case "failure": {
      const transaction = await transactionRepositories.updateTransaction(
        order_id,
        "FAILED"
      );
      return{
        transaction_id:transaction.id
      } 
    }

    default:
      return {};
  }
};

export const getBalance = async(user_id:string) =>{
  const transactions = await transactionRepositories.getMyTransactions(user_id)
  const payouts = await transactionRepositories.getMyPayouts(user_id)
  
  const totalRevenue = transactions.reduce((acc, curr)=>{
    if (curr.type === "SUCCESS") {
      return acc+curr.price
    }
    return acc
  }, 0)

  const totalPayout = payouts.reduce((acc,curr)=> acc+curr.amount,0)
  return totalRevenue - totalPayout

}


export const getRevenueStat = async(user_id:string) =>{
  const transactions = await transactionRepositories.getMyTransactions(user_id)
  const payouts = await transactionRepositories.getMyPayouts(user_id)
  const group = await groupRepositories.getMyOwngroup(user_id)

  const totalRevenue = transactions.reduce((acc, curr)=>{
    if (curr.type === "SUCCESS") {
      return acc+curr.price
    }
    return acc
  }, 0)


  const totalPayout = payouts.reduce((acc,curr)=> acc+curr.amount,0)
  const balance = totalRevenue - totalPayout
  const totalVipGroups = group.filter((group)=>group.type==="PAID").length
  const totalVipMember = group.reduce((acc, curr)=>{
    if (curr.type === "PAID") {
      return acc + (curr?.room?._count?.members ?? 0)
    }
    return acc
  },0)

  const latestMemberVip = transactions.filter((transaction) =>transaction.type==="SUCCESS")

  return{
    balance,
    total_vip_groups: totalVipGroups,
    total_vip_members: totalVipMember,
    total_revenue: totalRevenue,
    latest_members: latestMemberVip

  }
}

export const getHistoryPayouts = async(user_id:string) =>{
  return await transactionRepositories.getMyPayouts(user_id)
}


export const createWithDraw = async(data:withdrawavalues, user_id:string) =>{
  const balance = await getBalance(user_id)

  if (balance<data.amount) {
    throw new Error("failed to create withdraw: insufficient balance")
  }

  return await transactionRepositories.createWithDraw(data, user_id)
}
import { Prisma, TransactionType } from "../generated/prisma";
import prisma from "../utils/prisma";
import { withdrawavalues } from "../utils/schema/transactions";

export const createTransaction = async(data:Prisma.TransactionCreateInput) =>{
    return await prisma.transaction.create({
        data
    })
}

export const updateTransaction = async(id:string, type:TransactionType) =>{
    return await prisma.transaction.update({
        where:{
            id
        },
        data:{
            type
        }
    })
}

export const getMyTransactions = async(user_id:string) =>{
    return await prisma.transaction.findMany({
        where:{
            owner_id:user_id
        },
        include:{
            user:{
                select:{
                    name:true,
                    photo_url:true
                }
            },
            group:{
                select:{
                    name:true,
                    photo_url:true
                }
            }
        }
    })
}


export const getMyPayouts = async(user_id :string) =>{
    return await prisma.payout.findMany({
        where:{
            user_id:user_id
        },
        orderBy:{
            created_at:"desc"
        }
    })
}

export const createWithDraw = async(data:withdrawavalues, user_id:string) =>{
    return await prisma.payout.create({
        data:{
            amount:data.amount,
            bank_name:data.bank_name,
            bank_account_name:data.bank_account_name,
            bank_account_number:data.bank_account_number.toString(),
            user_id:user_id,
            status:"PENDING"
        }
    })
}

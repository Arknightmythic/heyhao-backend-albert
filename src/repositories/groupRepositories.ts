import prisma from "../utils/prisma";
import { GroupFreeValues } from "../utils/schema/group";
import * as userRepositories from './userRepositories'

export const createFreeGroup = async(data:GroupFreeValues, photo:string, userId:string) =>{
    const owner = await userRepositories.findRole("OWNER")
    
    return await prisma.group.create({
        data:{
            photo: photo,
            name: data.name,
            about:data.about,
            price:0,
            type:"FREE",
            room:{
                create:{
                    created_by:userId,
                    name:data.name,
                    members:{
                        create:{
                            user_id:userId,
                            role_id:owner.id
                        }
                    },
                    is_group:true
                }
            }
        }
    })

}
import { GroupFreeValues } from "../utils/schema/group";
import * as groupRepositories from "../repositories/groupRepositories"

export const createFreeGroup = async(data:GroupFreeValues, photo:string, userId:string) =>{
    const group = await groupRepositories.createFreeGroup(data, photo, userId)

    return group
}
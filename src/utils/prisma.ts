import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient().$extends({
    result:{
        user:{
            photo_url:{
                needs:{
                    photo:true
                },
                compute(data){
                    if (data.photo) {
                        return `${process.env.URL_ASSET_PHOTO}${data.photo}`
                    }
                    return null
                }
            }
        },
        group:{
            photo_url:{
                needs:{
                    photo:true
                },
                 compute(data){
                    if (data.photo) {
                        return `${process.env.URL_ASSET_GRUP_PHOTO}${data.photo}`
                    }
                    return null
                }
            },
        },
        roomMessage:{
            content_url:{
                needs:{
                    content:true,
                    type:true
                },
                 compute(data){
                    if (data.type === "IMAGE" && data.content) {
                        return `${process.env.URL_ASSET_ATTACH}${data.content}`
                    }
                    return data.content
                }
            }
        }
    }
})

export default prisma
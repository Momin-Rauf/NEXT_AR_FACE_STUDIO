import dbConnect from '@/lib/dbConnect';

import UserModel from '@/app/model/User';

import {z} from "zod";
import { usernameValidation } from '@/schemas/signUpSchema';


const UserNameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }
        //zod validation
        const result = UserNameQuerySchema.safeParse(queryParam);
        console.log("result",result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({success:false,message:"failed"},{status:500});
        }

        const {username} = result.data

       const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({success:false,message:"username already taken"},{status:500});
   
        }
        else {
            return Response.json({success:true,message:"username available"},{status:201});
        }


    } catch (error) {
        console.error("error checking username",error)
        return Response.json({success:false,message:'error checking username'},{status:500})
    }
}
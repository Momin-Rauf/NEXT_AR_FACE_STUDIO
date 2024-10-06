import dbConnect from '@/lib/dbConnect';
import UserModel from '@/app/model/User';

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json();
      const decodedUsername =   decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});
        if (!user){
            console.error("error");
            return Response.json({success:false,message:'user not found'},{status:500})
        }
        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
    
        if (isCodeNotExpired && isCodeValid ) {
            user.isVerified = true;

            await user.save();

            return Response.json(
                {
                    success:true,
                    message:"Account Verified Successfully"
                },{status:200}
            )
        }

        else{
            return Response.json(
                {
                    success:false,
                    message:"not verified"
                },{status:500}
            )
        }


    
    }
    
    
    catch (error) {
        console.error("error",error)
        return Response.json({success:false,message:'error in verification'},{status:500})
    }
}
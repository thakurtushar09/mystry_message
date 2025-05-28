import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request:Request){
    await dbConnect();
    const {username,code} = request.json();
    const decodedUsername = decodeURIComponent(username);
    const user=await UserModel.findOne({username:decodedUsername});

    if(!user){
        return Response.json({
                success:false,
                message:"User not found"
            },{status:400})
    }

    const isCodeValid = user.verifyCode===code;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpire){
        user.isVerified = true;
        user.save();
        return Response.json({
                success:true,
                message:"User verified successfully"
            },{status:200})
    } else if(!isCodeValid) {
        return Response.json({
                success:false,
                message:"Verify code is incorrect"
            },{status:400})
    } else{
        return Response.json({
                success:false,
                message:"code expired"
            },{status:400})
    }


    try {
        
    } catch (error) {
        console.log("Error verifying user",error);
        return Response.json({
                success:false,
                message:"Error in verification"
            },{status:400})
        
    }
}
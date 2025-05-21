import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod/v4";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                success: false,
                message: "User already register"
            },{status:500})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser=new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        const emailResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status:500})
        }


        return Response.json({
                success: true,
                message: "User register successfully,please verified email"
            },{status:200})

    } catch (error) {
        console.error("Error in signup", error);
        return Response.json({
            success: false,
            message: "Error registring user"
        }, { status: 500 })
    }
}
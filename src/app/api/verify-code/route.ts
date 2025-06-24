import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }

    if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code is incorrect",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Verification code has expired",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error during verification",
      },
      { status: 500 }
    );
  }
}

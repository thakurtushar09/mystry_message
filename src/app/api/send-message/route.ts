import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { username, content } = await request.json();

    // Validate input
    if (!username || !content) {
      return Response.json({
        success: false,
        message: "Username and message content are required"
      }, { status: 400 });
    }

    console.log("Database connection state:", mongoose.connection.readyState);

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    console.log("User document:", user);
    console.log("isAcceptingMessage value:", user.isAcceptingMessages, typeof user.isAcceptingMessages);

    // Handle different possible truthy values
    const acceptsMessages = user.isAcceptingMessages === true || 
                          user.isAcceptingMessages === 'true' || 
                          user.isAcceptingMessages === 1;

    if (!acceptsMessages) {
      return Response.json({
        success: false,
        message: `User ${username} is not accepting messages at this time`,
        debug: {
          actualValue: user.isAcceptingMessages,
          type: typeof user.isAcceptingMessages,
          convertedValue: acceptsMessages
        }
      }, { status: 403 });
    }

    // Update using direct query
    const updateResult = await UserModel.updateOne(
      { username },
      { $push: { messages: { content, createdAt: new Date() } } }
    );

    console.log("Update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return Response.json({
        success: false,
        message: "Failed to save message"
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Message sent successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error in send-message API:", error);
    return Response.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
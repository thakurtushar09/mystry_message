import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'Mystry Message <no-reply@mystrymessage.live>',
      to: email,
      subject: 'Mystry Message | Verification code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: `Verification email sent successfully to ${email}`,
    };
  } catch (error) {
    console.log('Error sending verification email:', error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}

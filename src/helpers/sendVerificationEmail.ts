import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "thaileshdev@gmail.com",
      to: email,
      subject: "mystry message verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("thailesh sinha mera naam", data);

    return { success: true, message: "verification send successfully" };
  } catch (err) {
    console.log("error sending verification", err);
    return { success: false, message: "failed to send verification" };
  }
}

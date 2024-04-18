import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  console.log("shubham sinha");
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerifyed: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        { status: 400 }
      );
    }
    const existUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existUserByEmail) {
      if (existUserByEmail.isVerifyed) {
        return Response.json(
          {
            success: false,
            message: "user alredy exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existUserByEmail.password = hashPassword;
        existUserByEmail.verifyCode = verifyCode;
        existUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existUserByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerifyed: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        sendVerificationEmail,
        message: "user registered successfully please veridy your email",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("error registering user", err);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      { status: 500 }
    );
  }
}

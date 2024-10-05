import dbConnect from '@/lib/dbConnect';
import UserModel from '@/app/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerification = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerification) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Username already taken',
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Email is already registered and verified',
          }),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour ahead

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
    }

    const mail = await sendVerificationEmail(email, username, verifyCode);
    if (!mail.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: mail.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully. Please check your email for the verification code.',
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error registering user',
      }),
      { status: 500 }
    );
  }
}

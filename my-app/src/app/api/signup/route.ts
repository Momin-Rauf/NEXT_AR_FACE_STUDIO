import dbConnect from '@/lib/dbConnect';
import UserModel from '@/app/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const res = await request.json();
    const { username, email, password } = res;
    console.log(username, email, password);

    // Check if the username is already taken and verified
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

    // Check if email or username is already registered
    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByUsername = await UserModel.findOne({ username });
    console.log("existingUserByEmail", existingUserByEmail);
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

    // If either email or username exists
    if (existingUserByEmail || existingUserByUsername) {
      const checkUser = existingUserByEmail || existingUserByUsername;

      // Check if the user exists and is verified
      if (checkUser && checkUser.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Email or username is already registered and verified',
          }),
          { status: 400 }
        );
      } else if (checkUser) { // Additional check to ensure checkUser is not null
        console.log('Updating existing unverified user');
        const hashedPassword = await bcrypt.hash(password, 10);
        checkUser.password = hashedPassword;
        checkUser.verifyCode = verifyCode;
        checkUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await checkUser.save();
      }
    } else {
      // Create new user if neither email nor username exists
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

    // Send verification email
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

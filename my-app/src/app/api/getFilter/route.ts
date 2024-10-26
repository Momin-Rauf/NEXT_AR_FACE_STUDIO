import UserModel from '../../model/User';
import dbConnect from '@/lib/dbConnect';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get JWT Token
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in first" },
        { status: 401 }  // Unauthorized
      );
    }

    // Find the current user by email
    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user's model data
    const modelData = user.userfilter;  
    return NextResponse.json({ modelData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user model data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

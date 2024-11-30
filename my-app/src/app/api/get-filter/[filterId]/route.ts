// pages/api/get-filter/[filterId].ts

import UserModel from '../../../model/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest, { params }: { params: { filterId: string } }) {
  try {
    // Connect to the database
    console.log(params);
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
   
    // Extract filterId from params (dynamic route)
    const { filterId } = params;
    console.log(filterId);

    // Find the filter with the given filterId from the user's userfilter array
    const filter = user.userfilter.find(f => f._id.toString() === filterId);
    console.log(filter);
    if (!filter) {
      return NextResponse.json({ message: 'Filter not found' }, { status: 404 });
    }

    // Return the specific filter data
    return NextResponse.json({ filter }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user filter data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

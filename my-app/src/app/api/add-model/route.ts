import UserModel from '../../model/User';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
import mongoose from 'mongoose'; // Import mongoose for ObjectId
import UserFilter from '../../model/User';
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get JWT Token
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
    console.log(token, "in api ");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in first" },
        { status: 400 }
      );
    }
    
    // Find the current user by email
    const user = await UserModel.findOne({ email: token.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Parse the request body
    const body = await request.json();
    console.log(body);
    const { image_url, model_data, category } = body;

    // Create a new user filter object with explicit type
    const newFilter: UserFilter = {
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
      image_url,
      model_data,
      category,
      createdAt: new Date(), // Add the createdAt property
    };

    // Push the new filter into the user's userfilter array
    user.userfilter.push(newFilter);

    // Save the updated user with the new filter
    await user.save();

    // Return the newly created filter as the response
    return NextResponse.json({ message: 'User filter added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user filter:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

import UserModel from '../../../model/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


export async function POST(request: NextRequest, { params }: { params: { filterId: string } }) {
  try {
    // Connect to the database
    await dbConnect();

    // Get JWT Token
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please sign in first" },
        { status: 401 }
      );
    }

    // Find the current user by email
    const user = await UserModel.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find the user filter by the filterId
    const filterId = params.filterId;
    console.log(filterId);
    const filter = user.userfilter.id(filterId); // Assuming userfilter is an array of sub-documents
    console.log(filter); // Get the filter by ID from the user’s filter array

    if (!filter) {
      return NextResponse.json({ message: 'Filter not found' }, { status: 404 });
    }

    // Parse request body (ensure body is parsed as JSON)
    const body = await request.json();
    const { rotation, position, scale } = body;

    // Update the model data (rotation, position, scale)
    if (rotation) filter.rotation = rotation;
    if (position) filter.position = position;
    if (scale) filter.scale = scale;

    // Save the updated user
    await user.save();

    // Respond with the updated filter
    return NextResponse.json({ message: 'Model updated successfully', filter }, { status: 200 });
  } catch (error) {
    console.error('Error updating user filter:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

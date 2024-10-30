import UserModel from '../../model/User';
import dbConnect from '@/lib/dbConnect';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import mongoose from 'mongoose';
import { z } from "zod";
import { UserFilterSchema } from "@/schemas/UserFilterSchema"; // import your zod schema here

export async function POST(request: NextRequest) {
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

    // Parse and validate the request body using Zod
    const body = await request.json();
    const parsedData = UserFilterSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: 'Invalid data format', errors: parsedData.error }, { status: 400 });
    }

    const { image_url, model_data, category, rotation, position, scale, anchor, title, description, date } = parsedData.data;

    // Create a new user filter object
    const newFilter = {
      _id: new mongoose.Types.ObjectId(),
      image_url,
      model_data,
      category,
      rotation,
      position,
      scale,
      anchor,
      title,
      description,
      date,
      createdAt: new Date(),
    };

    // Push the new filter into the user's userfilter array
    user.userfilter.push(newFilter);
    await user.save();

    return NextResponse.json({ message: 'User filter added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user filter:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

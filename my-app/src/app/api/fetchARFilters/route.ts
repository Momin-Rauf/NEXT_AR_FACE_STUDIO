// pages/api/fetchUserFilters.js
import UserFilterModel from '../../model/UserFilter'; // Adjust the path as necessary
import dbConnect from '@/lib/dbConnect'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all user filters
    const userFilters = await UserFilterModel.find({}); // Fetch all documents in the userfilters collection

    if (!userFilters || userFilters.length === 0) {
      return NextResponse.json({ message: 'No user filters found' }, { status: 404 });
    }

    // Return the user filters data
    return NextResponse.json({ userFilters }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user filters:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

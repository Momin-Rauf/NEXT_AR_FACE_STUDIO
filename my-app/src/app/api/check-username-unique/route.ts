import dbConnect from '@/lib/dbConnect';
import UserModel from '@/app/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
import { NextResponse } from 'next/server';

// Define the Zod schema for username validation
const UserNameQuerySchema = z.object({
    username: usernameValidation,
});

// Handle POST requests to check username uniqueness
export async function POST(request: Request) {
    await dbConnect();

    try {
        // Parse the JSON body from the request
        const { username } = await request.json();

        // Validate the username using Zod
        const result = UserNameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.error('Validation errors:', usernameErrors);
            return NextResponse.json(
                { success: false, message: "Invalid username", errors: usernameErrors },
                { status: 400 }
            );
        }

        // Check for existing verified user with the same username
        const existingVerifiedUser = await UserModel.findOne({ username: result.data.username, isVerified: true });
        if (existingVerifiedUser) {
            return NextResponse.json(
                { success: false, message: "Username already taken" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Username available" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json(
            { success: false, message: 'Error checking username' },
            { status: 500 }
        );
    }
}

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/app/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

// Define the Zod schema for username validation
const UserNameQuerySchema = z.object({
    username: usernameValidation,
});

// Handle GET requests to check username uniqueness
export async function GET(request: Request) {
    await dbConnect();

    try {
        // Parse the query parameters from the request URL
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Validate the username using Zod
        const result = UserNameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.error('Validation errors:', usernameErrors);
            return Response.json({ success: false, message: "Invalid username", errors: usernameErrors }, { status: 400 });
        }

        // Check for existing verified user with the same username
        const existingVerifiedUser = await UserModel.findOne({ username: result.data.username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username already taken" }, { status: 409 });
        }

        return Response.json({ success: true, message: "Username available" }, { status: 200 });
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json({ success: false, message: 'Error checking username' }, { status: 500 });
    }
}

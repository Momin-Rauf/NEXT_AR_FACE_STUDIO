import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Use the VerificationEmail component if needed
        const emailBody = VerificationEmail({ username, otp: verifyCode });

        // Send the email
        const sendResponse = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',  // Ensure this is verified
            to: email,
            subject: 'AR Face Studio | Verification Code',
            react: emailBody,  // Use the rendered email body
        });

        console.log('Email sent successfully:', sendResponse);  // Log the response
        return { success: true, message: 'Verification email sent successfully' };
    } catch (emailError) {
        console.error("Error sending email:", emailError);  // Log the full error
        return { success: false, message: 'Failed to send verification email' };
    }
}

import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';

import { ApiResponse } from '@/types/ApiResponse';


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifiyCode:string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'AR Face Studio | Verification Code',
            react: VerificationEmail({username,otp:verifiyCode}),
          });
        return {success:true,message:'Verification email send successfully'}
    } catch (emailError) {
        console.log("error sending email",emailError);
        return {success:false,message:'failed to send verification email'}

    }
}
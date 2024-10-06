import transporter from '@/lib/transporter';
import { ApiResponse } from '@/types/ApiResponse';
// import { renderToStaticMarkup } from 'react-dom/server';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the VerificationEmail component to a static HTML string
    // const emailBody = renderToStaticMarkup(VerificationEmail({ username, otp: verifyCode }));

    const message = {
      from: process.env.GOOGLE_EMAIL,  // Ensure GOOGLE_EMAIL is set in your environment
      to: email,
      subject: 'AR Face Studio | Verification Code',
      html: `<h2>This is your verification code </h2><pre><b>${verifyCode}</b></pre>` // Now this is a string, not a JSX.Element
    };

    // Await the sendMail function to handle it as a promise
    const sendResponse = await transporter.sendMail(message);

    console.log('Email sent successfully:', sendResponse);  // Log the response from Nodemailer
    return { success: true, message: 'Verification email sent successfully' };
  } catch (emailError) {
    console.error('Error sending email:', emailError);  // Log any error that occurs
    return { success: false, message: 'Failed to send verification email' };
  }
}

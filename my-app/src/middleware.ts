import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    console.log('Middleware invoked'); // Check if middleware is hit
    
    const token = await getToken({ req: request });
    console.log('Token:', token); // Log the token value

    const { pathname, searchParams } = request.nextUrl;
    console.log('Requested Path:', pathname); // Log the requested path

    // If the user is authenticated and trying to access the sign-in page, redirect them away
    if (token && pathname.startsWith('/SignIn')) {
        console.log('Redirecting from SignIn to Home'); // Log redirection
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If the user is not authenticated and tries to access protected routes, redirect to sign-in page
    if (!token && (pathname.startsWith('/As') || pathname.startsWith('/FaceStudio'))) {
        const redirectUrl = new URL('/SignIn', request.url);
        if (!searchParams.has('callbackUrl')) {
            redirectUrl.searchParams.set('callbackUrl', request.url);
        }
        console.log('Redirecting to SignIn:', redirectUrl.toString()); // Log the redirect URL
        return NextResponse.redirect(redirectUrl);
    }

    console.log('Request continues'); // Log when the request continues
    return NextResponse.next();
}


export const config = {
  matcher: ['/', '/SignIn', '/FaceStudio'],
};

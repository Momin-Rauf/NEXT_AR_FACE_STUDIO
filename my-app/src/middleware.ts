import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // If the user is already authenticated and is trying to access the sign-in page, redirect them away
    if (token && url.pathname.startsWith('/SignIn')) {
        return NextResponse.redirect(new URL('/', request.url)) // Redirect to home if signed in
    }

    // If the user is not authenticated and tries to access protected routes, redirect to the sign-in page
    if (!token && (url.pathname.startsWith('/AssetsPage') || url.pathname.startsWith('/FaceStudio'))) {
        return NextResponse.redirect(new URL('/SignIn', request.url)) // Redirect to sign-in page if not authenticated
    }

   

    // Allow the request to continue for authenticated users on protected routes or public routes
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/SignIn', '/AssetsPage', '/FaceStudio']
}

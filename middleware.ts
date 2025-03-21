import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const { pathname } = req.nextUrl

                // allow auth related routes
                if(
                    pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register"
                ){
                    return true
                }

                if(pathname === '/' || pathname.startsWith('api/products')){
                    return true;
                }

                if(pathname.startsWith("/api/webhooks")){
                    return true;
                }

                // Require authentication for user-details
                if(pathname.startsWith("/user-details")) {
                    return !!token;
                }

                return !!token
            }
        }
    }
)

export const config = {
    matcher: [
    '/',
    // '/profile/:profileId*',
    '/user-details',
    '/login',
    '/signup',
    '/api/:path*',
    ]
}
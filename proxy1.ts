import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/forgot-password(.*)',
    '/api/(.*)',
]);

const isAuthRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const userId = (await auth()).userId;

    if(userId && isAuthRoute(req)) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (userId || isPublicRoute(req)) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/sign-in', req.url));
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
    const sessionId = req.cookies.get('session_id')?.value;
    const { pathname } = req.nextUrl;

    // Allow public routes
    if (pathname === '/login' || pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    // Redirect to login if no session
    if (!sessionId) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Let it pass (Redis verification happens in API/Server actions if needed)
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)'],
};

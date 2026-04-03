import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear session cookie
    response.cookies.set('session_id', '', {
        maxAge: 0,
        path: '/',
    });

    return response;
}

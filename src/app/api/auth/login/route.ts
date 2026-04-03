import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const superadminEmail = process.env.SUPERADMIN_EMAIL || 'admin@mediusware.com';
        const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'mediusware_secure_2026';

        if (email === superadminEmail && password === superadminPassword) {
            const sessionId = uuidv4();
            const sessionData = JSON.stringify({ email, role: 'superadmin' });

            // Store session in Redis for 24 hours
            await redis.set(`session:${sessionId}`, sessionData, 'EX', 86400);

            const response = NextResponse.json({ success: true, message: 'Login successful' });

            // Set secure cookie
            response.cookies.set('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 86400, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error: any) {
        console.error('Auth Login Error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

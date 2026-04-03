import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Use Intellix Proxy API
        const apiUrl = process.env.INTELLIX_API_URL || 'http://10.0.0.52:6969/chat';
        const apiPassword = process.env.INTELLIX_API_PASSWORD || 'mediusware_secure_2026';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Password': apiPassword,
            },
            body: JSON.stringify({
                messages: messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API responded with status ${response.status}`);
        }

        const data = await response.json();
        const finalContent = data.message?.content || 'No response generated.';

        return NextResponse.json({
            role: 'assistant',
            content: finalContent
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);

        // Try to extract more details if it's an HTTP error
        let details = error.message;
        if (error.response && error.response.body) {
            try {
                const body = await error.response.json();
                details = body.error || details;
                console.error('Provider Error Details:', body);
            } catch (e) { }
        }

        return NextResponse.json({
            error: 'Failed to generate response',
            details: details
        }, { status: 500 });
    }
}

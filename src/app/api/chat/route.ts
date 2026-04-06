import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Configuration
        const apiUrl = process.env.INTELLIX_API_URL || 'http://10.0.0.52:6969/chat';
        const apiPassword = process.env.INTELLIX_API_PASSWORD || 'mediusware_secure_2026';

        // Clean messages - only send role and content (IMPORTANT: strip timestamp etc.)
        const cleanMessages = messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
        }));

        console.log('Sending request to Intellix Proxy:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Password': apiPassword,
            },
            body: JSON.stringify({
                model: 'intellix', // Match the model seen in user's curl response
                messages: cleanMessages,
                stream: false,
            }),
        });

        if (!response.ok) {
            let errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { error: errorText };
            }
            console.error('Intellix Proxy Error Response:', errorData);
            throw new Error(errorData.error || errorData.message || `API responded with status ${response.status}`);
        }

        const rawData = await response.text();
        console.log('Intellix Proxy Raw Response:', rawData);

        let data;
        try {
            data = JSON.parse(rawData);
        } catch (e) {
            // If it's not JSON, maybe it's a plain text response
            return NextResponse.json({
                role: 'assistant',
                content: rawData.trim() || 'No response generated.'
            });
        }

        // Check for error field in JSON (common in Some Proxies like Ollama)
        if (data.error) {
            console.error('Intellix Proxy JSON Error:', data.error);
            throw new Error(data.error);
        }

        // Robust parsing logic for different formats
        let finalContent = 'No response generated.';

        if (data.message?.content) {
            finalContent = data.message.content;
        } else if (data.choices && data.choices[0]?.message?.content) {
            // OpenAI format
            finalContent = data.choices[0].message.content;
        } else if (data.choices && data.choices[0]?.text) {
            // Completion format
            finalContent = data.choices[0].text;
        } else if (data.response) {
            // Custom response field
            finalContent = data.response;
        } else if (data.text) {
            // Simple text field
            finalContent = data.text;
        } else if (typeof data === 'string') {
            finalContent = data;
        }

        return NextResponse.json({
            role: 'assistant',
            content: finalContent
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);

        return NextResponse.json({
            error: 'Failed to generate response',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}

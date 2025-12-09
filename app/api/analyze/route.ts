import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuery } from '@/helper/ai_agent';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Query parameter "q" is required' },
                { status: 400 }
            );
        }

        const result = await analyzeQuery(query);

        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error: any) {
        console.error('API Analysis Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Query field is required in request body' },
                { status: 400 }
            );
        }

        const result = await analyzeQuery(query);

        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error: any) {
        console.error('API Analysis Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        await db.init();
        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Init error:', error);
        return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
    }
}

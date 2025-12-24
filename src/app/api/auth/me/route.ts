import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.getUserById(userId);

        if (!user || !user.isActive) {
            return NextResponse.json({ error: 'User not found or inactive' }, { status: 404 });
        }

        const { passwordHash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await db.getUserByEmail(email);

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // In a real app, compare hashed passwords
        if (user.passwordHash !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
        }

        // Return user without password
        const { passwordHash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

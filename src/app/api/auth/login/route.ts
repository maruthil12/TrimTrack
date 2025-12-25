import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        console.log('Login attempt for email:', email);

        const user = await db.getUserByEmail(email);
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found in database');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        console.log('Checking password. Expected:', user.passwordHash, 'Received:', password);

        // In a real app, compare hashed passwords
        if (user.passwordHash !== password) {
            console.log('Password mismatch');
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isActive) {
            console.log('User account is inactive');
            return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
        }

        // Return user without password
        const { passwordHash, ...safeUser } = user;
        console.log('Login successful for user:', safeUser.email);
        return NextResponse.json({ user: safeUser });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

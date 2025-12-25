import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json({
                error: 'Name, email, and password are required'
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                error: 'Password must be at least 6 characters'
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                error: 'Invalid email format'
            }, { status: 400 });
        }

        // Check if email already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({
                error: 'An account with this email already exists'
            }, { status: 409 });
        }

        // Create new employee account
        const newUser = await db.createUser({
            id: uuidv4(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            role: 'EMPLOYEE',
            passwordHash: password, // Note: In production, hash this with bcrypt
            sharePercentage: 40, // Default share percentage
            isActive: true
        });

        // Return success without password
        const { passwordHash, ...safeUser } = newUser;

        return NextResponse.json({
            message: 'Account created successfully',
            user: safeUser
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({
            error: 'Failed to create account. Please try again.'
        }, { status: 500 });
    }
}

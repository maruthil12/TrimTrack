import { NextResponse } from 'next/server';

// Redirect to NextAuth Google provider
export async function GET(request: Request) {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Redirect to NextAuth Google sign-in
    return NextResponse.redirect(`${baseUrl}/api/auth/signin/google`);
}

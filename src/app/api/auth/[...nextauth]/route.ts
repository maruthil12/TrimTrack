import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (!user.email) {
                    return false;
                }

                // Check if user exists
                let existingUser = await db.getUserByEmail(user.email);

                if (!existingUser) {
                    // Create new employee account
                    existingUser = await db.createUser({
                        id: uuidv4(),
                        name: user.name || user.email.split('@')[0],
                        email: user.email,
                        role: 'EMPLOYEE',
                        passwordHash: '', // No password for OAuth users
                        sharePercentage: 40,
                        isActive: true,
                    });
                }

                return true;
            } catch (error) {
                console.error('Sign in error:', error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                const dbUser = await db.getUserByEmail(user.email!);
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.sharePercentage = dbUser.sharePercentage;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.sharePercentage = token.sharePercentage as number;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

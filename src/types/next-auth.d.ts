import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            sharePercentage: number;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        role: string;
        sharePercentage: number;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        sharePercentage: number;
    }
}

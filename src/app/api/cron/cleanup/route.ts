import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.getUserById(userId);

        if (!user || user.role !== 'OWNER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const transactions = await db.getTransactions();

        // In a real app, you would generate a CSV and email it
        console.log(`Archiving ${transactions.length} transactions for ${user.email}`);

        // Clear all transactions
        await db.clearTransactions();

        return NextResponse.json({
            message: 'Monthly cleanup successful',
            deletedCount: transactions.length,
            reportSentTo: user.email
        });

    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await db.getTransactions();
        return NextResponse.json({ transactions });

    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, date, note } = await request.json();
        const user = await db.getUserById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const transaction = {
            id: crypto.randomUUID(),
            userId: user.id,
            amount: parseFloat(amount),
            date,
            note: note || '',
            status: 'PENDING' as const,
            employeeShare: parseFloat(amount) * (user.sharePercentage / 100),
            ownerShare: parseFloat(amount) * ((100 - user.sharePercentage) / 100),
            createdAt: new Date().toISOString()
        };

        await db.addTransaction(transaction);
        return NextResponse.json({ transaction });

    } catch (error) {
        console.error('Create transaction error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Predefined list of employees to seed
const EMPLOYEES = [
    { name: 'Rajesh Kumar', email: 'rajesh@trimtrack.com', password: 'rajesh@123', sharePercentage: 35 },
    { name: 'Priya Sharma', email: 'priya@trimtrack.com', password: 'priya@456', sharePercentage: 40 },
    { name: 'Amit Patel', email: 'amit@trimtrack.com', password: 'amit@789', sharePercentage: 38 },
    { name: 'Sneha Reddy', email: 'sneha@trimtrack.com', password: 'sneha@321', sharePercentage: 42 },
    { name: 'Vikram Singh', email: 'vikram@trimtrack.com', password: 'vikram@654', sharePercentage: 37 },
    { name: 'Anjali Gupta', email: 'anjali@trimtrack.com', password: 'anjali@987', sharePercentage: 41 },
    { name: 'Rahul Verma', email: 'rahul@trimtrack.com', password: 'rahul@147', sharePercentage: 36 },
    { name: 'Deepika Nair', email: 'deepika@trimtrack.com', password: 'deepika@258', sharePercentage: 39 },
];

export async function POST(request: Request) {
    try {
        const results = {
            created: [] as string[],
            skipped: [] as string[],
            errors: [] as string[]
        };

        for (const employee of EMPLOYEES) {
            try {
                // Check if employee already exists
                const existingUser = await db.getUserByEmail(employee.email);

                if (existingUser) {
                    results.skipped.push(`${employee.name} (${employee.email}) - already exists`);
                    continue;
                }

                // Create new employee
                await db.createUser({
                    id: uuidv4(),
                    name: employee.name,
                    email: employee.email,
                    role: 'EMPLOYEE',
                    passwordHash: employee.password,
                    sharePercentage: employee.sharePercentage,
                    isActive: true
                });

                results.created.push(`${employee.name} (${employee.email})`);
            } catch (error) {
                results.errors.push(`${employee.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return NextResponse.json({
            message: 'Employee seeding completed',
            summary: {
                total: EMPLOYEES.length,
                created: results.created.length,
                skipped: results.skipped.length,
                errors: results.errors.length
            },
            details: results
        });

    } catch (error) {
        console.error('Seed employees error:', error);
        return NextResponse.json({
            error: 'Failed to seed employees',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

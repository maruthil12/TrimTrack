import { sql } from '@vercel/postgres';
import { User, Transaction } from './types';

export const db = {
    // Initialize database tables
    async init() {
        try {
            // Create users table
            await sql`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    role TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    share_percentage INTEGER NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT true,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                )
            `;

            // Create transactions table
            await sql`
                CREATE TABLE IF NOT EXISTS transactions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    amount DECIMAL(10, 2) NOT NULL,
                    date TEXT NOT NULL,
                    note TEXT,
                    status TEXT NOT NULL,
                    employee_share DECIMAL(10, 2) NOT NULL,
                    owner_share DECIMAL(10, 2) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `;

            // Seed initial users if empty
            const { rows } = await sql`SELECT COUNT(*) as count FROM users`;
            if (rows[0].count === '0') {
                await sql`
                    INSERT INTO users (id, name, email, role, password_hash, share_percentage, is_active, created_at)
                    VALUES 
                        ('1', 'Admin Owner', 'admin@trimtrack.com', 'OWNER', 'admin123', 60, true, NOW()),
                        ('2', 'John Employee', 'john@trimtrack.com', 'EMPLOYEE', 'user123', 40, true, NOW())
                `;
            }

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    },

    async getUsers(): Promise<User[]> {
        const { rows } = await sql`SELECT * FROM users WHERE is_active = true`;
        return rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role as 'OWNER' | 'EMPLOYEE',
            passwordHash: row.password_hash,
            sharePercentage: row.share_percentage,
            isActive: row.is_active,
            createdAt: row.created_at
        }));
    },

    async getUserByEmail(email: string): Promise<User | undefined> {
        try {
            console.log('DB: Looking up user by email:', email);
            const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
            console.log('DB: Query returned', rows.length, 'rows');

            if (rows.length === 0) return undefined;

            const row = rows[0];
            console.log('DB: Found user:', row.email, 'Role:', row.role);

            return {
                id: row.id,
                name: row.name,
                email: row.email,
                role: row.role as 'OWNER' | 'EMPLOYEE',
                passwordHash: row.password_hash,
                sharePercentage: row.share_percentage,
                isActive: row.is_active,
                createdAt: row.created_at
            };
        } catch (error) {
            console.error('DB Error in getUserByEmail:', error);
            throw error;
        }
    },

    async getUserById(id: string): Promise<User | undefined> {
        const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
        if (rows.length === 0) return undefined;

        const row = rows[0];
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role as 'OWNER' | 'EMPLOYEE',
            passwordHash: row.password_hash,
            sharePercentage: row.share_percentage,
            isActive: row.is_active,
            createdAt: row.created_at
        };
    },

    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        const { sharePercentage } = updates;
        if (sharePercentage !== undefined) {
            await sql`
                UPDATE users 
                SET share_percentage = ${sharePercentage}
                WHERE id = ${id}
            `;
        }
        const updatedUser = await this.getUserById(id);
        return updatedUser ?? null;
    },

    async getTransactions(): Promise<Transaction[]> {
        const { rows } = await sql`
            SELECT t.*, u.name as user_name 
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
                `;

        return rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            amount: parseFloat(row.amount),
            date: row.date,
            note: row.note,
            status: row.status as 'PENDING' | 'COLLECTED' | 'OVERDUE',
            employeeShare: parseFloat(row.employee_share),
            ownerShare: parseFloat(row.owner_share),
            createdAt: row.created_at,
            userName: row.user_name
        }));
    },

    async addTransaction(transaction: Transaction): Promise<Transaction> {
        await sql`
            INSERT INTO transactions(id, user_id, amount, date, note, status, employee_share, owner_share, created_at)
            VALUES(
                ${transaction.id},
                ${transaction.userId},
                ${transaction.amount},
                ${transaction.date},
                ${transaction.note || ''},
                ${transaction.status},
                ${transaction.employeeShare},
                ${transaction.ownerShare},
                NOW()
            )
        `;
        return transaction;
    },

    async deleteTransaction(id: string): Promise<void> {
        await sql`DELETE FROM transactions WHERE id = ${id} `;
    },

    async clearTransactions(): Promise<void> {
        await sql`DELETE FROM transactions`;
    }
};

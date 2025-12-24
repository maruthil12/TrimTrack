import { User, Transaction } from './types';

const STORAGE_KEYS = {
    USERS: 'trimtrack_users',
    TRANSACTIONS: 'trimtrack_transactions',
    CURRENT_USER: 'trimtrack_current_user'
};

// Seed initial data if empty
const seedData = () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const initialUsers: User[] = [
            {
                id: '1',
                name: 'Admin Owner',
                email: 'admin@trimtrack.com',
                role: 'OWNER',
                passwordHash: 'admin123',
                sharePercentage: 60,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'John Employee',
                email: 'john@trimtrack.com',
                role: 'EMPLOYEE',
                passwordHash: 'user123',
                sharePercentage: 40,
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
};

export const storage = {
    init: seedData,

    getUsers: (): User[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    },

    getUserByEmail: (email: string): User | undefined => {
        const users = storage.getUsers();
        return users.find(u => u.email === email);
    },

    saveUser: (user: User) => {
        const users = storage.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    },

    getTransactions: (): Transaction[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        return data ? JSON.parse(data) : [];
    },

    saveTransaction: (transaction: Transaction) => {
        const transactions = storage.getTransactions();
        const index = transactions.findIndex(t => t.id === transaction.id);
        if (index >= 0) {
            transactions[index] = transaction;
        } else {
            transactions.push(transaction);
        }
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        return transaction;
    },

    deleteTransaction: (id: string) => {
        const transactions = storage.getTransactions().filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    },

    clearTransactions: () => {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
};

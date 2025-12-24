export type Role = 'OWNER' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string; // In a real app, this would be hashed. For demo, we might store plain text or simple hash.
  sharePercentage: number; // Percentage of earnings the employee keeps (e.g., 40)
  paymentDeadlineDays?: number; // Number of days after entry to collect payment
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string; // Employee ID
  date: string; // ISO Date string YYYY-MM-DD
  amount: number;
  employeeShare: number;
  ownerShare: number;
  status: 'PENDING' | 'COLLECTED' | 'OVERDUE';
  note?: string;
  createdAt: string;
}

export interface AppData {
  users: User[];
  transactions: Transaction[];
}

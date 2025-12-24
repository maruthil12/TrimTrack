import { Transaction, User } from './types';
import { Parser } from 'json2csv';

export const generateMonthlyReport = (transactions: Transaction[], users: User[]) => {
    const userMap = new Map(users.map(u => [u.id, u.name]));

    const data = transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Employee: userMap.get(t.userId) || 'Unknown',
        Amount: t.amount,
        'Employee Share': t.employeeShare,
        'Owner Share': t.ownerShare,
        Status: t.status,
        Note: t.note || ''
    }));

    const fields = ['Date', 'Employee', 'Amount', 'Employee Share', 'Owner Share', 'Status', 'Note'];
    const parser = new Parser({ fields });
    return parser.parse(data);
};

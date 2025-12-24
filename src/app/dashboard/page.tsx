'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Transaction } from '@/lib/types';
import { Plus, LogOut, X, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<(Transaction & { userName?: string })[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'employees'>('overview');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // PIN Verification State
    const [pin, setPin] = useState('');
    const [isPinVerified, setIsPinVerified] = useState(false);
    const [pinError, setPinError] = useState('');

    // Form state
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit Share State
    const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
    const [newShare, setNewShare] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            if (user.role === 'EMPLOYEE') {
                setIsPinVerified(true);
                fetchTransactions();
            } else {
                const sessionPin = sessionStorage.getItem('owner_pin_verified');
                if (sessionPin === 'true') {
                    setIsPinVerified(true);
                    fetchTransactions();
                    fetchEmployees();
                }
            }
        }
    }, [user, isLoading, router]);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '2568') {
            setIsPinVerified(true);
            sessionStorage.setItem('owner_pin_verified', 'true');
            fetchTransactions();
            fetchEmployees();
        } else {
            setPinError('Invalid PIN code');
            setPin('');
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    const fetchTransactions = async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/transactions', {
                headers: { 'x-user-id': user.id }
            });
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchEmployees = async () => {
        if (!user || user.role !== 'OWNER') return;
        try {
            const res = await fetch('/api/users', {
                headers: { 'x-user-id': user.id }
            });
            if (res.ok) {
                const data = await res.json();
                setEmployees(data.users);
            }
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    date,
                    note
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                setAmount('');
                setNote('');
                fetchTransactions();
            }
        } catch (error) {
            console.error('Failed to add transaction', error);
        } finally {
            setSubmitting(false);
        }
    };

    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateShare = async (employeeId: string) => {
        if (!user) return;
        const share = parseFloat(newShare);

        if (isNaN(share) || share < 0 || share > 100) {
            setStatusMessage({ type: 'error', text: 'Invalid share percentage' });
            return;
        }

        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.id
                },
                body: JSON.stringify({
                    targetUserId: employeeId,
                    sharePercentage: share
                })
            });

            if (res.ok) {
                setEditingEmployee(null);
                setNewShare('');
                setStatusMessage({ type: 'success', text: 'Share percentage updated successfully' });
                await fetchEmployees();
                setTimeout(() => setStatusMessage(null), 3000);
            } else {
                const err = await res.json();
                setStatusMessage({ type: 'error', text: 'Failed to update share: ' + err.error });
            }
        } catch (error) {
            console.error('Failed to update share', error);
            setStatusMessage({ type: 'error', text: 'An error occurred while updating share' });
        }
    };

    const [isCleaning, setIsCleaning] = useState(false);

    const handleCleanup = async () => {
        if (!confirm('Are you sure you want to end the month? This will generate a report and DELETE all current transactions from the dashboard.')) {
            return;
        }

        setIsCleaning(true);
        try {
            const res = await fetch('/api/cron/cleanup', {
                method: 'POST',
                headers: { 'x-user-id': user!.id }
            });

            if (res.ok) {
                const data = await res.json();
                setStatusMessage({ type: 'success', text: `Cleanup successful. ${data.deletedCount} transactions archived.` });
                fetchTransactions();
            } else {
                const err = await res.json();
                setStatusMessage({ type: 'error', text: 'Cleanup failed: ' + err.error });
            }
        } catch (error) {
            console.error('Cleanup error', error);
            setStatusMessage({ type: 'error', text: 'An error occurred during cleanup' });
        } finally {
            setIsCleaning(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    if (isLoading || !user) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (user.role === 'OWNER' && !isPinVerified) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem' }}>Security Check</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please enter your owner PIN code to continue.</p>

                    <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {pinError && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>{pinError}</div>}

                        <input
                            type="password"
                            className="input"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter 4-digit PIN"
                            maxLength={4}
                            style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
                            autoFocus
                        />

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Verify PIN
                        </button>

                        <button type="button" onClick={logout} className="btn btn-secondary" style={{ width: '100%' }}>
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const totalEarned = transactions.reduce((acc, t) => acc + t.amount, 0);
    const myShare = user.role === 'EMPLOYEE'
        ? transactions.reduce((acc, t) => acc + t.employeeShare, 0)
        : transactions.reduce((acc, t) => acc + t.ownerShare, 0);

    const pendingAmount = transactions
        .filter(t => t.status === 'PENDING')
        .reduce((acc, t) => acc + (user.role === 'EMPLOYEE' ? t.employeeShare : t.ownerShare), 0);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.welcome}>Welcome back, {user.name} ({user.role})</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user.role === 'OWNER' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleCleanup}
                                className="btn"
                                style={{
                                    backgroundColor: '#fee2e2',
                                    color: '#ef4444',
                                    border: '1px solid #fecaca',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    padding: '0.5rem 1rem'
                                }}
                                disabled={isCleaning}
                            >
                                {isCleaning ? <Loader2 className="animate-spin" size={16} /> : 'End Month & Archive'}
                            </button>
                            <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className="btn"
                                    style={{
                                        backgroundColor: activeTab === 'overview' ? 'var(--primary-light)' : 'transparent',
                                        color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('employees')}
                                    className="btn"
                                    style={{
                                        backgroundColor: activeTab === 'employees' ? 'var(--primary-light)' : 'transparent',
                                        color: activeTab === 'employees' ? 'var(--primary)' : 'var(--text-secondary)',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Employees
                                </button>
                            </div>
                        </div>
                    )}
                    <button onClick={logout} className="btn btn-secondary">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </header>

            {activeTab === 'overview' ? (
                <>
                    <div className={styles.grid}>
                        <div className={`${styles.statCard} card animate-fade-in`} style={{ animationDelay: '0.1s' }}>
                            <div className={styles.statLabel}>Total Revenue</div>
                            <div className={styles.statValue}>₹{totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div className={`${styles.statCard} card animate-fade-in`} style={{ animationDelay: '0.2s' }}>
                            <div className={styles.statLabel}>Your Earnings</div>
                            <div className={styles.statValue} style={{ color: 'var(--primary)' }}>₹{myShare.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div className={`${styles.statCard} card animate-fade-in`} style={{ animationDelay: '0.3s' }}>
                            <div className={styles.statLabel}>Pending Collection</div>
                            <div className={styles.statValue} style={{ color: 'var(--accent)' }}>₹{pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Recent Transactions</h2>

                    <div className={`${styles.tableContainer} card`}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    {user.role === 'OWNER' && <th>Employee</th>}
                                    <th>Amount</th>
                                    <th>{user.role === 'EMPLOYEE' ? 'Your Share' : 'Owner Share'}</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingData ? (
                                    <tr><td colSpan={user.role === 'OWNER' ? 6 : 5} style={{ textAlign: 'center' }}>Loading...</td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={user.role === 'OWNER' ? 6 : 5} style={{ textAlign: 'center' }}>No transactions found.</td></tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            {user.role === 'OWNER' && <td>{t.userName}</td>}
                                            <td>₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td>
                                                ₹{(user.role === 'EMPLOYEE' ? t.employeeShare : t.ownerShare).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td>
                                                <span className={`${styles.status} ${t.status === 'PENDING' ? styles.statusPending :
                                                    t.status === 'COLLECTED' ? styles.statusCollected :
                                                        styles.statusOverdue
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td>{t.note || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="animate-fade-in">
                    <h2 className={styles.sectionTitle}>Manage Employees</h2>
                    {statusMessage && (
                        <div style={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                        }}>
                            {statusMessage.text}
                        </div>
                    )}
                    <div className={`${styles.tableContainer} card`}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Share Percentage</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.name}</td>
                                        <td>{emp.email}</td>
                                        <td>
                                            {editingEmployee === emp.id ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        style={{ width: '80px', padding: '0.25rem 0.5rem' }}
                                                        value={newShare}
                                                        onChange={(e) => setNewShare(e.target.value)}
                                                        placeholder={emp.sharePercentage.toString()}
                                                        min="0"
                                                        max="100"
                                                    />
                                                    <span>%</span>
                                                </div>
                                            ) : (
                                                <span>{emp.sharePercentage}%</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingEmployee === emp.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleUpdateShare(emp.id)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingEmployee(null)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingEmployee(emp.id);
                                                        setNewShare(emp.sharePercentage.toString());
                                                    }}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                >
                                                    Edit Share
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {user.role === 'EMPLOYEE' && (
                <button className={styles.fab} onClick={() => setIsModalOpen(true)}>
                    <Plus size={24} />
                </button>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modal} card`}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Add Daily Earnings</h3>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className={styles.form} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="label">Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Amount Earned (₹)</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Note (Optional)</label>
                                <textarea
                                    className="input"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

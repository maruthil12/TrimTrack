'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Auto-login after registration
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (loginResponse.ok) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Redirect to Google OAuth
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join TrimTrack as an employee</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="btn btn-google"
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }

                .auth-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .auth-header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1a202c;
                    margin-bottom: 8px;
                }

                .auth-header p {
                    color: #718096;
                    font-size: 14px;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2d3748;
                }

                .form-group input {
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-group input:disabled {
                    background-color: #f7fafc;
                    cursor: not-allowed;
                }

                .error-message {
                    background-color: #fed7d7;
                    color: #c53030;
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 14px;
                    border-left: 4px solid #c53030;
                }

                .btn {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                }

                .btn-google {
                    background: white;
                    color: #2d3748;
                    border: 2px solid #e2e8f0;
                }

                .btn-google:hover:not(:disabled) {
                    background: #f7fafc;
                    border-color: #cbd5e0;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    margin: 10px 0;
                }

                .divider::before,
                .divider::after {
                    content: '';
                    flex: 1;
                    border-bottom: 1px solid #e2e8f0;
                }

                .divider span {
                    padding: 0 15px;
                    color: #a0aec0;
                    font-size: 12px;
                    font-weight: 600;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 10px;
                }

                .auth-footer p {
                    color: #718096;
                    font-size: 14px;
                }

                .auth-footer a {
                    color: #667eea;
                    font-weight: 600;
                    text-decoration: none;
                }

                .auth-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

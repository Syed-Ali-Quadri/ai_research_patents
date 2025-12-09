'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';

export default function SignInPage() {
    const router = useRouter();
    const { isLoaded, setActive, signIn } = useSignIn();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [code, setCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!isLoaded) {
            setError('Sign-in component is not loaded yet. Please try again.');
            setLoading(false);
            return;
        }

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            // Check if sign-in is complete
            if (result.status === 'complete') {
                // Set the active session
                await setActive({ session: result.createdSessionId });
                // Redirect to home page
                router.push('/');
            } else if (result.status === 'needs_second_factor') {
                // Two-factor authentication required
                await signIn.prepareSecondFactor({ strategy: 'email_code' })
                setSecondFactor(true)
                setLoading(false)
            } else {
                // Handle other statuses if needed
                console.log("Sign-in status:", result.status);
                setError('Sign-in incomplete. Please try again.');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Sign-in error:', err);
            setError(err.errors?.[0]?.message || "Invalid email or password.");
            setLoading(false);
        }
    };

    const handleSecondFactorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!isLoaded) {
            setError('Sign-in component is not loaded yet. Please try again.');
            setLoading(false);
            return;
        }

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code: code,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push('/');
            } else {
                console.log("Second factor status:", result.status);
                setError('Verification failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Second factor error:', err);
            setError(err.errors?.[0]?.message || "Invalid verification code.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        SmartTech Forecast Engine
                    </h1>
                    <p className="text-gray-600">
                        {secondFactor ? 'Enter verification code' : 'Welcome back! Please sign in to continue'}
                    </p>
                </div>

                {!secondFactor ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 transition">
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSecondFactorSubmit} className="space-y-5">
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-600">
                                A verification code has been sent to your device
                            </p>
                        </div>

                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setSecondFactor(false)}
                            className="w-full text-indigo-600 py-2 text-sm hover:text-indigo-700 transition"
                        >
                            Back to sign in
                        </button>
                    </form>
                )}

                {!secondFactor && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
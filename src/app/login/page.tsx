'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full bg-surface font-body text-on-surface overflow-hidden">
            {/* Left Section: Aesthetic Image & Brand */}
            <section className="relative hidden md:flex md:w-1/2 h-full overflow-hidden items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Abstract Liquid Glass"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAz96wAGLlTVMBknsR1_JfhCC_i6q2YSEPDbb6UNjapVPVBMcakbHeF5HA1VdgLA_O0Fr9t0UdSIxESlqQfnlJislTtLumvgloXa1rxsHMQc9tg_3U-ZIRLDuN_wgOJc7VvcE_TVNNexlrMNfA8oxLmYFNPhdfWCDW3KRzqvXQy34D6OIAYfJZ9a7oiq9pT0bIguKFcJwpbiyq2L5TF4K1keHzua6nUFn_uGE0_6BeXcoAl1riWMEMPEvUbjrzpCJbfcdZm_tCp6Q"
                    />
                </div>
                {/* Branding Overlay */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10 glass-panel px-12 py-16 rounded-xl border border-white/20 max-w-md mx-8"
                >
                    <div className="flex flex-col items-start gap-6">
                        <div className="flex items-center gap-4">
                            <img src="/assets/images/intellixChat.png" alt="Logo" className="w-16 h-16 object-contain" />
                            <h1 className="font-headline font-extrabold text-5xl tracking-tighter leading-tight text-on-surface">
                                IntellixChat
                            </h1>
                        </div>
                        <p className="font-body text-on-surface-variant text-lg font-light leading-relaxed">
                            The next-generation AI assistant designed to think along with you.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Right Section: Login Interface */}
            <section className="w-full md:w-1/2 h-full flex flex-col items-center justify-center relative bg-surface-container-lowest">
                {/* Decorative 3D Spheres Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-tertiary/10 ethereal-blur"></div>
                    <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-surface-dim/40 ethereal-blur"></div>
                    <div className="absolute top-[40%] right-[5%] w-48 h-48 rounded-full bg-secondary-container/30 ethereal-blur"></div>
                </div>

                <div className="relative z-10 w-full max-w-md px-8">
                    <div className="mb-12">
                        <h2 className="font-headline font-bold text-3xl text-on-surface mb-2">Welcome back</h2>
                        <p className="text-on-surface-variant font-light">Enter your details to access your chat</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-surface-container-low/50 border-none ring-1 ring-outline-variant/30 rounded-xl px-4 py-4 focus:ring-2 focus:ring-tertiary-fixed transition-all placeholder:text-outline outline-none"
                                    placeholder="demo@gmail.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Password</label>
                                <a className="text-xs font-medium text-tertiary hover:underline" href="#">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <input
                                    className="w-full bg-surface-container-low/50 border-none ring-1 ring-outline-variant/30 rounded-xl px-4 py-4 focus:ring-2 focus:ring-tertiary-fixed transition-all placeholder:text-outline outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            className="w-full auth-gradient text-white font-headline font-semibold py-4 rounded-full shadow-xl shadow-tertiary/20 hover:scale-[1.02] active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login to Portal'}
                        </button>
                    </form>

                    <div className="mt-10 mb-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-outline-variant/20"></div>
                        <span className="text-xs font-medium text-outline uppercase tracking-wider">Or continue with</span>
                        <div className="h-px flex-1 bg-outline-variant/20"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-colors group">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="text-sm font-medium text-on-surface">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-colors group">
                            <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                            </svg>
                            <span className="text-sm font-medium text-on-surface">GitHub</span>
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-on-surface-variant text-sm font-light">
                            Don't have an account? <a className="text-tertiary font-semibold hover:underline" href="#">Create Account</a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="absolute bottom-0 w-full flex justify-center gap-6 p-8 z-10 font-body text-xs font-light text-slate-400">
                    <a className="hover:underline transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
                    <a className="hover:underline transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
                    <a className="hover:underline transition-all opacity-80 hover:opacity-100" href="#">Contact</a>
                    <span className="opacity-50">© 2026 <a href="http://www.mediusware.com">Mediusware</a>. All rights reserved.</span>
                </footer>
            </section>

            <header className="fixed top-0 w-full flex justify-between items-center px-8 py-6 z-50 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto cursor-default">
                    <img src="/assets/images/intellixChat.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-bold tracking-tighter text-slate-900 md:text-white">IntellixChat</span>
                </div>
            </header>
        </main>
    );
}

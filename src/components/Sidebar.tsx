'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PlusCircle, History, Settings, HelpCircle, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();

    const router = useRouter();

    const [chats, setChats] = React.useState<{ id: string, title: string }[]>([]);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [chatToDelete, setChatToDelete] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadChats = () => {
            const stored = localStorage.getItem('intellix_chats');
            if (stored) {
                try {
                    setChats(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse chats", e);
                }
            }
        };

        loadChats();
        window.addEventListener('chatUpdate', loadChats);
        return () => window.removeEventListener('chatUpdate', loadChats);
    }, []);

    const navItems = [
        { icon: <PlusCircle size={20} />, label: 'New Chat', href: '/', active: pathname === '/' },
        { icon: <History size={20} />, label: 'History', href: '#', active: false },
        // { icon: <Settings size={20} />, label: 'Settings', href: '#', active: false },
        // { icon: <HelpCircle size={20} />, label: 'Support', href: '#', active: false },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteChat = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setChatToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!chatToDelete) return;

        const stored = localStorage.getItem('intellix_chats');
        if (stored) {
            const chats = JSON.parse(stored);
            const updatedChats = chats.filter((c: any) => c.id !== chatToDelete);
            localStorage.setItem('intellix_chats', JSON.stringify(updatedChats));
            setChats(updatedChats);

            // If deleting the current chat, redirect to home
            if (pathname === `/chat/${chatToDelete}`) {
                router.push('/');
            }
        }
        setShowDeleteModal(false);
        setChatToDelete(null);
    };

    return (
        <aside className="hidden lg:flex flex-col py-8 px-4 space-y-6 bg-slate-50/50 backdrop-blur-2xl h-screen w-72 flex-shrink-0 border-r border-slate-100/10">
            <div className="flex items-center gap-3 px-2">
                <img src="/assets/images/intellixChat.png" alt="Logo" className="w-10 h-10 object-contain" />
                <div>
                    <h1 className="font-headline font-bold text-slate-800 text-lg leading-tight">IntellixChat</h1>
                    <p className="text-xs text-on-surface-variant font-medium tracking-wide">Advanced AI Assistant</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2 px-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                        <div
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer rounded-xl",
                                item.active
                                    ? "bg-white/80 text-tertiary font-semibold shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    </Link>
                ))}

                <div className="pt-6 pb-2 px-4">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Recent Threads</p>
                </div>

                <div className="space-y-1">
                    {chats.length > 0 ? (
                        <AnimatePresence>
                            {chats.map((chat) => (
                                <Link key={chat.id} href={`/chat/${chat.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "group flex items-center justify-between text-slate-500 hover:text-slate-900 px-4 py-2 hover:bg-slate-100/60 transition-all duration-200 rounded-xl text-sm cursor-pointer",
                                            pathname === `/chat/${chat.id}` && "bg-tertiary/10 text-tertiary font-semibold"
                                        )}
                                    >
                                        <span className="truncate">{chat.title}</span>
                                        <button
                                            onClick={(e) => handleDeleteChat(e, chat.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="px-4 py-2 text-sm text-slate-400 italic">
                            No histories
                        </div>
                    )}
                </div>
            </nav>

            <div className="mt-auto border-t border-slate-200/20 pt-6 px-2 space-y-4">
                {/* <div className="bg-tertiary/5 p-4 rounded-xl border border-tertiary/10">
                    <p className="text-xs font-semibold text-tertiary mb-2">Upgrade to Pro</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Experience faster response times and priority access.</p>
                </div> */}

                <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        M
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold truncate">Mediusware Admin</p>
                        <p className="text-[10px] text-on-surface-variant truncate">kahmad@mediusware.com</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors group"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 p-8 overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-headline font-bold text-slate-900 mb-2">IntellixChat says</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                                    Are you sure you want to delete this conversation? This action cannot be undone.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm hover:bg-slate-200 transition-colors active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </aside>
    );
}

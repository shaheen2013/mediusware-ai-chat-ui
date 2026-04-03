'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, History, Settings, HelpCircle, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { icon: <PlusCircle size={20} />, label: 'New Chat', href: '/', active: pathname === '/' },
        { icon: <History size={20} />, label: 'History', href: '#', active: false },
        { icon: <Settings size={20} />, label: 'Settings', href: '#', active: false },
        { icon: <HelpCircle size={20} />, label: 'Support', href: '#', active: false },
    ];

    return (
        <aside className="hidden lg:flex flex-col py-8 px-4 space-y-6 bg-slate-50/50 backdrop-blur-2xl h-screen w-72 flex-shrink-0 border-r border-slate-100/10">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white shadow-lg overflow-hidden">
                    <img src="/assets/images/intellix-logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="font-headline font-bold text-slate-800 text-lg leading-tight">IntellixChat</h1>
                    <p className="text-xs text-on-surface-variant font-medium tracking-wide">Premium Editorial AI</p>
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

                <div className="text-slate-500 hover:text-slate-900 px-4 py-2 hover:bg-slate-100/60 transition-colors duration-200 rounded-lg text-sm truncate cursor-pointer">
                    Understanding Polymer Science
                </div>
                <div className="text-slate-500 hover:text-slate-900 px-4 py-2 hover:bg-slate-100/60 transition-colors duration-200 rounded-lg text-sm truncate cursor-pointer">
                    The History of Non-stick
                </div>
            </nav>

            <div className="mt-auto border-t border-slate-200/20 pt-6 px-2 space-y-4">
                <div className="bg-tertiary/5 p-4 rounded-xl border border-tertiary/10">
                    <p className="text-xs font-semibold text-tertiary mb-2">Upgrade to Pro</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Experience faster response times and priority access.</p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
                        <img
                            alt="User Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBqTTcMg0IPhR_pAagN1fH4byZSJMqemA5cBemAzpcy1jiDjimFmYU0skW-2H16Kl1dEVB6QdXCWyF1h1Xi7125A1dezBn5lw-38pBkjVbd4Hwfanj_A9P2SVBLw_fqjcWXIPLBi8NAjrOkt0LLJuL34U5HyJWGZqFXM3nyyCOPdQcPEFg53YrCJaykvCEwJkBkW-YEJx4FwQnjDIK2ioJ8V-qy2mgMZUjA4xwc4mcW8OMq-D8uyHfGg9upwz3hJM_cp7icGoEVtI"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold truncate">Alex Sterling</p>
                        <p className="text-[10px] text-on-surface-variant truncate">alex.s@design.co</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

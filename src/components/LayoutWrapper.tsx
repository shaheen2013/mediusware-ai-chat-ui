'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import React, { Suspense } from 'react';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname?.startsWith('/login') || false;

    if (isLoginPage) {
        return (
            <body className="h-full bg-background font-body text-on-background overflow-hidden">
                <main className="h-full relative overflow-hidden">
                    <Suspense fallback={<div className="flex-1 flex items-center justify-center font-headline text-slate-400">Initializing...</div>}>
                        {children}
                    </Suspense>
                </main>
            </body>
        );
    }

    return (
        <body className="h-full flex overflow-hidden bg-background font-body text-on-background">
            <Sidebar />
            <main className="flex-1 flex flex-col relative overflow-hidden chat-gradient">
                <Suspense fallback={<div className="flex-1 flex items-center justify-center font-headline text-slate-400">Initializing Intellix...</div>}>
                    {children}
                </Suspense>
            </main>
        </body>
    );
}

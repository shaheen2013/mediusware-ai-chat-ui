import type { Metadata } from "next";
import React, { Suspense } from "react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "IntellixChat - Premium Assistant",
  description: "Experience the next generation of AI-driven editorial excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex overflow-hidden bg-background font-body text-on-background">
        <Sidebar />
        <main className="flex-1 flex flex-col relative overflow-hidden liquid-gradient">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center font-headline text-slate-400">Initializing Intellix...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}

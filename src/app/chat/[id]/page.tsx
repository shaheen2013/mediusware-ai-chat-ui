'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Settings, MoreVertical, Plus, ArrowUp, User, Layout, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export default function ChatPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q');

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const initialProcessed = useRef(false);

    // Initialize with the query from landing page
    useEffect(() => {
        if (initialQuery && messages.length === 0 && !initialProcessed.current) {
            initialProcessed.current = true;
            handleSend(initialQuery);
        }
    }, [initialQuery]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (content: string) => {
        if (!content.trim() || isTyping) return;

        // Save to history if it's the first message
        if (messages.length === 0) {
            const stored = localStorage.getItem('intellix_chats');
            let chats = stored ? JSON.parse(stored) : [];
            const chatId = params.id as string;
            if (!chats.find((c: any) => c.id === chatId)) {
                // Slice content for title if it's too long
                const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
                chats = [{ id: chatId, title }, ...chats];
                localStorage.setItem('intellix_chats', JSON.stringify(chats));
                window.dispatchEvent(new Event('chatUpdate'));
            }
        }

        const userMessage: Message = {
            role: 'user',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Update local state immediately
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // We pass the new list of messages directly to avoid waiting for state update
            const messagesToSubmit = [...messages, userMessage];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messagesToSubmit }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.content || 'I encountered an error. Please try again.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: `Error: ${error.message || 'The AI is currently unavailable. Please check your API key and connection.'}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-surface relative">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 lg:left-72 z-50 bg-[#f8f9fa]/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 border-none">
                <div className="flex items-center gap-4">
                    <h2 className="font-headline font-bold text-slate-800 text-lg tracking-tight">
                        {messages[0]?.content.length > 25 ? messages[0]?.content.substring(0, 25) + '...' : messages[0]?.content || 'New Chat'}
                    </h2>
                    <span className="px-2 py-0.5 bg-slate-200/50 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-300/30">
                        MODEL: INTELLIX-1.0
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-500 hover:bg-slate-200/40 rounded-full transition-all active:scale-95">
                        <User size={20} />
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-200/40 rounded-full transition-all active:scale-95">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            {/* Chat Canvas */}
            <section ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-24 pt-24 pb-32 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex flex-col group",
                                    msg.role === 'user' ? "items-end" : "items-start"
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <>
                                        <div className="bg-gradient-to-br from-tertiary to-tertiary-container text-white px-6 py-4 rounded-xl rounded-tr-sm shadow-sm max-w-[85%]">
                                            <p className="text-body font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] text-on-surface-variant mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-tighter">
                                            {msg.timestamp} • Sent
                                        </span>
                                    </>
                                ) : (
                                    <div className="flex gap-4 items-start max-w-[90%]">
                                        <img src="/assets/images/intellixChat.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
                                        <div className="bg-surface-container-lowest backdrop-blur-sm px-6 py-5 rounded-xl rounded-tl-sm shadow-[0_4px_24px_rgba(43,52,55,0.04)] border border-white/50">
                                            <p className="text-body text-on-background leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <span className="text-[10px] text-on-surface-variant mt-2 block opacity-60 uppercase font-bold tracking-tighter">
                                                {msg.timestamp} • IntellixChat
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
                            <div className="flex gap-4 items-start">
                                <img src="/assets/images/intellixChat.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
                                <div className="bg-surface-container-lowest backdrop-blur-sm px-6 py-4 rounded-xl rounded-tl-sm shadow-[0_2px_12px_rgba(43,52,55,0.02)] border border-white/50 flex items-center gap-3">
                                    <span className="text-sm font-medium text-on-surface-variant">IntellixChat is typing</span>
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Input Area */}
            <footer className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-surface via-surface/90 to-transparent">
                <div className="max-w-4xl mx-auto relative group">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                        className="flex items-center gap-3 bg-surface-container-low/60 backdrop-blur-2xl px-6 py-4 rounded-full border border-outline-variant/15 shadow-sm focus-within:shadow-md focus-within:bg-surface-container-lowest transition-all duration-300"
                    >
                        <button type="button" className="text-on-surface-variant hover:text-tertiary transition-colors">
                            <Plus size={20} />
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-on-background placeholder:text-on-surface-variant/50 text-body font-medium outline-none"
                            placeholder="Curate your next inquiry..."
                            type="text"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-tertiary to-tertiary-container text-white shadow-md active:scale-90 transition-all disabled:opacity-50"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </form>
                </div>
            </footer>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        </div>
    );
}

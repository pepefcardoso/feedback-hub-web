"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import { CreateFeedbackModal } from '@/components/feedback/create-feedback-modal';

export function Navbar() {
    const { user, isLoading } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-5xl px-6 flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold tracking-tight">
                        Feedback Hub
                    </Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Feed</Link>
                        <Link href="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {!isLoading ? (
                        user ? (
                            <>
                                <CreateFeedbackModal />
                                <UserNav user={user} />
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                    <Link href="/login">Entrar</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/register">Cadastrar</Link>
                                </Button>
                            </>
                        )
                    ) : (
                        <div className="w-24 h-8 bg-muted animate-pulse rounded-md" />
                    )}
                </div>
            </div>
        </header>
    );
}
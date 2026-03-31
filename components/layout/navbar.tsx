import Link from 'next/link';
import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api-client'; // Correção da importação
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return null;

    try {
        const user = await apiClient<any>('/users/me');
        return user;
    } catch (error) {
        return null;
    }
}

export async function Navbar() {
    const user = await getUser();

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
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href="/login">Entrar</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Cadastrar</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
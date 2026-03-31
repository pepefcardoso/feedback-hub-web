import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-6 md:py-8 mt-auto">
            <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Feedback Hub. Todos os direitos reservados.</p>
                <div className="flex items-center gap-4">
                    <Link href="/about" className="hover:underline underline-offset-4">Sobre</Link>
                    <Link href="/privacy" className="hover:underline underline-offset-4">Privacidade</Link>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
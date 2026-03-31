"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categories = ["All", "Feature", "UI", "UX", "Bug", "Performance"];

export function Sidebar() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "All";

    return (
        <aside className="w-full md:w-48 lg:w-56 shrink-0">
            <div className="sticky top-20 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {categories.map((category) => {
                    const isActive = currentCategory === category;
                    const href = category === "All" ? "/" : `/?category=${category}`;

                    return (
                        <Button
                            key={category}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "justify-start whitespace-nowrap",
                                isActive ? "font-semibold" : "font-normal text-muted-foreground"
                            )}
                            asChild
                        >
                            <Link href={href}>{category}</Link>
                        </Button>
                    );
                })}
            </div>
        </aside>
    );
}
"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface VoteButtonProps {
    initialVoteCount: number;
    initialHasVoted: boolean;
    feedbackId: string;
}

export function VoteButton({ initialVoteCount, initialHasVoted, feedbackId }: VoteButtonProps) {
    const [isVoted, setIsVoted] = useState(initialHasVoted);
    const [count, setCount] = useState(initialVoteCount);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsVoted(initialHasVoted);
        setCount(initialVoteCount);
    }, [initialHasVoted, initialVoteCount]);

    const handleVote = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        const previousVotedState = isVoted;
        const previousCount = count;

        setIsVoted(!previousVotedState);
        setCount(previousVotedState ? previousCount - 1 : previousCount + 1);
        setIsLoading(true);

        try {
            await apiClient(`/feedbacks/${feedbackId}/vote`, {
                method: "POST",
                body: JSON.stringify({ type: "UPVOTE" }),
            });
        } catch (error) {
            setIsVoted(previousVotedState);
            setCount(previousCount);
            console.error("Failed to update vote", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleVote}
            disabled={isLoading}
            aria-pressed={isVoted}
            aria-label={isVoted ? "Remove upvote" : "Upvote"}
            className={`flex flex-col items-center p-2 transition-colors rounded-lg min-w-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed ${isVoted
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-slate-50 hover:bg-blue-50 group-hover:bg-blue-50"
                }`}
        >
            <ChevronUp
                className={`h-5 w-5 ${isVoted ? "text-blue-700" : "text-slate-500 group-hover:text-blue-600"
                    }`}
            />
            <span
                className={`font-semibold text-sm ${isVoted ? "text-blue-700" : "text-slate-700 group-hover:text-blue-700"
                    }`}
            >
                {count}
            </span>
        </button>
    );
}
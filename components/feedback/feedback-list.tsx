import { FeedbackItem, FeedbackListResponse } from "@/types/feedback";
import { FeedbackCard } from "./feedback-card";

interface FeedbackListProps {
    feedbacks: FeedbackItem[];
    meta?: FeedbackListResponse["meta"];
}

export function FeedbackList({ feedbacks, meta }: FeedbackListProps) {
    if (!feedbacks || feedbacks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No feedback found</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                    There are no suggestions in this category yet. Be the first to create one!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}

            {meta && meta.totalPages > 1 && (
                <div className="pt-6 text-center text-sm text-slate-500">
                    Showing page {meta.currentPage} of {meta.totalPages}
                </div>
            )}
        </div>
    );
}
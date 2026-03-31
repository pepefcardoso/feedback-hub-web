"use client";

import { useState } from "react";
import { FeedbackItem, FeedbackStatus } from "@/types/feedback";
import { apiClient } from "@/lib/api-client";

export function AdminFeedbacksTable({ initialFeedbacks }: { initialFeedbacks: FeedbackItem[] }) {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setLoadingId(id);
        try {
            await apiClient(`/feedbacks/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });

            setFeedbacks((prev) =>
                prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus as FeedbackStatus } : fb))
            );
            alert("Status updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update status. Make sure you have Admin privileges.");
        } finally {
            setLoadingId(null);
        }
    };

    if (!feedbacks || feedbacks.length === 0) {
        return <p className="text-muted-foreground">No feedbacks available.</p>;
    }

    return (
        <div className="border rounded-md overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Title</th>
                        <th className="px-6 py-3 font-medium">Author</th>
                        <th className="px-6 py-3 font-medium">Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((fb) => (
                        <tr key={fb.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="px-6 py-4">{fb.title}</td>
                            <td className="px-6 py-4">{fb.author.name}</td>
                            <td className="px-6 py-4">
                                <select
                                    value={fb.status}
                                    disabled={loadingId === fb.id}
                                    onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                                    className="border rounded p-1.5 bg-background text-sm"
                                >
                                    <option value="IDEA">Idea</option>
                                    <option value="PLANNED">Planned</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
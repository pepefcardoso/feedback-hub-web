import { AdminFeedbacksTable } from "@/components/admin/admin-feedbacks-table";
import { apiClient } from "@/lib/api-client";
import { FeedbackListResponse } from "@/types/feedback";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const response = await apiClient<FeedbackListResponse>("/feedbacks");

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>
      <AdminFeedbacksTable initialFeedbacks={response.data} />
    </div>
  );
}
import { apiClient } from "@/lib/api-client";
import { FeedbackList } from "@/components/feedback/feedback-list";
import { Sidebar } from "@/components/layout/sidebar";
import { FeedbackListResponse } from "@/types/feedback";

interface HomeProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function HomePage(props: HomeProps) {
  const searchParams = await props.searchParams;

  const params: Record<string, string> = {
    page: searchParams.page || "1",
    limit: "10",
  };

  if (searchParams.category && searchParams.category !== "All") {
    params.category = searchParams.category;
  }

  let response: FeedbackListResponse | null = null;
  let fetchError = false;

  try {
    response = await apiClient<FeedbackListResponse>("/feedbacks", { params });
  } catch (error) {
    console.error("Failed to fetch feedbacks on homepage:", error);
    fetchError = true;
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Feedback Suggestions
            </h1>
          </div>

          {fetchError ? (
            <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
              <p>Unable to load feedback suggestions at this time. Please try again later.</p>
            </div>
          ) : (
            <FeedbackList
              feedbacks={response?.data || []}
              meta={response?.meta}
            />
          )}
        </div>
      </div>
    </main>
  );
}
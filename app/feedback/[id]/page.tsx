import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { apiClient, AppError } from "@/lib/api-client";
import { FeedbackItem, FeedbackStatus } from "@/types/feedback";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/feedback/vote-button";

interface FeedbackDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  IDEA: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  PLANNED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  IN_PROGRESS: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
};

export default async function FeedbackDetailPage({
  params,
}: FeedbackDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let feedback: FeedbackItem;

  try {
    feedback = await apiClient<FeedbackItem>(`/feedbacks/${id}`);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(feedback.createdAt));

  return (
    <main className="container max-w-4xl mx-auto py-8 px-4">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Feed
      </Link>

      {/* Main Content Card */}
      <article className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 sm:p-8">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="text-xs font-medium">
                {feedback.category}
              </Badge>
              <Badge
                className={`text-xs font-medium ${STATUS_COLORS[feedback.status] || "bg-gray-100 text-gray-800"
                  }`}
              >
                {feedback.status.replace("_", " ")}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {feedback.title}
            </h1>

            <div className="text-sm text-muted-foreground">
              Posted by <span className="font-medium text-foreground">{feedback.author.name}</span> on {formattedDate}
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
            <VoteButton
              feedbackId={feedback.id}
              initialVoteCount={feedback.voteCount}
              initialHasVoted={feedback.hasVoted}
            />
          </div>
        </header>

        <div className="border-t pt-8">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {feedback.description}
          </p>
        </div>
      </article>
    </main>
  );
}
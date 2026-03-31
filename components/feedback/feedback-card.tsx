import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp } from "lucide-react";
import { FeedbackItem } from "@/types/feedback";

interface FeedbackCardProps {
    feedback: FeedbackItem;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
    return (
        <Link href={`/feedback/${feedback.id}`} className="block group">
            <Card className="flex items-start p-4 gap-4 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex flex-col items-center p-2 bg-slate-50 group-hover:bg-blue-50 transition-colors rounded-lg min-w-[48px]">
                    <ChevronUp className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
                    <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-700">
                        {feedback.voteCount}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {feedback.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {feedback.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                            {feedback.category}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant="outline" className="text-slate-500 font-medium capitalize">
                        {feedback.status.toLowerCase().replace('_', ' ')}
                    </Badge>
                </div>
            </Card>
        </Link>
    );
}
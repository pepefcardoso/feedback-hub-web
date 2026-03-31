export type FeedbackStatus = "IDEA" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeedbackStatus;
  author: {
    id: string;
    name: string;
  };
  voteCount: number;
  createdAt: string;
}

export interface FeedbackListResponse {
  data: FeedbackItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

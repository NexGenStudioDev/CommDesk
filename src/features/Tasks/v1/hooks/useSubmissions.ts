import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockSubmissions } from "../mock/taskMockData";
import type { Submission, ReviewSubmissionPayload } from "../Task.types";

let store = [...mockSubmissions];

export function useSubmissions(taskId: string | undefined) {
  return useQuery<Submission[]>({
    queryKey: ["submissions", taskId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 350));
      return store.filter((s) => s.taskId === taskId);
    },
    enabled: !!taskId,
  });
}

export function useReviewSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: ReviewSubmissionPayload;
    }): Promise<Submission> => {
      await new Promise((r) => setTimeout(r, 600));
      store = store.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              review: {
                decision: payload.decision,
                score: payload.score,
                feedback: payload.feedback,
                reviewedBy: "Organizer",
                reviewedAt: new Date().toISOString(),
              },
            }
          : s
      );
      const updated = store.find((s) => s.id === submissionId);
      if (!updated) throw new Error("Submission not found");
      return updated;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["submissions", updated.taskId] });
      qc.invalidateQueries({ queryKey: ["task", updated.taskId] });
    },
  });
}
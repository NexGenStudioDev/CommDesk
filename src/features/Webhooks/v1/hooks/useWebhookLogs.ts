import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { webhookLogStore } from "../mock/webhookStore";
import type { WebhookLog, WebhookLogFilters, PaginatedWebhookLogs } from "../Webhook.types";

export function useWebhookLogs(webhookId: string | undefined, filters: WebhookLogFilters) {
  return useQuery<PaginatedWebhookLogs>({
    queryKey: ["webhook-logs", webhookId, filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (!webhookId) return { data: [], total: 0, totalPages: 0 };
      
      let logs = webhookLogStore.getByWebhookId(webhookId);
      
      if (filters.status !== "all") {
        logs = logs.filter(l => l.status === filters.status);
      }
      if (filters.event !== "all") {
        logs = logs.filter(l => l.event === filters.event);
      }
      
      const pageSize = 10;
      const total = logs.length;
      const totalPages = Math.ceil(total / pageSize);
      const page = filters.page || 1;
      const start = (page - 1) * pageSize;
      const paginatedLogs = logs.slice(start, start + pageSize);

      return {
        data: paginatedLogs,
        total,
        totalPages,
      };
    },
    enabled: !!webhookId,
  });
}

export function useRetryWebhookDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ webhookId, logId }: { webhookId: string; logId: string }): Promise<{ success: boolean }> => {
      await new Promise((r) => setTimeout(r, 800));
      // Mock successful retry
      return { success: true };
    },
    onSuccess: (_, { webhookId }) => {
      qc.invalidateQueries({ queryKey: ["webhook-logs", webhookId] });
      qc.invalidateQueries({ queryKey: ["webhooks", webhookId] });
      qc.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}

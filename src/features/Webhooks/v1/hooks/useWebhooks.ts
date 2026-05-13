import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { webhookStore } from "../mock/webhookStore";
import type { Webhook, WebhookFilters, CreateWebhookPayload, UpdateWebhookPayload, PaginatedWebhooks } from "../Webhook.types";
import { Telemetry } from "@/utils/telemetry";

function applyFilters(webhooks: Webhook[], filters: WebhookFilters): Webhook[] {
  return webhooks.filter((w) => {
    if (filters.status !== "all" && w.status !== filters.status) return false;
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const match = w.name.toLowerCase().includes(query) || w.url.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });
}

export function useWebhooks(filters: WebhookFilters) {
  return useQuery<PaginatedWebhooks>({
    queryKey: ["webhooks", filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600)); // Simulate latency
      const allWebhooks = webhookStore.getAll();
      const filtered = applyFilters(allWebhooks, filters);

      const pageSize = 10;
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const page = filters.page || 1;
      const start = (page - 1) * pageSize;
      const paginatedData = filtered.slice(start, start + pageSize);

      return {
        data: paginatedData,
        total,
        totalPages,
      };
    },
  });
}

export function useWebhook(id: string | undefined) {
  return useQuery<Webhook | undefined>({
    queryKey: ["webhooks", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (!id) return undefined;
      return webhookStore.getById(id);
    },
    enabled: !!id,
  });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateWebhookPayload): Promise<Webhook> => {
      await new Promise((r) => setTimeout(r, 500));
      const newWebhook: Webhook = {
        id: `wh-${Date.now()}`,
        name: payload.name,
        url: payload.url,
        events: payload.events,
        status: "active",
        secret: payload.secret || `********${Math.random().toString(36).substring(2, 6)}`,
        permissions: payload.permissions,
        lastDeliveryStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      webhookStore.add(newWebhook);
      return newWebhook;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks"] }),
  });
}

export function useUpdateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateWebhookPayload }): Promise<Webhook> => {
      await new Promise((r) => setTimeout(r, 400));
      webhookStore.update(id, payload);
      const updated = webhookStore.getById(id);
      if (!updated) {
        Telemetry.trackError("webhook_update_not_found", { id });
        throw new Error("Webhook not found");
      }
      return updated;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["webhooks"] });
      qc.invalidateQueries({ queryKey: ["webhooks", id] });
    },
  });
}

export function useDeleteWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await new Promise((r) => setTimeout(r, 300));
      webhookStore.remove(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks"] }),
  });
}

export function useTestWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean; message: string }> => {
      await new Promise((r) => setTimeout(r, 3500)); // Simulated 3.5s delay
      const webhook = webhookStore.getById(id);
      if (!webhook) {
        Telemetry.trackError("webhook_test_not_found", { id });
        throw new Error("Webhook not found");
      }

      // 80% chance of success for mock
      const isSuccess = Math.random() > 0.2;
      
      webhookStore.update(id, {
        lastTestedAt: new Date().toISOString(),
        lastTestStatus: isSuccess ? "success" : "failed"
      });

      Telemetry.trackAction("webhook_tested", { id, isSuccess });
      return { 
        success: isSuccess, 
        message: isSuccess ? "Webhook ping successful" : "Failed to reach endpoint" 
      };
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["webhooks"] });
      qc.invalidateQueries({ queryKey: ["webhooks", id] });
    },
  });
}
export function useBulkWebhookAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, action }: { ids: string[]; action: "delete" | "enable" | "disable" }): Promise<void> => {
      await new Promise((r) => setTimeout(r, 600)); // Simulated delay
      
      ids.forEach((id) => {
        if (action === "delete") {
          webhookStore.remove(id);
        } else {
          webhookStore.update(id, { status: action === "enable" ? "active" : "inactive" });
        }
      });
      
      Telemetry.trackAction("webhooks_bulk_action", { action, count: ids.length });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
}

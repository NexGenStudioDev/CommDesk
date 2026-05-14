import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useWebhooks, useWebhook, useCreateWebhook } from "./useWebhooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { webhookStore } from "../mock/webhookStore";

describe("Webhook API Hooks Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    // Reset mock store before each test
    const all = webhookStore.getAll();
    all.forEach(w => webhookStore.remove(w.id));
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it("creates a new webhook successfully", async () => {
    const { result } = renderHook(() => useCreateWebhook(), { wrapper });

    let newWebhook: any;
    await result.current.mutateAsync({
      name: "Test Hook",
      url: "https://test.com/hook",
      events: ["member.created"],
    }).then(res => newWebhook = res);

    expect(newWebhook).toBeDefined();
    expect(newWebhook.name).toBe("Test Hook");
    expect(newWebhook.url).toBe("https://test.com/hook");
    expect(newWebhook.status).toBe("active");
  });

  it("fetches webhooks with filters", async () => {
    webhookStore.add({
      id: "test-1",
      name: "Alpha Hook",
      url: "https://alpha.com",
      events: ["event.created"],
      status: "active",
      secret: "sec",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const { result } = renderHook(() => useWebhooks({ status: "all", search: "Alpha" }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe("Alpha Hook");
  });
});

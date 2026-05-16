import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WebhookForm from "./WebhookForm";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the hooks
vi.mock("../../hooks/useWebhooks", () => ({
  useCreateWebhook: () => ({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }),
  useUpdateWebhook: () => ({ mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }),
}));

vi.mock("@/features/Tasks/v1/components/common/ToastNotification", () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("WebhookForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly in create mode", () => {
    renderWithProviders(<WebhookForm mode="create" />);
    expect(screen.getByText("Endpoint Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Production Slack Alerts")).toBeInTheDocument();
  });

  it("validates empty form submission", async () => {
    renderWithProviders(<WebhookForm mode="create" />);

    const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
      expect(screen.getByText("Must be a valid URL")).toBeInTheDocument();
      expect(screen.getByText("Please select at least one event")).toBeInTheDocument();
    });
  });

  it("validates HTTPS URL requirement", async () => {
    renderWithProviders(<WebhookForm mode="create" />);

    const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");
    fireEvent.change(urlInput, { target: { value: "http://insecure-domain.com" } });

    const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("URL must use HTTPS")).toBeInTheDocument();
    });
  });

  it("allows selecting events", async () => {
    renderWithProviders(<WebhookForm mode="create" />);

    const eventOption = screen.getByText("Member Created");
    fireEvent.click(eventOption);

    expect(screen.getByText("1 Selected")).toBeInTheDocument();
  });
});

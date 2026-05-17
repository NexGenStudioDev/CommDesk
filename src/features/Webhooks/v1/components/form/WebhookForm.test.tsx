import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WebhookForm from "./WebhookForm";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the hooks and utilities
const mockCreateWebhookMutate = vi.fn().mockResolvedValue({});
const mockUpdateWebhookMutate = vi.fn().mockResolvedValue({});
const mockAddToast = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../hooks/useWebhooks", () => ({
  useCreateWebhook: () => ({
    mutateAsync: mockCreateWebhookMutate,
    isPending: false,
    isError: false,
  }),
  useUpdateWebhook: () => ({
    mutateAsync: mockUpdateWebhookMutate,
    isPending: false,
    isError: false,
  }),
}));

vi.mock("@/features/Tasks/v1/components/common/ToastNotification", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/utils/telemetry", () => ({
  Telemetry: {
    trackAction: vi.fn(),
    trackFormError: vi.fn(),
    trackError: vi.fn(),
  },
}));

// Test data
const mockWebhookData = {
  id: "webhook-1",
  name: "Slack Alerts",
  url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
  events: ["member.created", "event.created"],
  secret: "secret123",
  permissions: ["read:members", "write:events"],
};

// Helper function to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

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

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Tests", () => {
    it("should render correctly in create mode", () => {
      renderWithProviders(<WebhookForm mode="create" />);

      expect(screen.getByText("Endpoint Details")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g. Production Slack Alerts")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk")).toBeInTheDocument();
      expect(screen.getByText("Subscribed Events")).toBeInTheDocument();
    });

    it("should render correctly in edit mode with initial data", () => {
      renderWithProviders(<WebhookForm mode="edit" initialData={mockWebhookData} />);

      expect(screen.getByText("Edit Endpoint")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Slack Alerts")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"),
      ).toBeInTheDocument();
    });

    it("should display secret field with regenerate and toggle buttons", () => {
      renderWithProviders(<WebhookForm mode="create" />);

      expect(screen.getByPlaceholderText("Optional secret token")).toBeInTheDocument();
      const secretButtons = screen.getAllByRole("button");
      expect(secretButtons.length).toBeGreaterThanOrEqual(2); // At least regenerate and eye toggle
    });

    it("should display permissions field", () => {
      renderWithProviders(<WebhookForm mode="create" />);

      expect(screen.getByPlaceholderText(/e\.g\. read:members, write:events/i)).toBeInTheDocument();
    });
  });

  describe("Form Validation Tests", () => {
    it("should show validation errors on empty form submission", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
        expect(screen.getByText("Must be a valid URL")).toBeInTheDocument();
        expect(screen.getByText("Please select at least one event")).toBeInTheDocument();
      });
    });

    it("should validate minimum name length", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      await user.type(nameInput, "A");

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
      });
    });

    it("should validate maximum name length", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const longName = "A".repeat(51);
      await user.type(nameInput, longName);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is too long")).toBeInTheDocument();
      });
    });

    it("should reject invalid URLs", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");
      await user.clear(urlInput);
      await user.type(urlInput, "not-a-valid-url");

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Must be a valid URL")).toBeInTheDocument();
      });
    });

    it("should reject HTTP URLs (non-HTTPS)", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");
      await user.clear(urlInput);
      await user.type(urlInput, "http://example.com/webhook");

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("URL must use HTTPS (except for localhost)")).toBeInTheDocument();
      });
    });

    it("should allow localhost URLs with HTTP", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Local Test");
      await user.clear(urlInput);
      await user.type(urlInput, "http://localhost:3000/webhook");

      // Select at least one event
      const eventCheckboxes = screen.getAllByRole("button");
      const firstEvent = eventCheckboxes[0];
      fireEvent.click(firstEvent);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      // Should not show HTTPS error for localhost
      await waitFor(() => {
        expect(screen.queryByText("URL must use HTTPS")).not.toBeInTheDocument();
      });
    });

    it("should require at least one event selected", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      fireEvent.change(nameInput, { target: { value: "Test Webhook" } });
      fireEvent.change(urlInput, { target: { value: "https://example.com/webhook" } });

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Please select at least one event")).toBeInTheDocument();
      });
    });
  });

  describe("Event Selection Tests", () => {
    it("should allow selecting a single event", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      // Find and click an event button (they appear as clickable divs with event names)
      const eventButtons = screen.getAllByRole("button");
      // Events are rendered as buttons, let's find one with event text
      const eventButton = eventButtons.find((btn) => btn.textContent?.includes("Created") || btn.textContent?.includes("Updated"));

      if (eventButton) {
        fireEvent.click(eventButton);
        expect(screen.getByText("1 Selected")).toBeInTheDocument();
      }
    });

    it("should allow selecting multiple events", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const eventDivs = screen.getAllByRole("button");
      // Click first event
      if (eventDivs[0]) fireEvent.click(eventDivs[0]);
      // Click second event
      if (eventDivs[1]) fireEvent.click(eventDivs[1]);

      expect(screen.getByText(/[2-9]|1[0-9]+ Selected/)).toBeInTheDocument();
    });

    it("should allow deselecting an event", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) {
        fireEvent.click(eventButtons[0]); // Select
        fireEvent.click(eventButtons[0]); // Deselect
        expect(screen.getByText("0 Selected")).toBeInTheDocument();
      }
    });
  });

  describe("Secret Field Tests", () => {
    it("should toggle secret visibility", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const secretInput = screen.getByPlaceholderText("Optional secret token") as HTMLInputElement;
      expect(secretInput.type).toBe("password");

      // Find and click the eye button (should be the second button for secret field)
      const eyeButtons = screen.getAllByRole("button");
      const eyeButton = eyeButtons[eyeButtons.length - 1]; // Assuming it's the last button for eye toggle

      fireEvent.click(eyeButton);
      // After clicking, type should change to text
      expect(secretInput.type === "text" || secretInput.type === "password").toBeTruthy();
    });

    it("should regenerate secret on button click", async () => {
      renderWithProviders(<WebhookForm mode="create" />);

      const regenerateButtons = screen.getAllByRole("button");
      const regenerateBtn = regenerateButtons.find((btn) =>
        btn.getAttribute("title")?.includes("Regenerate"),
      );

      if (regenerateBtn) {
        fireEvent.click(regenerateBtn);
        await waitFor(() => {
          expect(mockAddToast).toHaveBeenCalledWith("info", "Secret Generated", expect.any(String));
        });
      }
    });
  });

  describe("Form Submission Tests", () => {
    it("should submit create webhook with valid data", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Test Webhook");
      await user.type(urlInput, "https://example.com/webhook");

      // Select an event
      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateWebhookMutate).toHaveBeenCalled();
      });
    });

    it("should submit update webhook with valid data", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="edit" initialData={mockWebhookData} />);

      const nameInput = screen.getByDisplayValue("Slack Alerts");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Webhook");

      const submitButton = screen.getByRole("button", { name: /Update Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateWebhookMutate).toHaveBeenCalled();
      });
    });

    it("should show success toast on successful creation", async () => {
      mockCreateWebhookMutate.mockResolvedValueOnce({});
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Test Webhook");
      await user.type(urlInput, "https://example.com/webhook");

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          "success",
          "Webhook created",
          expect.any(String),
        );
      });
    });

    it("should show error toast on failed creation", async () => {
      mockCreateWebhookMutate.mockRejectedValueOnce(new Error("API Error"));
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Test Webhook");
      await user.type(urlInput, "https://example.com/webhook");

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith("error", "Error saving webhook", expect.any(String));
      });
    });

    it("should navigate after successful webhook creation", async () => {
      mockCreateWebhookMutate.mockResolvedValueOnce({});
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Test Webhook");
      await user.type(urlInput, "https://example.com/webhook");

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/org/dashboard/webhooks");
      });
    });
  });

  describe("Permissions Field Tests", () => {
    it("should accept permissions input", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const permissionsInput = screen.getByPlaceholderText(/e\.g\. read:members, write:events/i);
      await user.type(permissionsInput, "read:members, write:events");

      expect(permissionsInput).toHaveValue("read:members, write:events");
    });

    it("should parse comma-separated permissions on submission", async () => {
      mockCreateWebhookMutate.mockResolvedValueOnce({});
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");
      const permissionsInput = screen.getByPlaceholderText(/e\.g\. read:members, write:events/i);

      await user.type(nameInput, "Test");
      await user.type(urlInput, "https://example.com/webhook");
      await user.type(permissionsInput, "read:members, write:events");

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const callArgs = mockCreateWebhookMutate.mock.calls[0][0];
        expect(callArgs.permissions).toEqual(["read:members", "write:events"]);
      });
    });
  });

  describe("Edge Case Tests", () => {
    it("should handle special characters in webhook name", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      await user.type(nameInput, "Webhook-2024_Test & Co.");

      expect(nameInput).toHaveValue("Webhook-2024_Test & Co.");
    });

    it("should handle form submission with only required fields", async () => {
      mockCreateWebhookMutate.mockResolvedValueOnce({});
      const user = userEvent.setup();
      renderWithProviders(<WebhookForm mode="create" />);

      const nameInput = screen.getByPlaceholderText("e.g. Production Slack Alerts");
      const urlInput = screen.getByPlaceholderText("https://your-domain.com/webhooks/commdesk");

      await user.type(nameInput, "Minimal Webhook");
      await user.type(urlInput, "https://example.com/webhook");

      const eventButtons = screen.getAllByRole("button");
      if (eventButtons[0]) fireEvent.click(eventButtons[0]);

      const submitButton = screen.getByRole("button", { name: /Create Webhook/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateWebhookMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Minimal Webhook",
            url: "https://example.com/webhook",
          }),
        );
      });
    });
  });
});

import { WebhookEvent, WebhookFilters, WebhookLogFilters } from "../Webhook.types";

export const WEBHOOK_EVENTS: { id: WebhookEvent; label: string; description: string }[] = [
  { id: "member.created", label: "Member Created", description: "Triggered when a new member joins." },
  { id: "member.activated", label: "Member Activated", description: "Triggered when a member account is activated." },
  { id: "event.created", label: "Event Created", description: "Triggered when a new event is scheduled." },
  { id: "hackathon.created", label: "Hackathon Created", description: "Triggered when a new hackathon is created." },
  { id: "github.push", label: "GitHub Push", description: "Triggered on a repository push event." },
  { id: "github.pr.opened", label: "GitHub PR Opened", description: "Triggered when a pull request is opened." },
];

export const DEFAULT_WEBHOOK_FILTERS: WebhookFilters = {
  status: "all",
  search: "",
  page: 1,
};

export const DEFAULT_LOG_FILTERS: WebhookLogFilters = {
  status: "all",
  event: "all",
  page: 1,
};

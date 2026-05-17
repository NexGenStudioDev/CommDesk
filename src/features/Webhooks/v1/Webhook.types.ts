export type WebhookEvent =
  | "member.created"
  | "member.activated"
  | "event.created"
  | "hackathon.created"
  | "github.push"
  | "github.pr.opened";

export type WebhookStatus = "active" | "inactive";

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: WebhookStatus;
  secret: string; // Typically masked like ********abcd
  permissions?: string[];
  lastDeliveryStatus?: "success" | "failed" | "pending";
  lastTestedAt?: string;
  lastTestStatus?: "success" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  status: "success" | "failed";
  timestamp: string;
  responseCode: number;
  requestPayload: unknown;
  responsePayload: unknown;
}

export interface CreateWebhookPayload {
  name: string;
  url: string;
  events: WebhookEvent[];
  secret?: string;
  permissions?: string[];
}

export interface UpdateWebhookPayload {
  name?: string;
  url?: string;
  events?: WebhookEvent[];
  status?: WebhookStatus;
  secret?: string;
  permissions?: string[];
}

export interface WebhookFilters {
  status: WebhookStatus | "all";
  search: string;
  page: number;
}

export interface PaginatedWebhooks {
  data: Webhook[];
  total: number;
  totalPages: number;
}

export interface WebhookLogFilters {
  status: "all" | "success" | "failed";
  event: WebhookEvent | "all";
  page: number;
}

export interface PaginatedWebhookLogs {
  data: WebhookLog[];
  total: number;
  totalPages: number;
}

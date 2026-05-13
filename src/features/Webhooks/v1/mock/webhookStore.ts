import type { Webhook, WebhookLog } from "../Webhook.types";

let mockWebhooks: Webhook[] = [
  {
    id: "wh-1",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/REPLACE_WITH_YOUR_ACTUAL_WEBHOOK_URL",
    events: ["member.created", "event.created"],
    status: "active",
    secret: "********abcd",
    lastDeliveryStatus: "success",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wh-2",
    name: "Zapier Integration",
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdef/",
    events: ["hackathon.created"],
    status: "inactive",
    secret: "********xyza",
    lastDeliveryStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let mockLogs: WebhookLog[] = [
  {
    id: "log-1",
    webhookId: "wh-1",
    event: "member.created",
    status: "success",
    timestamp: new Date().toISOString(),
    responseCode: 200,
    requestPayload: { memberId: "m-1", name: "John Doe" },
    responsePayload: { success: true },
  },
  {
    id: "log-2",
    webhookId: "wh-1",
    event: "event.created",
    status: "failed",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    responseCode: 500,
    requestPayload: { eventId: "e-1", title: "Tech Meetup" },
    responsePayload: { error: "Internal Server Error" },
  }
];

export const webhookStore = {
  getAll: () => [...mockWebhooks],
  getById: (id: string) => mockWebhooks.find((w) => w.id === id),
  add: (webhook: Webhook) => {
    mockWebhooks.push(webhook);
  },
  update: (id: string, updates: Partial<Webhook>) => {
    mockWebhooks = mockWebhooks.map((w) => (w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w));
  },
  remove: (id: string) => {
    mockWebhooks = mockWebhooks.filter((w) => w.id !== id);
  },
};

export const webhookLogStore = {
  getByWebhookId: (webhookId: string) => mockLogs.filter((l) => l.webhookId === webhookId),
};

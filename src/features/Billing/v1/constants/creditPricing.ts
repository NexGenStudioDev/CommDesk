/** Centralized pricing matrix — all consumption must reference these keys */
export const CREDIT_PRICING = {
  // Community
  INVITE_MEMBER: 1,
  UPDATE_BRANDING: 3,
  UPLOAD_BANNER: 8,
  TEAM_ROLE_UPDATE: 1,

  // API
  API_BASIC_REQUEST: 1,
  API_HEAVY_QUERY: 5,
  EXPORT_DATA: 20,
  ANALYTICS_QUERY: 10,

  // Queue
  EMAIL_SEND: 1,
  PUSH_NOTIFICATION: 1,
  RETRY_QUEUE: 2,
  SCHEDULED_JOB: 2,

  // Webhooks
  WEBHOOK_TRIGGER: 1,
  WEBHOOK_RETRY: 1,
  WEBHOOK_PREMIUM_DELIVERY: 3,

  // Storage (per unit)
  STORAGE_100MB: 5,
  STORAGE_1GB: 40,
  MEDIA_OPTIMIZATION: 3,

  // AI
  AI_SUMMARY: 15,
  AI_MODERATION: 5,
  AI_SEARCH: 12,
  AI_ASSISTANT_REPLY: 8,
} as const;

export type CreditFeature = keyof typeof CREDIT_PRICING;

export function getFeatureCost(feature: CreditFeature): number {
  return CREDIT_PRICING[feature];
}

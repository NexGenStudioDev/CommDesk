/**
 * Simple Telemetry/Observability utility for frontend tracking.
 * In a real-world scenario, this would wrap PostHog, Sentry, Datadog, etc.
 */

export const Telemetry = {
  trackAction: (actionName: string, metadata?: Record<string, any>) => {
    // e.g. posthog.capture(actionName, metadata)
    console.info(`[Telemetry Action]: ${actionName}`, metadata || {});
  },
  
  trackError: (errorName: string, error: any, metadata?: Record<string, any>) => {
    // e.g. Sentry.captureException(error)
    console.error(`[Telemetry Error]: ${errorName}`, error, metadata || {});
  },
  
  trackFormError: (formName: string, errors: Record<string, any>) => {
    console.warn(`[Telemetry Form Error]: Validation failed in ${formName}`, errors);
  }
};

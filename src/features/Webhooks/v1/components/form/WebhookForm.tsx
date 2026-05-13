import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Check, Loader2, Link2, Shield, Eye, EyeOff, RefreshCw } from "lucide-react";
import { WEBHOOK_EVENTS } from "../../constants/webhook.constants";
import type { WebhookEvent, CreateWebhookPayload } from "../../Webhook.types";
import { useCreateWebhook, useUpdateWebhook } from "../../hooks/useWebhooks";
import { useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { Telemetry } from "@/utils/telemetry";

const webhookSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  url: z.string().url("Must be a valid URL").refine(val => {
    try {
      const url = new URL(val);
      const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
      if (isLocal) return true;
      return val.startsWith("https://");
    } catch {
      return false;
    }
  }, "URL must use HTTPS (except for localhost)"),
  events: z.array(z.string()).min(1, "Please select at least one event"),
  secret: z.string().optional(),
  permissions: z.string().optional(),
});


type FormData = z.infer<typeof webhookSchema>;

interface Props {
  mode: "create" | "edit";
  initialData?: any;
}

export default function WebhookForm({ mode, initialData }: Props) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const isSubmitting = createWebhook.isPending || updateWebhook.isPending;

  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      name: initialData?.name || "",
      url: initialData?.url || "",
      events: initialData?.events || [],
      secret: mode === "edit" ? "" : "", // Masked initially in edit mode, empty string means unchanged
      permissions: initialData?.permissions?.join(", ") || "",
    },

  });

  const selectedEvents = watch("events");

  const toggleEvent = (eventId: string) => {
    Telemetry.trackAction("webhook_form_toggle_event", { eventId });
    const current = selectedEvents || [];
    if (current.includes(eventId)) {
      setValue("events", current.filter(id => id !== eventId), { shouldValidate: true });
    } else {
      setValue("events", [...current, eventId], { shouldValidate: true });
    }
  };

  const handleRegenerateSecret = () => {
    const randomSecret = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setValue("secret", randomSecret, { shouldDirty: true });
    setShowSecret(true);
    Telemetry.trackAction("webhook_secret_regenerated");
    addToast("info", "Secret Generated", "A new secure secret has been generated.");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const parsedPermissions = data.permissions 
        ? data.permissions.split(",").map(p => p.trim()).filter(Boolean) 
        : undefined;

      if (mode === "create") {
        await createWebhook.mutateAsync({
          ...data,
          permissions: parsedPermissions,
        } as CreateWebhookPayload);
        Telemetry.trackAction("webhook_created", { eventsCount: data.events.length });
        addToast("success", "Webhook created", "Your new webhook has been set up successfully.");
        navigate("/org/dashboard/webhooks");
      } else {
        const payload: any = { name: data.name, url: data.url, events: data.events };
        if (data.secret) payload.secret = data.secret; // only update if provided
        if (parsedPermissions) payload.permissions = parsedPermissions;
        await updateWebhook.mutateAsync({ id: initialData.id, payload });
        Telemetry.trackAction("webhook_updated", { id: initialData.id });
        addToast("success", "Webhook updated", "Changes saved successfully.");
        navigate("/org/dashboard/webhooks");
      }
    } catch (err) {
      Telemetry.trackError("webhook_save_failed", err);
      addToast("error", "Error saving webhook", "Please try again later.");
    }
  };

  const onError = (errors: any) => {
    Telemetry.trackFormError("WebhookForm", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="relative pb-36">
      <div className="mx-auto max-w-3xl py-8 px-4 sm:px-8">
        <div 
          className="rounded-xl border shadow-sm p-6 sm:p-8"
          style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--cd-text)" }}>
            {mode === "create" ? "Endpoint Details" : "Edit Endpoint"}
          </h2>

        {/* Name Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--cd-text)" }}>
            Webhook Name
          </label>
          <input
            {...register("name")}
            placeholder="e.g. Production Slack Alerts"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none ${errors.name ? 'border-[var(--cd-danger)]' : 'focus:border-[var(--cd-primary)]'}`}
            style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text)", borderColor: errors.name ? undefined : "var(--cd-border)" }}
          />
          {errors.name && <p className="mt-1.5 text-xs text-[var(--cd-danger)]">{errors.name.message}</p>}
        </div>

        {/* URL Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--cd-text)" }}>
            Payload URL
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cd-text-muted)]">
              <Link2 size={16} />
            </div>
            <input
              {...register("url")}
              placeholder="https://your-domain.com/webhooks/commdesk"
              className={`w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm font-mono transition-all outline-none ${errors.url ? 'border-[var(--cd-danger)]' : 'focus:border-[var(--cd-primary)]'}`}
              style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text)", borderColor: errors.url ? undefined : "var(--cd-border)" }}
            />
          </div>
          {errors.url && <p className="mt-1.5 text-xs text-[var(--cd-danger)]">{errors.url.message}</p>}
        </div>

        {/* Secret Field */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--cd-text)" }}>
            Secret {mode === "edit" && <span className="text-xs font-normal text-[var(--cd-text-muted)]">(Leave blank to keep existing)</span>}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cd-text-muted)]">
              <Shield size={16} />
            </div>
            <input
              {...register("secret")}
              type={showSecret ? "text" : "password"}
              placeholder={mode === "edit" ? "••••••••••••" : "Optional secret token"}
              className="w-full rounded-lg border pl-10 pr-20 py-2.5 text-sm font-mono transition-all outline-none focus:border-[var(--cd-primary)]"
              style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text)", borderColor: "var(--cd-border)" }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegenerateSecret}
                className="p-1 rounded-md text-[var(--cd-text-muted)] hover:text-[var(--cd-primary)] hover:bg-[var(--cd-primary-subtle)] transition-all"
                title="Regenerate Secret"
              >
                <RefreshCw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="p-1 rounded-md text-[var(--cd-text-muted)] hover:text-[var(--cd-text)] transition-all"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--cd-text-muted)" }}>
            Used to create a hash signature with each payload, ensuring the request comes from CommDesk.
          </p>
        </div>

        {/* Permissions Field */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--cd-text)" }}>
            Permissions <span className="text-xs font-normal text-[var(--cd-text-muted)]">(Optional)</span>
          </label>
          <input
            {...register("permissions")}
            placeholder="e.g. read:members, write:events (comma separated)"
            className="w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none focus:border-[var(--cd-primary)]"
            style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text)", borderColor: "var(--cd-border)" }}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--cd-text-muted)" }}>
            Specific permissions required for this webhook endpoint.
          </p>
        </div>

        <hr className="my-8" style={{ borderColor: "var(--cd-border-subtle)" }} />

        {/* Events Multi-select */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold" style={{ color: "var(--cd-text)" }}>
              Subscribed Events
            </label>
            <span className="text-xs font-medium px-2 py-1 rounded-md" style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary-text)" }}>
              {selectedEvents.length} Selected
            </span>
          </div>
          {errors.events && <p className="mb-3 text-xs text-[var(--cd-danger)]">{errors.events.message}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WEBHOOK_EVENTS.map((event) => {
              const isSelected = selectedEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  onClick={() => toggleEvent(event.id)}
                  className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-[var(--cd-hover)]"
                  style={{
                    backgroundColor: isSelected ? "var(--cd-primary-subtle)" : "var(--cd-surface-2)",
                    borderColor: isSelected ? "var(--cd-primary)" : "var(--cd-border)",
                  }}
                >
                  <div className="mt-0.5">
                    <div 
                      className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isSelected ? "var(--cd-primary)" : "transparent",
                        border: isSelected ? "none" : "1px solid var(--cd-border)",
                      }}
                    >
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: isSelected ? "var(--cd-primary-text)" : "var(--cd-text)" }}>
                      {event.label}
                    </p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--cd-text-muted)" }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

      {/* Floating Action Bar */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[var(--cd-bg)] via-[var(--cd-bg)] to-transparent p-4 transition-all sm:p-6 lg:pl-85">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center justify-between rounded-xl border bg-[var(--cd-surface)]/95 p-3 shadow-2xl backdrop-blur-md" style={{ borderColor: "var(--cd-border-subtle)" }}>
          <div className="hidden sm:block">
            <p className="text-xs font-bold" style={{ color: "var(--cd-text)" }}>{mode === "create" ? "New Webhook" : "Edit Webhook"}</p>
            <p className="text-[10px] truncate max-w-[200px]" style={{ color: "var(--cd-text-muted)" }}>{watch("name") || "Untitled Webhook"}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => navigate("/org/dashboard/webhooks")}
              className="h-10 flex-1 rounded-lg border bg-[var(--cd-surface)] px-5 text-sm font-medium text-[var(--cd-text-2)] transition-colors hover:bg-[var(--cd-hover)] sm:flex-none"
              style={{ borderColor: "var(--cd-border)" }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--cd-primary)] px-7 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-50 sm:flex-none">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {mode === "create" ? "Create Webhook" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}



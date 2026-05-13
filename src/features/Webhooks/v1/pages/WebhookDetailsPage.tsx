import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Activity, ShieldAlert, CheckCircle2, Settings2, TestTube2, Loader2, ArrowRight, Signal } from "lucide-react";
import { useWebhook, useTestWebhook } from "../hooks/useWebhooks";
import StatusBadge from "../components/common/StatusBadge";
import MaskedSecret from "../components/common/MaskedSecret";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { format } from "date-fns";

export default function WebhookDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toasts, addToast, dismiss } = useToast();
  
  const { data: webhook, isLoading, isError } = useWebhook(id);
  const testWebhook = useTestWebhook();

  if (isLoading) return <div className="p-10 text-center text-[var(--cd-text-muted)]">Loading webhook...</div>;
  if (isError || !webhook) return <div className="p-10 text-center text-[var(--cd-danger)]">Webhook not found.</div>;

  const handleTest = async () => {
    try {
      const res = await testWebhook.mutateAsync(webhook.id);
      if (res.success) {
        addToast("success", "Test Successful", res.message);
      } else {
        addToast("error", "Test Failed", res.message);
      }
    } catch {
      addToast("error", "Test Failed", "Unable to reach the webhook URL.");
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto cd-page" style={{ backgroundColor: "var(--cd-bg)" }}>
      {/* Header */}
      <div
        className="flex justify-between border-b px-5 py-6 sm:px-8 lg:px-10"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/org/dashboard/webhooks")} className="p-2 rounded-lg transition-colors hover:bg-[var(--cd-hover)]" style={{ color: "var(--cd-text-muted)" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: "var(--cd-text)" }}>
              {webhook.name} <StatusBadge status={webhook.status} />
            </h1>
            <p className="text-sm mt-1 font-mono" style={{ color: "var(--cd-text-muted)" }}>{webhook.url}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTest}
            disabled={testWebhook.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--cd-hover)]"
            style={{ color: "var(--cd-text)", borderColor: "var(--cd-border)" }}
          >
            {testWebhook.isPending ? <Loader2 size={16} className="animate-spin" /> : <TestTube2 size={16} />} 
            Ping Test
          </button>
          <button 
            onClick={() => navigate(`/org/dashboard/webhooks/${webhook.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--cd-surface-3)", color: "var(--cd-text-2)" }}
          >
            <Settings2 size={16} /> Edit
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10 flex flex-col gap-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
            <div className="flex items-center gap-3 mb-2" style={{ color: "var(--cd-text-muted)" }}>
              <Activity size={18} /> <h3 className="font-semibold text-sm">Last Delivery</h3>
            </div>
            <p className="text-lg font-bold capitalize" style={{ color: webhook.lastDeliveryStatus === 'success' ? "var(--cd-success)" : webhook.lastDeliveryStatus === 'failed' ? "var(--cd-danger)" : "var(--cd-text)" }}>
              {webhook.lastDeliveryStatus || "Never"}
            </p>
          </div>
          
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
            <div className="flex items-center gap-3 mb-2" style={{ color: "var(--cd-text-muted)" }}>
              <Signal size={18} /> <h3 className="font-semibold text-sm">Connection</h3>
            </div>
            <div>
              <p className="text-lg font-bold capitalize" style={{ color: webhook.lastTestStatus === 'success' ? "var(--cd-success)" : webhook.lastTestStatus === 'failed' ? "var(--cd-danger)" : "var(--cd-text)" }}>
                {webhook.lastTestStatus || "Untested"}
              </p>
              {webhook.lastTestedAt && (
                <p className="text-[10px] mt-1" style={{ color: "var(--cd-text-muted)" }}>
                  {format(new Date(webhook.lastTestedAt), "MMM d, HH:mm")}
                </p>
              )}
            </div>
          </div>
          
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
            <div className="flex items-center gap-3 mb-2" style={{ color: "var(--cd-text-muted)" }}>
              <CheckCircle2 size={18} /> <h3 className="font-semibold text-sm">Events</h3>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--cd-text)" }}>{webhook.events.length}</p>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
            <div className="flex items-center gap-3 mb-2" style={{ color: "var(--cd-text-muted)" }}>
              <ShieldAlert size={18} /> <h3 className="font-semibold text-sm">Secret</h3>
            </div>
            <div className="mt-1"><MaskedSecret secret={webhook.secret} /></div>
          </div>
        </div>

        {/* Events & Permissions Stack */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "var(--cd-text-muted)" }}>Configured Events</h3>
            <div className="flex flex-wrap gap-2">
              {webhook.events.map(ev => (
                <span key={ev} className="px-3 py-1.5 rounded-lg text-sm font-mono" style={{ backgroundColor: "var(--cd-surface-2)", color: "var(--cd-text-2)", border: "1px solid var(--cd-border)" }}>
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {webhook.permissions && webhook.permissions.length > 0 && (
            <div className="rounded-xl border p-6" style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "var(--cd-text-muted)" }}>Required Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {webhook.permissions.map(perm => (
                  <span key={perm} className="px-3 py-1.5 rounded-lg text-sm font-mono" style={{ backgroundColor: "var(--cd-primary-subtle)", color: "var(--cd-primary)", border: "1px solid var(--cd-primary-subtle)" }}>
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick link to Logs */}
        <Link 
          to={`/org/dashboard/webhooks/${webhook.id}/logs`}
          className="rounded-xl border p-6 flex items-center justify-between group transition-all" 
          style={{ backgroundColor: "var(--cd-primary-subtle)", borderColor: "var(--cd-primary)" }}
        >
          <div>
            <h3 className="text-base font-bold" style={{ color: "var(--cd-primary-text)" }}>View Delivery Logs</h3>
            <p className="text-sm mt-1" style={{ color: "var(--cd-primary)" }}>Inspect request payloads, response codes, and retry failed deliveries.</p>
          </div>
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" style={{ color: "var(--cd-primary)" }} />
        </Link>

      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Settings2,
  TestTube2,
  Loader2,
  ArrowRight,
  Signal,
  Zap,
  Clock,
  Terminal,
  Globe,
  Code2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useWebhook, useTestWebhook } from "../hooks/useWebhooks";
import { useWebhookLogs } from "../hooks/useWebhookLogs";
import StatusBadge from "../components/common/StatusBadge";
import MaskedSecret from "../components/common/MaskedSecret";
import LogsTable from "../components/table/LogsTable";
import { ToastContainer, useToast } from "@/features/Tasks/v1/components/common/ToastNotification";
import { format } from "date-fns";

export default function WebhookDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toasts, addToast, dismiss } = useToast();
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: webhook, isLoading, isError } = useWebhook(id);
  const { data: logsData, isLoading: logsLoading } = useWebhookLogs(id, {
    page: 1,
    status: "all",
    event: "all",
  });
  const testWebhook = useTestWebhook();

  if (isLoading)
    return <div className="p-10 text-center text-[var(--cd-text-muted)]">Loading webhook...</div>;
  if (isError || !webhook)
    return <div className="p-10 text-center text-[var(--cd-danger)]">Webhook not found.</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhook.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("success", "URL Copied", "Webhook URL added to clipboard");
  };

  const handleTest = async () => {
    try {
      const res = await testWebhook.mutateAsync(webhook.id);
      setTestResult({ success: res.success, message: res.message, timestamp: new Date() });
      if (res.success) {
        addToast("success", "Ping Sent", "Endpoint returned 200 OK");
      } else {
        addToast("error", "Test Failed", res.message);
      }
    } catch {
      setTestResult({
        success: false,
        message: "Unable to reach endpoint. Check your URL.",
        timestamp: new Date(),
      });
      addToast("error", "Test Failed", "Connection timeout.");
    }
  };

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden cd-page"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      {/* Header */}
      <div
        className="flex justify-between border-b px-5 py-5 sm:px-8 lg:px-10 shrink-0"
        style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border-subtle)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/org/dashboard/webhooks")}
            className="p-2 rounded-lg transition-all hover:bg-[var(--cd-hover)] active:scale-90"
            style={{ color: "var(--cd-text-muted)" }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col gap-0">
            <h1
              className="text-lg font-black flex items-center gap-3 tracking-tight"
              style={{ color: "var(--cd-text)" }}
            >
              {webhook.name} <StatusBadge status={webhook.status} />
            </h1>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={handleCopy}>
              <div
                className="flex items-center gap-1.5 text-[10px] font-mono opacity-50 transition-opacity group-hover:opacity-100"
                style={{ color: "var(--cd-text-muted)" }}
              >
                <Globe size={10} /> {webhook.url}
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded bg-[var(--cd-surface-2)]">
                {copied ? (
                  <Check size={10} className="text-[var(--cd-success)]" />
                ) : (
                  <Copy size={10} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTest}
            disabled={testWebhook.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 hover:bg-[var(--cd-hover)]"
            style={{ color: "var(--cd-text)", borderColor: "var(--cd-border)" }}
          >
            {testWebhook.isPending ? (
              <Loader2 size={14} className="animate-spin text-[var(--cd-primary)]" />
            ) : (
              <TestTube2 size={14} />
            )}
            Ping Test
          </button>
          <button
            onClick={() => navigate(`/org/dashboard/webhooks/${webhook.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm shadow-[var(--cd-primary-subtle)]"
            style={{ backgroundColor: "var(--cd-primary)", color: "white" }}
          >
            <Settings2 size={14} /> Edit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 sm:p-8 lg:p-10 scroll-smooth">
        <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-8">
          {/* Unified Dash Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-4 rounded-2xl border divide-x overflow-hidden group shadow-sm transition-shadow hover:shadow-md"
            style={{
              backgroundColor: "var(--cd-surface)",
              borderColor: "var(--cd-border)",
              divideColor: "var(--cd-border-subtle)",
            }}
          >
            {[
              { label: "Reliability", val: "99.8%", icon: Zap, color: "var(--cd-success)" },
              { label: "Avg Latency", val: "142ms", icon: Clock, color: "var(--cd-primary)" },
              { label: "Volume (24h)", val: "1.2k", icon: Activity, color: "var(--cd-text)" },
              {
                label: "Status",
                val: webhook.status,
                icon: Signal,
                color: webhook.status === "active" ? "var(--cd-success)" : "var(--cd-text-muted)",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 flex flex-col gap-1 transition-colors hover:bg-[var(--cd-hover)]"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--cd-text-muted)] opacity-60">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <stat.icon
                    size={16}
                    style={{ color: stat.color }}
                    className={
                      stat.label === "Status" && webhook.status === "active" ? "animate-pulse" : ""
                    }
                  />
                  <span
                    className="text-2xl font-black tracking-tight capitalize"
                    style={{ color: "var(--cd-text)" }}
                  >
                    {stat.val}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Test Result Banner (Conditional) */}
          {testResult && (
            <div
              className={`rounded-2xl border p-5 flex items-center justify-between animate-in slide-in-from-top-4 duration-300 ${testResult.success ? "bg-[var(--cd-success-subtle)] border-[var(--cd-success)]" : "bg-[var(--cd-danger-subtle)] border-[var(--cd-danger)]"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-xl ${testResult.success ? "bg-[var(--cd-success)] text-white" : "bg-[var(--cd-danger)] text-white"}`}
                >
                  {testResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{
                      color: testResult.success
                        ? "var(--cd-success-text)"
                        : "var(--cd-danger-text)",
                    }}
                  >
                    {testResult.success ? "Connection Successful" : "Connection Failed"}
                  </h4>
                  <p
                    className="text-xs opacity-80"
                    style={{
                      color: testResult.success
                        ? "var(--cd-success-text)"
                        : "var(--cd-danger-text)",
                    }}
                  >
                    {testResult.message} • {format(testResult.timestamp, "HH:mm:ss")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="text-xs font-bold underline opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Activity & Docs */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Recent Deliveries */}
              <div
                className="rounded-2xl border shadow-sm overflow-hidden"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
              >
                <div
                  className="flex items-center justify-between p-5 border-b"
                  style={{ borderColor: "var(--cd-border-subtle)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[var(--cd-primary-subtle)] text-[var(--cd-primary)]">
                      <Terminal size={16} />
                    </div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-[var(--cd-text)]">
                      Recent Deliveries
                    </h3>
                  </div>
                  <Link
                    to={`/org/dashboard/webhooks/${webhook.id}/logs`}
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--cd-primary)] hover:opacity-70 transition-opacity"
                  >
                    Full History
                  </Link>
                </div>
                <div className="p-2">
                  {logsLoading ? (
                    <div className="p-10 text-center text-xs text-[var(--cd-text-muted)] flex flex-col items-center gap-3">
                      <Loader2 size={20} className="animate-spin" /> Loading Activity...
                    </div>
                  ) : (
                    <LogsTable logs={logsData?.data.slice(0, 5) || []} onRetry={() => {}} />
                  )}
                </div>
              </div>{" "}
              {/* Payload Example */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
              >
                <div
                  className="p-5 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--cd-border-subtle)" }}
                >
                  <Code2 size={16} className="text-[var(--cd-primary)]" />
                  <h3 className="font-black text-xs uppercase tracking-widest text-[var(--cd-text)]">
                    Payload Structure
                  </h3>
                </div>
                <div className="p-6">
                  <div
                    className="rounded-xl p-5 font-mono text-[10px] leading-relaxed relative border"
                    style={{ backgroundColor: "#0d1117", color: "#e6edf3", borderColor: "#30363d" }}
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#30363d] text-[#8b949e] text-[9px] font-bold">
                      JSON
                    </div>
                    <pre className="overflow-x-auto">
                      <span style={{ color: "#79c0ff" }}>{"{"}</span>
                      {"\n"}
                      {"  "}
                      <span style={{ color: "#7ee787" }}>"id"</span>:{" "}
                      <span style={{ color: "#a5d6ff" }}>"evt_12345"</span>,{"\n"}
                      {"  "}
                      <span style={{ color: "#7ee787" }}>"type"</span>:{" "}
                      <span style={{ color: "#a5d6ff" }}>
                        "{webhook.events[0] || "member.created"}"
                      </span>
                      ,{"\n"}
                      {"  "}
                      <span style={{ color: "#7ee787" }}>"created"</span>:{" "}
                      <span style={{ color: "#d2a8ff" }}>{Date.now()}</span>,{"\n"}
                      {"  "}
                      <span style={{ color: "#7ee787" }}>"data"</span>:{" "}
                      <span style={{ color: "#79c0ff" }}>{"{"}</span>
                      {"\n"}
                      {"    "}
                      <span style={{ color: "#7ee787" }}>"object"</span>:{" "}
                      <span style={{ color: "#a5d6ff" }}>"member"</span>,{"\n"}
                      {"    "}
                      <span style={{ color: "#7ee787" }}>"id"</span>:{" "}
                      <span style={{ color: "#a5d6ff" }}>"mem_98765"</span>,{"\n"}
                      {"    "}
                      <span style={{ color: "#7ee787" }}>"status"</span>:{" "}
                      <span style={{ color: "#a5d6ff" }}>"active"</span>
                      {"\n"}
                      {"  "}
                      <span style={{ color: "#79c0ff" }}>{"}"}</span>
                      {"\n"}
                      <span style={{ color: "#79c0ff" }}>{"}"}</span>
                    </pre>
                  </div>
                  <p className="mt-4 text-[10px] text-[var(--cd-text-muted)] italic">
                    Note: Requests are POSTed with an{" "}
                    <code className="text-[var(--cd-text)] font-bold">X-CommDesk-Signature</code>{" "}
                    header for verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Configuration */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Security Sidebar Card */}
              <div
                className="rounded-2xl border p-6 flex flex-col gap-6"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
              >
                <div>
                  <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.25em] text-[var(--cd-text-muted)] flex items-center gap-2">
                    <ShieldAlert size={12} /> Security Config
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="p-3 rounded-xl bg-[var(--cd-surface-2)] border border-[var(--cd-border-subtle)]">
                      <span className="text-[9px] font-bold text-[var(--cd-text-muted)] uppercase tracking-wider block mb-2">
                        Signing Secret
                      </span>
                      <MaskedSecret secret={webhook.secret} />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6" style={{ borderColor: "var(--cd-border-subtle)" }}>
                  <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.25em] text-[var(--cd-text-muted)] flex items-center gap-2">
                    <CheckCircle2 size={12} /> Subscriptions
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {webhook.events.map((ev) => (
                      <span
                        key={ev}
                        className="px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase"
                        style={{
                          backgroundColor: "var(--cd-surface-2)",
                          color: "var(--cd-text-2)",
                          borderColor: "var(--cd-border)",
                        }}
                      >
                        {ev.replace(".", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {webhook.permissions && webhook.permissions.length > 0 && (
                  <div className="border-t pt-6" style={{ borderColor: "var(--cd-border-subtle)" }}>
                    <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.25em] text-[var(--cd-text-muted)] flex items-center gap-2">
                      <Zap size={12} /> Scopes
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {webhook.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider"
                          style={{
                            backgroundColor: "var(--cd-primary-subtle)",
                            color: "var(--cd-primary)",
                          }}
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="rounded-2xl border p-6 flex flex-col gap-4 shadow-sm"
                style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[var(--cd-text-muted)] font-medium">Created</span>
                  <span className="font-bold text-[var(--cd-text)]">
                    {format(new Date(webhook.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[var(--cd-text-muted)] font-medium">Internal ID</span>
                  <span className="font-mono text-[9px] opacity-40 text-[var(--cd-text)]">
                    {webhook.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

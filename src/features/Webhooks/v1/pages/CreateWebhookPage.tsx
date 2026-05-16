import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import WebhookForm from "../components/form/WebhookForm";
import { ToastContainer } from "@/features/Tasks/v1/components/common/ToastNotification";

export default function CreateWebhookPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex h-full w-full flex-col cd-page"
      style={{ backgroundColor: "var(--cd-bg)" }}
    >
      {/* Header */}
      <div
        className="flex justify-between border-b px-5 py-4 text-xl font-bold sm:px-8 lg:px-10"
        style={{
          backgroundColor: "var(--cd-surface)",
          borderColor: "var(--cd-border)",
        }}
      >
        <div className="flex h-full min-w-0 items-center">
          <h1
            className="flex min-w-0 items-center gap-3 text-lg font-semibold lg:text-xl"
            style={{ color: "var(--cd-text)" }}
          >
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 transition-colors hover:bg-[var(--cd-hover)]"
              style={{ color: "var(--cd-text-muted)" }}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--cd-primary)" }}
            >
              <Plus size={16} className="text-white" />
            </div>
            Create Webhook
          </h1>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-auto">
        <WebhookForm mode="create" />
      </div>

      <ToastContainer toasts={[]} onDismiss={() => {}} />
    </div>
  );
}

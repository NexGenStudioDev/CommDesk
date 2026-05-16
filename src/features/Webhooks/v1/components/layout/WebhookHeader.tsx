import { useNavigate } from "react-router-dom";
import { Plus, Webhook as WebhookIcon } from "lucide-react";

interface Props {
  totalCount: number;
  activeCount: number;
}

export default function WebhookHeader({ totalCount, activeCount }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="border-b flex flex-col justify-between transition-all duration-300"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border-subtle)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--cd-primary-subtle)",
              color: "var(--cd-primary-text)",
            }}
          >
            <WebhookIcon size={18} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-semibold leading-tight tracking-tight"
              style={{ color: "var(--cd-text)" }}
            >
              Webhooks
            </h1>
            <p className="mt-1 truncate text-sm" style={{ color: "var(--cd-text-2)" }}>
              Manage integrations and real-time events ({activeCount} active of {totalCount})
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/org/dashboard/webhooks/create")}
          className="cd-btn cd-btn-primary h-9 rounded-lg px-3.5 text-sm shadow-none transition-all sm:px-4"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden font-medium sm:inline">Add Webhook</span>
        </button>
      </div>
    </div>
  );
}

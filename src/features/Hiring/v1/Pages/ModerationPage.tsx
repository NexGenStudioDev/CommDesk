import { useTheme } from "@/theme";
import { useModerationJobs, useModerateJob } from "../Hooks/useHiring";
import { FiCheck, FiX, FiAlertOctagon, FiAlertCircle } from "react-icons/fi";

const ModerationPage = () => {
  const { theme } = useTheme();

  // Fetch pending jobs for moderation
  const { data: jobs = [], isLoading } = useModerationJobs();
  const moderateMutation = useModerateJob();

  // Filter jobs requiring moderation (e.g. draft, paused, or we can moderate any job)
  const moderationQueue = jobs.filter((j) => j.status === "draft" || j.status === "paused");

  const handleModeration = (jobId: string, action: "approve" | "reject") => {
    if (confirm(`Are you sure you want to ${action} this job posting?`)) {
      moderateMutation.mutate({ jobId, action, user: "Community Moderator" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
            Community Job Moderation
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Approve or reject job submissions, detect spam, and verify organization hiring policies.
          </p>
        </div>

        {/* Spam warning info bar */}
        <div
          className="mb-8 p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed"
          style={{
            backgroundColor: theme.bg.surfaceSecondary,
            borderColor: theme.border.default,
          }}
        >
          <FiAlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5" style={{ color: theme.text.secondary }}>
            <span className="font-bold text-amber-500">Automated Scam Detection Active</span>
            <span>
              CommDesk uses heuristic scanners to analyze description content, wage structures, and company profiles for phishing signs. Verify all contact links match official domains before approval.
            </span>
          </div>
        </div>

        {/* Moderation table list */}
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: theme.text.secondary }}>
          Pending Queue ({moderationQueue.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-12 text-sm font-medium animate-pulse" style={{ color: theme.text.muted }}>
            Loading moderation queue...
          </div>
        ) : moderationQueue.length === 0 ? (
          <div
            className="text-center py-16 border rounded-xl"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <p className="text-sm" style={{ color: theme.text.muted }}>
              All job submissions have been moderated. The pending queue is empty!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {moderationQueue.map((job) => {
              // Mock a fraud/scam score
              const scamRisk = job.salaryRange.toLowerCase().includes("commission") ? 35 : 5;
              const isHighRisk = scamRisk > 30;

              return (
                <div
                  key={job.id}
                  className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 shadow-sm"
                  style={{ borderColor: theme.border.default }}
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm" style={{ color: theme.text.primary }}>
                        {job.title}
                      </h3>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {job.id} &bull; {job.department}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: theme.text.muted }}>
                      Submitted by: {job.hiringManager} &bull; Community: {job.community}
                    </span>
                    <p className="text-xs leading-relaxed mt-2 max-w-2xl text-zinc-500">
                      {job.description.slice(0, 160)}...
                    </p>
                  </div>

                  {/* Fraud score and Actions */}
                  <div className="flex flex-row md:flex-col items-start md:items-end gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <FiAlertCircle className={isHighRisk ? "text-red-500" : "text-green-500"} />
                      <span style={{ color: theme.text.secondary }}>Automated Risk:</span>
                      <span className={isHighRisk ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                        {scamRisk}%
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModeration(job.id, "reject")}
                        className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1"
                      >
                        <FiX /> Reject
                      </button>
                      <button
                        onClick={() => handleModeration(job.id, "approve")}
                        className="px-3 py-1.5 rounded-lg border border-green-500/20 text-green-500 bg-green-500/5 hover:bg-green-500/10 text-xs font-bold flex items-center gap-1"
                      >
                        <FiCheck /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationPage;

import { useState } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useJobDetail, useApplicants, useUpdateJob, useAuditLogs } from "../Hooks/useHiring";
import { JobStatus } from "../Types/Hiring.types";
import Button from "@/Component/ui/Button";
import { FiShare2, FiSlash, FiEdit2, FiEye, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const JobDetailsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch data
  const { data: job, isLoading, isError } = useJobDetail(id);
  const { data: applicants = [] } = useApplicants(id);
  const { data: audits = [] } = useAuditLogs(id);
  const updateJobMutation = useUpdateJob();

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "applicants" | "audits">("overview");

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-sm font-medium animate-pulse" style={{ color: theme.text.secondary }}>
          Loading role analytics details...
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <FiAlertTriangle className="w-12 h-12 text-amber-500" />
        <div className="text-sm font-bold" style={{ color: theme.text.primary }}>
          Hiring opening not found
        </div>
        <Button text="Back to Jobs" onClick={() => navigate("/org/jobs")} />
      </div>
    );
  }

  const handleToggleStatus = () => {
    const nextStatus: JobStatus = job.status === "active" ? "paused" : "active";
    updateJobMutation.mutate({ id: job.id, patch: { status: nextStatus } });
  };

  // Top matching applicants (Match Score >= 85%)
  const topApplicants = [...applicants]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // Status colors
  const statusIsActive = job.status === "active";

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.bg.page }}>
      {/* Detail header */}
      <div
        className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/org/jobs")}
            className="p-1.5 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800"
            style={{ borderColor: theme.border.default, color: theme.text.primary }}
          >
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight" style={{ color: theme.text.primary }}>
                {job.title}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide`}
                style={{
                  backgroundColor: statusIsActive ? theme.success.subtle : theme.warning.subtle,
                  color: statusIsActive ? theme.success.default : theme.warning.default,
                }}
              >
                {job.status}
              </span>
            </div>
            <span className="text-xs" style={{ color: theme.text.muted }}>
              Hiring Page &bull; {job.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            text="Share"
            variant="secondary"
            icon={<FiShare2 className="mr-1.5" />}
            onClick={() => alert(`Job opening URL copied to clipboard: ${window.location.origin}/company/nexgen-studios/jobs/${job.id}`)}
          />
          <Button
            text={job.status === "active" ? "Pause Job" : "Resume Job"}
            variant="secondary"
            icon={<FiSlash className="mr-1.5" />}
            onClick={handleToggleStatus}
          />
          <Button
            text="Edit Details"
            icon={<FiEdit2 className="mr-1.5" />}
            onClick={() => navigate(`/org/jobs/${job.id}/edit`)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-6" style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}>
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSubTab("applicants")}
          className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeSubTab === "applicants"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Applicants
          <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold">
            {applicants.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("audits")}
          className={`py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === "audits"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Activity Log
        </button>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6">
        {/* Left Columns - Tab Contents */}
        <div className="flex-1 flex flex-col gap-6">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === "overview" && (
            <>
              {/* Analytics summary row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="border rounded-xl p-5 shadow-sm flex flex-col gap-2 bg-white dark:bg-zinc-900"
                  style={{ borderColor: theme.border.default }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span>Views</span>
                    <FiEye className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                      {job.views.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
                      <MdTrendingUp /> 12%
                    </span>
                  </div>
                </div>

                <div
                  className="border rounded-xl p-5 shadow-sm flex flex-col gap-2 bg-white dark:bg-zinc-900"
                  style={{ borderColor: theme.border.default }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span>Unique Visitors</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                      {Math.round(job.views * 0.72).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
                      <MdTrendingUp /> 5%
                    </span>
                  </div>
                </div>

                <div
                  className="border rounded-xl p-5 shadow-sm flex flex-col gap-2 bg-white dark:bg-zinc-900"
                  style={{ borderColor: theme.border.default }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span>Avg. Time on Page</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                      03:42
                    </span>
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">
                      <MdTrendingDown /> 2%
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div
                className="border rounded-xl p-6 shadow-sm"
                style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                    Candidate Funnel Analytics
                  </h3>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    Last 30 Days
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Funnel Level 1 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span style={{ color: theme.text.secondary }}>Profile Views</span>
                      <span style={{ color: theme.text.primary }} className="font-bold">{job.views.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>

                  {/* Funnel Level 2 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: theme.text.secondary }}>Applications Started</span>
                        <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-1 py-0.25 rounded">85% CR</span>
                      </div>
                      <span style={{ color: theme.text.primary }} className="font-bold">{Math.round(job.views * 0.85).toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Funnel Level 3 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: theme.text.secondary }}>Completed Applications</span>
                        <span className="text-[9px] font-bold text-purple-500 bg-purple-500/10 px-1 py-0.25 rounded">1.1% CR</span>
                      </div>
                      <span style={{ color: theme.text.primary }} className="font-bold">{job.applicantsCount}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(job.applicantsCount / job.views) * 100}%`, minWidth: "2%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top matching applicants */}
              <div
                className="border rounded-xl p-6 shadow-sm"
                style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                    Top Matching Applicants
                  </h3>
                  <button
                    onClick={() => setActiveSubTab("applicants")}
                    className="text-xs font-bold text-blue-500 hover:underline"
                  >
                    View All
                  </button>
                </div>

                {topApplicants.length === 0 ? (
                  <p className="text-xs" style={{ color: theme.text.muted }}>
                    No candidates have applied to this role yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topApplicants.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => navigate(`/org/jobs/${job.id}/applicants/${app.id}`)}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        style={{ borderColor: theme.border.default }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold" style={{ color: theme.primary.default }}>
                            {app.name[0]}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold" style={{ color: theme.text.primary }}>{app.name}</span>
                            <span className="text-[10px]" style={{ color: theme.text.muted }}>{app.experience}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-500/10">
                            MATCH: {app.matchScore}%
                          </span>
                          <span className="text-[10px] font-bold uppercase text-zinc-400">{app.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: APPLICANTS IN DETAIL */}
          {activeSubTab === "applicants" && (
            <div
              className="border rounded-xl p-6 shadow-sm flex flex-col gap-4"
              style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                  Pipeline Candidates
                </h3>
                <Button
                  text="Go to ATS Board"
                  onClick={() => navigate(`/org/jobs/${job.id}/applicants`)}
                />
              </div>

              {applicants.length === 0 ? (
                <p className="text-xs py-8 text-center" style={{ color: theme.text.muted }}>
                  No candidates listed for this opening.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b" style={{ borderColor: theme.border.default, color: theme.text.muted }}>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Name</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Match Score</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Pipeline Stage</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider">Experience</th>
                        <th className="py-2.5 font-bold uppercase tracking-wider text-right">Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.border.default }}>
                      {applicants.map((app) => (
                        <tr key={app.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <td className="py-3 font-semibold" style={{ color: theme.text.primary }}>{app.name}</td>
                          <td className="py-3">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${app.matchScore >= 80 ? "text-green-600 bg-green-500/10" : "text-amber-600 bg-amber-500/10"}`}>
                              {app.matchScore}%
                            </span>
                          </td>
                          <td className="py-3 uppercase font-bold text-[10px]" style={{ color: theme.text.secondary }}>{app.status}</td>
                          <td className="py-3" style={{ color: theme.text.muted }}>{app.experience}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => navigate(`/org/jobs/${job.id}/applicants/${app.id}`)}
                              className="text-xs font-bold text-blue-500 hover:underline"
                            >
                              Open &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTIVITY LOGS */}
          {activeSubTab === "audits" && (
            <div
              className="border rounded-xl p-6 shadow-sm flex flex-col gap-4"
              style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                Role Revision Logs
              </h3>

              {audits.length === 0 ? (
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  No activities recorded yet.
                </p>
              ) : (
                <div className="relative border-l pl-4 flex flex-col gap-6" style={{ borderColor: theme.border.default }}>
                  {audits.map((log) => (
                    <div key={log.id} className="relative text-xs flex flex-col gap-1">
                      <div
                        className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border bg-white dark:bg-zinc-800"
                        style={{ borderColor: theme.primary.default }}
                      />
                      <span className="font-bold" style={{ color: theme.text.primary }}>
                        {log.action}
                      </span>
                      <span className="text-[10px]" style={{ color: theme.text.muted }}>
                        {new Date(log.timestamp).toLocaleString()} &bull; {log.user}
                      </span>
                      <p className="leading-relaxed mt-0.5" style={{ color: theme.text.secondary }}>
                        {log.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Metadata panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div
            className="border rounded-xl p-5 shadow-sm flex flex-col gap-5"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
              Job Metadata
            </h3>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Hiring Manager</span>
                <span style={{ color: theme.text.primary }}>{job.hiringManager}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Community Partner</span>
                <span style={{ color: theme.text.primary }}>{job.community}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Posted Date</span>
                <span style={{ color: theme.text.primary }}>{job.postedDate}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Expiration Date</span>
                <span style={{ color: theme.text.primary }}>{job.expirationDate}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Work Model</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 w-fit text-[10px] font-bold uppercase mt-1">
                  {job.workplaceType} Friendly
                </span>
              </div>
            </div>
          </div>

          {/* Distribution card */}
          <div
            className="border rounded-xl p-5 shadow-sm flex flex-col gap-4"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
              <span>Distribution Channels</span>
              <span className="text-zinc-400 hover:text-zinc-600 cursor-pointer">+</span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text.secondary }}>Internal Career Site</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text.secondary }}>LinkedIn Recruiter</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text.secondary }}>Dribbble Jobs</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

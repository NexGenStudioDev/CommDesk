import { useState, useMemo } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicants, useJobDetail, useUpdateApplicantStatus } from "../Hooks/useHiring";
import { ApplicantStatus } from "../Types/Hiring.types";
import { FiSearch, FiDownload, FiArrowLeft } from "react-icons/fi";
import { MdOutlineThumbDown, MdTrendingUp } from "react-icons/md";

const ApplicantsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();

  // Search & filters state
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "strong" | "applied" | "screening" | "interview" | "offer" | "rejected">("all");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  // Fetch job & applicants
  const { data: job } = useJobDetail(jobId);
  const { data: allJobApplicants = [], isLoading } = useApplicants(jobId);
  const updateStatusMutation = useUpdateApplicantStatus();

  // Metrics (dynamically computed from all applicants for this job)
  const totalCount = allJobApplicants.length;
  const screeningCount = allJobApplicants.filter((a) => a.status === "screening").length;
  const interviewCount = allJobApplicants.filter((a) => ["technical", "interview", "hr"].includes(a.status)).length;
  const offerCount = allJobApplicants.filter((a) => ["offer", "hired"].includes(a.status)).length;
  const rejectedCount = allJobApplicants.filter((a) => a.status === "rejected").length;

  // Filter in memory
  const applicants = useMemo(() => {
    let list = [...allJobApplicants];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeTab && activeTab !== "all") {
      if (activeTab === "strong") {
        list = list.filter((a) => a.matchScore >= 85);
      } else {
        list = list.filter((a) => a.status === activeTab);
      }
    }

    return list;
  }, [allJobApplicants, search, activeTab]);

  const handleSelectApplicant = (id: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map((a) => a.id));
    }
  };

  const handleBulkStatusChange = (status: ApplicantStatus) => {
    if (selectedApplicants.length === 0) return;
    if (confirm(`Change status of ${selectedApplicants.length} applicants to '${status}'?`)) {
      selectedApplicants.forEach((appId) => {
        updateStatusMutation.mutate({ id: appId, status, user: "Hiring Manager" });
      });
      setSelectedApplicants([]);
      setBulkStatus("");
    }
  };

  const handleExportCSV = () => {
    const headers = "Name,Email,Match Score,Status,Experience,Applied Date\n";
    const rows = applicants
      .map((a) => `"${a.name}","${a.email}",${a.matchScore},"${a.status}","${a.experience}","${a.appliedDate}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `applicants_export_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status: ApplicantStatus) => {
    switch (status) {
      case "applied":
        return { bg: "bg-blue-500/10", text: "text-blue-500", label: "Applied" };
      case "screening":
        return { bg: "bg-cyan-500/10", text: "text-cyan-500", label: "Screening" };
      case "technical":
      case "interview":
      case "hr":
        return { bg: "bg-purple-500/10", text: "text-purple-500", label: "Interviewing" };
      case "offer":
        return { bg: "bg-indigo-500/10", text: "text-indigo-500", label: "Offer Out" };
      case "hired":
        return { bg: "bg-green-500/10", text: "text-green-500", label: "Hired" };
      case "rejected":
        return { bg: "bg-red-500/10", text: "text-red-500", label: "Rejected" };
      default:
        return { bg: "bg-zinc-100", text: "text-zinc-500", label: status };
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden animate-fade-in" style={{ backgroundColor: theme.bg.page }}>
      {/* Top Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/org/jobs/${jobId}`)}
            className="p-1.5 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800"
            style={{ borderColor: theme.border.default, color: theme.text.primary }}
          >
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold tracking-tight" style={{ color: theme.text.primary }}>
              {job?.title} Applicants
            </h1>
            <span className="text-xs" style={{ color: theme.text.muted }}>
              ATS Pipeline Manager
            </span>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          style={{ borderColor: theme.border.default, color: theme.text.primary }}
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
        {/* Metric 1 */}
        <div
          className="border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm bg-white dark:bg-zinc-900"
          style={{ borderColor: theme.border.default }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
              {totalCount}
            </span>
            <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-1 py-0.25 rounded flex items-center">
              +12% <MdTrendingUp className="ml-0.5" />
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          className="border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm bg-white dark:bg-zinc-900"
          style={{ borderColor: theme.border.default }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Screening</span>
          <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
            {screeningCount}
          </span>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${totalCount ? (screeningCount / totalCount) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div
          className="border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm bg-white dark:bg-zinc-900"
          style={{ borderColor: theme.border.default }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Interview</span>
          <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
            {interviewCount}
          </span>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${totalCount ? (interviewCount / totalCount) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div
          className="border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm bg-white dark:bg-zinc-900"
          style={{ borderColor: theme.border.default }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Offer</span>
          <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
            {offerCount}
          </span>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalCount ? (offerCount / totalCount) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Metric 5 */}
        <div
          className="border rounded-xl p-4 flex flex-col gap-1.5 shadow-sm bg-white dark:bg-zinc-900"
          style={{ borderColor: theme.border.default }}
        >
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Rejected</span>
            <MdOutlineThumbDown className="w-3.5 h-3.5 text-red-500" />
          </div>
          <span className="text-xl font-bold" style={{ color: theme.text.primary }}>
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Action Filters Row */}
      <div className="px-6 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border w-full md:w-auto" style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            All Applicants
          </button>
          <button
            onClick={() => setActiveTab("strong")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "strong"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            Strong Matches
          </button>
          <button
            onClick={() => setActiveTab("screening")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "screening"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            Screening
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 justify-end">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search applicants, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs outline-none"
              style={{
                backgroundColor: theme.bg.surface,
                borderColor: theme.border.default,
                color: theme.text.primary,
              }}
            />
          </div>

          {selectedApplicants.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => handleBulkStatusChange(e.target.value as ApplicantStatus)}
                className="p-1.5 border rounded-lg text-xs outline-none bg-white dark:bg-zinc-800"
                style={{ borderColor: theme.border.default, color: theme.text.primary }}
              >
                <option value="">Bulk Status Actions</option>
                <option value="screening">Move to Screening</option>
                <option value="technical">Move to Technical</option>
                <option value="interview">Move to Interview</option>
                <option value="offer">Move to Offer</option>
                <option value="rejected">Reject Candidates</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table grid */}
      <div className="flex-1 px-6 pb-6">
        <div className="border rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: theme.border.default, color: theme.text.muted, backgroundColor: theme.bg.surfaceSecondary }}>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedApplicants.length === applicants.length && applicants.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4">Applicant Name</th>
                  <th className="p-4 text-center">Match Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-medium" style={{ borderColor: theme.border.default }}>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center animate-pulse" style={{ color: theme.text.muted }}>
                      Loading candidates...
                    </td>
                  </tr>
                ) : applicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center" style={{ color: theme.text.muted }}>
                      No candidates found matching the active filter.
                    </td>
                  </tr>
                ) : (
                  applicants.map((app) => {
                    const status = getStatusStyle(app.status);
                    const isSelected = selectedApplicants.includes(app.id);
                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${
                          isSelected ? "bg-blue-500/5" : ""
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectApplicant(app.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-zinc-100 dark:bg-zinc-800"
                              style={{ color: theme.primary.default }}
                            >
                              {app.name[0]}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span
                                className="font-semibold cursor-pointer hover:underline"
                                style={{ color: theme.text.primary }}
                                onClick={() => navigate(`/org/jobs/${jobId}/applicants/${app.id}`)}
                              >
                                {app.name}
                              </span>
                              <span className="text-[10px]" style={{ color: theme.text.muted }}>
                                {app.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              app.matchScore >= 85
                                ? "text-green-600 bg-green-500/10"
                                : app.matchScore >= 70
                                  ? "text-blue-600 bg-blue-500/10"
                                  : "text-zinc-500 bg-zinc-100"
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide inline-block ${status.bg} ${status.text}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4" style={{ color: theme.text.secondary }}>
                          {app.experience}
                        </td>
                        <td className="p-4" style={{ color: theme.text.secondary }}>
                          {app.appliedDate}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => navigate(`/org/jobs/${jobId}/applicants/${app.id}`)}
                            className="text-xs font-bold text-blue-500 hover:underline"
                          >
                            Review Profile &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;

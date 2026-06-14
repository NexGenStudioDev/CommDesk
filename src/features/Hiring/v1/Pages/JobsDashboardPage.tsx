import { useState, useMemo } from "react";
import { useTheme } from "@/theme";
import { useNavigate } from "react-router-dom";
import { useJobs, useCreateJob, useDeleteJob, useUpdateJob } from "../Hooks/useHiring";
import { JobRole, JobStatus } from "../Types/Hiring.types";
import Button from "@/Component/ui/Button";
import { FiSearch, FiSliders, FiPlus, FiEye, FiEdit2, FiCopy, FiSlash, FiDownload, FiTrash2 } from "react-icons/fi";
import { MdWorkOutline, MdPeopleOutline, MdCheckCircleOutline } from "react-icons/md";

const JobsDashboardPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "archived">("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  // Fetch jobs
  const { data: allJobs = [], isLoading } = useJobs();

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  // Filter in memory
  const jobs = useMemo(() => {
    return allJobs.filter((job) => {
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchDept = job.department.toLowerCase().includes(q);
        const matchManager = job.hiringManager.toLowerCase().includes(q);
        const matchId = job.id.toLowerCase().includes(q);
        if (!matchTitle && !matchDept && !matchManager && !matchId) return false;
      }

      if (activeTab && activeTab !== "all") {
        if (job.status.toLowerCase() !== activeTab.toLowerCase()) return false;
      }

      if (selectedDept && selectedDept !== "all") {
        if (job.department.toLowerCase() !== selectedDept.toLowerCase()) return false;
      }

      return true;
    });
  }, [allJobs, search, activeTab, selectedDept]);

  // Metrics
  const activeOpenings = allJobs.filter((j) => j.status === "active").length;
  const totalApplicants = allJobs.reduce((sum, j) => sum + j.applicantsCount, 0);

  // Departments list for filtering
  const departments = ["all", "Product", "Engineering", "Sales", "HR"];

  const handleSelectJob = (id: string) => {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map((j) => j.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete the ${selectedJobs.length} selected job openings?`)) {
      selectedJobs.forEach((id) => deleteJobMutation.mutate(id));
      setSelectedJobs([]);
    }
  };

  const handleDuplicate = (job: JobRole) => {
    const duplicatedPayload = {
      title: `${job.title} (Copy)`,
      department: job.department,
      hiringManager: job.hiringManager,
      community: job.community,
      slug: `${job.slug}-copy`,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      skills: job.skills,
      tags: job.tags,
      employmentType: job.employmentType,
      workplaceType: job.workplaceType,
      salaryRange: job.salaryRange,
      openings: job.openings,
      timeline: job.timeline,
      expirationDate: job.expirationDate,
      visibility: job.visibility,
      isFeatured: job.isFeatured,
      isSponsored: job.isSponsored,
      status: "draft" as JobStatus,
    };

    createJobMutation.mutate(duplicatedPayload, {
      onSuccess: () => {
        alert("Job opening duplicated successfully in Draft status!");
      },
    });
  };

  const handleExportCSV = () => {
    const headers = "Job ID,Title,Department,Status,Applicants,Views,Posted Date\n";
    const rows = jobs
      .map((j) => `"${j.id}","${j.title}","${j.department}","${j.status}",${j.applicantsCount},${j.views},"${j.postedDate}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `jobs_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "active":
        return { bg: theme.success.subtle, text: theme.success.default, label: "Active" };
      case "draft":
        return { bg: theme.bg.surfaceSecondary, text: theme.text.secondary, label: "Draft" };
      case "paused":
        return { bg: theme.warning.subtle, text: theme.warning.default, label: "Paused" };
      case "closed":
      case "archived":
        return { bg: theme.danger.subtle, text: theme.danger.default, label: status === "closed" ? "Closed" : "Archived" };
      default:
        return { bg: theme.bg.surfaceSecondary, text: theme.text.muted, label: status };
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.bg.page }}>
      {/* Top Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
            Active Openings
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>
            <span>Hiring Dashboard</span>
          </div>
        </div>

        <Button
          text="Create New Job"
          icon={<FiPlus className="mr-1.5" />}
          onClick={() => navigate("/org/jobs/create")}
        />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div
          className="border rounded-xl p-5 flex items-center gap-4 shadow-sm"
          style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
        >
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <MdWorkOutline className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.muted }}>
              Active Openings
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                {activeOpenings}
              </span>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                +12% vs last month
              </span>
            </div>
          </div>
        </div>

        <div
          className="border rounded-xl p-5 flex items-center gap-4 shadow-sm"
          style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
        >
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
            <MdPeopleOutline className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.muted }}>
              Total Applicants
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                {totalApplicants}
              </span>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                +8.4% high-intent
              </span>
            </div>
          </div>
        </div>

        <div
          className="border rounded-xl p-5 flex items-center gap-4 shadow-sm"
          style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
        >
          <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
            <MdCheckCircleOutline className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.muted }}>
              Hiring Success Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                94.2%
              </span>
              <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                Benchmark: Optimal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border w-full md:w-auto" style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "draft"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === "archived"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            Archived
          </button>
        </div>

        {/* Inputs */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 justify-end">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search jobs, departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: theme.bg.surface,
                borderColor: theme.border.default,
                color: theme.text.primary,
              }}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
            style={{ borderColor: theme.border.default }}
            title="Toggle Filters"
          >
            <FiSliders className="w-4 h-4 text-zinc-500" />
          </button>

          {selectedJobs.length > 0 ? (
            <button
              onClick={handleBulkDelete}
              className="p-2 border rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/30"
              title="Delete Selected"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleExportCSV}
              className="p-2 border rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default }}
              title="Export CSV"
            >
              <FiDownload className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expand */}
      {showFilters && (
        <div className="mx-6 mb-4 p-4 border rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4" style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.text.muted }}>Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-2 border rounded-lg text-xs outline-none"
              style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default, color: theme.text.primary }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Departments" : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 px-6 pb-6">
        <div className="border rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: theme.border.default, color: theme.text.muted, backgroundColor: theme.bg.surfaceSecondary }}>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4">Job Title & ID</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Applicants</th>
                  <th className="p-4 text-center">Views</th>
                  <th className="p-4">Posted Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-medium" style={{ borderColor: theme.border.default }}>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center" style={{ color: theme.text.muted }}>
                      Loading openings...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center" style={{ color: theme.text.muted }}>
                      No job openings found matching your search.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => {
                      const status = getStatusColor(job.status);
                      const isSelected = selectedJobs.includes(job.id);
                      return (
                        <tr
                          key={job.id}
                          className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${
                            isSelected ? "bg-blue-500/5" : ""
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectJob(job.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span
                                className="font-semibold cursor-pointer hover:underline"
                                style={{ color: theme.text.primary }}
                                onClick={() => navigate(`/org/jobs/${job.id}`)}
                              >
                                {job.title}
                              </span>
                              <span className="text-[10px] font-semibold" style={{ color: theme.text.muted }}>
                                {job.id}
                              </span>
                            </div>
                          </td>
                          <td className="p-4" style={{ color: theme.text.secondary }}>
                            {job.department}
                          </td>
                          <td className="p-4">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block"
                              style={{ backgroundColor: status.bg, color: status.text }}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold" style={{ color: theme.text.primary }}>
                            {job.status === "draft" ? "—" : job.applicantsCount}
                          </td>
                          <td className="p-4 text-center" style={{ color: theme.text.secondary }}>
                            {job.status === "draft" ? "—" : job.views.toLocaleString()}
                          </td>
                          <td className="p-4" style={{ color: theme.text.secondary }}>
                            {job.postedDate}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/org/jobs/${job.id}`)}
                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                                title="View details"
                              >
                                <FiEye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => navigate(`/org/jobs/${job.id}/edit`)}
                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                                title="Edit opening"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicate(job)}
                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                                title="Duplicate role"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const nextStatus = job.status === "active" ? "paused" : "active";
                                  updateJobMutation.mutate({ id: job.id, patch: { status: nextStatus } });
                                }}
                                className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                                title={job.status === "active" ? "Pause recruiting" : "Activate recruiting"}
                              >
                                <FiSlash className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* Footer velocities */}
      <div className="mx-6 mb-8 p-5 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/30" style={{ borderColor: theme.border.default }}>
        <div className="flex flex-col gap-0.5 max-w-xl">
          <h4 className="text-xs font-bold" style={{ color: theme.text.primary }}>Hiring Velocity Insight</h4>
          <p className="text-[11px]" style={{ color: theme.text.secondary }}>
            Your Engineering department is hiring 15% faster than last quarter. Consider increasing referral bonuses for Product Design to match this efficiency.
          </p>
        </div>
        <div className="text-xs font-bold text-blue-500 px-3 py-1.5 border rounded-lg border-blue-500/20 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10">
          Analyze Funnels &rarr;
        </div>
      </div>
    </div>
  );
};

export default JobsDashboardPage;

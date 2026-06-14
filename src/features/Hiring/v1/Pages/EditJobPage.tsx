import React, { useState, useEffect } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useJobDetail, useUpdateJob, useAuditLogs } from "../Hooks/useHiring";
import { JobStatus, EmploymentType, WorkplaceType, JobVisibility } from "../Types/Hiring.types";
import Input from "@/Component/ui/Input";
import Button from "@/Component/ui/Button";
import { FiSave, FiClock, FiCheck, FiArrowLeft } from "react-icons/fi";

const EditJobPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch job & audits
  const { data: job, isLoading } = useJobDetail(id);
  const { data: audits = [] } = useAuditLogs(id);
  const updateJobMutation = useUpdateJob();

  // Form Fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [community, setCommunity] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [tags, setTags] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full-time");
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>("remote");
  const [salaryRange, setSalaryRange] = useState("");
  const [openings, setOpenings] = useState(1);
  const [timeline, setTimeline] = useState("Immediate");
  const [expirationDate, setExpirationDate] = useState("");
  const [visibility, setVisibility] = useState<JobVisibility>("public");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus>("active");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setDepartment(job.department || "");
      setHiringManager(job.hiringManager || "");
      setCommunity(job.community || "");
      setSlug(job.slug || "");
      setDescription(job.description || "");
      setResponsibilities(job.responsibilities || []);
      setRequirements(job.requirements || []);
      setBenefits(job.benefits || []);
      setSkills(job.skills?.join(", ") || "");
      setTags(job.tags?.join(", ") || "");
      setEmploymentType(job.employmentType || "full-time");
      setWorkplaceType(job.workplaceType || "remote");
      setSalaryRange(job.salaryRange || "");
      setOpenings(job.openings || 1);
      setTimeline(job.timeline || "Immediate");
      setExpirationDate(job.expirationDate || "");
      setVisibility(job.visibility || "public");
      setIsFeatured(job.isFeatured || false);
      setIsSponsored(job.isSponsored || false);
      setJobStatus(job.status || "active");
    }
  }, [job]);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!title) nextErrors.title = "Job Title is required.";
    if (!department) nextErrors.department = "Department is required.";
    if (!hiringManager) nextErrors.hiringManager = "Hiring Manager is required.";
    if (!slug) nextErrors.slug = "URL Slug is required.";
    if (!description) nextErrors.description = "Description is required.";
    if (!salaryRange) nextErrors.salaryRange = "Salary Range is required.";
    if (!expirationDate) nextErrors.expirationDate = "Expiration Date is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const parsedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const patch = {
      title,
      department,
      hiringManager,
      community,
      slug,
      description,
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      benefits: benefits.filter((b) => b.trim()),
      skills: parsedSkills,
      tags: parsedTags,
      employmentType,
      workplaceType,
      salaryRange,
      openings,
      timeline,
      expirationDate,
      visibility,
      isFeatured,
      isSponsored,
      status: jobStatus,
    };

    updateJobMutation.mutate(
      { id, patch },
      {
        onSuccess: () => {
          setSuccessMsg("Role configuration updated successfully!");
          setTimeout(() => {
            setSuccessMsg("");
            navigate("/org/jobs");
          }, 1500);
        },
        onError: (err) => {
          console.error("Update failed:", err);
          alert("Failed to save updates. Please try again.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-sm font-medium animate-pulse" style={{ color: theme.text.secondary }}>
          Loading job configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Editor Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => navigate("/org/jobs")}
              className="p-1.5 rounded-lg border hover:bg-zinc-100 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default, color: theme.text.primary }}
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
                Edit Opening Detail
              </h1>
              <span className="text-xs" style={{ color: theme.text.muted }}>
                {id} &mdash; Revision Manager
              </span>
            </div>
          </div>

          {successMsg && (
            <div
              className="p-4 rounded-lg text-xs font-bold border flex items-center gap-2"
              style={{
                backgroundColor: theme.success.subtle,
                borderColor: theme.success.default,
                color: theme.success.default,
              }}
            >
              <FiCheck /> {successMsg}
            </div>
          )}

          {/* Form Content */}
          <div
            className="border rounded-xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
              Basic Info
            </h3>
            <Input
              label="Job Title"
              name="title"
              value={title}
              onChange={(_, val) => setTitle(val)}
              error={errors.title}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Department"
                name="department"
                value={department}
                onChange={(_, val) => setDepartment(val)}
                error={errors.department}
                required
              />
              <Input
                label="Hiring Manager"
                name="hiringManager"
                value={hiringManager}
                onChange={(_, val) => setHiringManager(val)}
                error={errors.hiringManager}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="URL Slug"
                name="slug"
                value={slug}
                onChange={(_, val) => setSlug(val)}
                error={errors.slug}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Community Partner
                </label>
                <input
                  type="text"
                  value={community}
                  disabled
                  className="p-2.5 border rounded-lg text-sm bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
                  style={{ borderColor: theme.border.default, color: theme.text.muted }}
                />
              </div>
            </div>
          </div>

          <div
            className="border rounded-xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
              Settings & Publishing Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Employment
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="p-2.5 border rounded-lg text-sm outline-none"
                  style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default, color: theme.text.primary }}
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Workspace Type
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                  className="p-2.5 border rounded-lg text-sm outline-none"
                  style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default, color: theme.text.primary }}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-Site</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salary range"
                name="salaryRange"
                value={salaryRange}
                onChange={(_, val) => setSalaryRange(val)}
                error={errors.salaryRange}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Recruiting Status
                </label>
                <select
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value as JobStatus)}
                  className="p-2.5 border rounded-lg text-sm outline-none"
                  style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default, color: theme.text.primary }}
                >
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Private)</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Expiration Date *
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="p-2 border rounded-lg text-xs outline-none"
                  style={{
                    backgroundColor: theme.bg.surface,
                    borderColor: errors.expirationDate ? theme.danger.default : theme.border.default,
                    color: theme.text.primary,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="border rounded-xl p-6 flex flex-col gap-5"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
              Job Description Context
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 border rounded-lg p-3 outline-none text-sm resize-none"
              style={{
                backgroundColor: theme.bg.surface,
                borderColor: errors.description ? theme.danger.default : theme.border.default,
                color: theme.text.primary,
              }}
              required
            />
          </div>

          <div className="flex justify-end gap-3 items-center">
            <Button
              text="Cancel"
              variant="secondary"
              onClick={() => navigate("/org/jobs")}
            />
            <Button
              text={updateJobMutation.isPending ? "Saving changes..." : "Save Configuration"}
              onClick={() => {}}
              type="submit"
              disabled={updateJobMutation.isPending}
              icon={<FiSave className="mr-1.5" />}
            />
          </div>
        </form>

        {/* Sidebar Audit Logs & Timeline */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div
            className="border rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <FiClock className="text-zinc-500" /> Audit Log Timeline
            </h3>

            {audits.length === 0 ? (
              <p className="text-xs" style={{ color: theme.text.muted }}>
                No audit transactions logged for this role yet.
              </p>
            ) : (
              <div className="relative border-l pl-4 flex flex-col gap-5" style={{ borderColor: theme.border.default }}>
                {audits.map((log) => (
                  <div key={log.id} className="relative text-xs flex flex-col gap-0.5">
                    {/* Circle timeline indicator */}
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
                    <p className="mt-1 leading-relaxed" style={{ color: theme.text.secondary }}>
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobPage;

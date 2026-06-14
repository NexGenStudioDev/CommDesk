import React, { useState, useEffect } from "react";
import { useTheme } from "@/theme";
import { useNavigate } from "react-router-dom";
import { useCreateJob } from "../Hooks/useHiring";
import { JobStatus, EmploymentType, WorkplaceType, JobVisibility } from "../Types/Hiring.types";
import Input from "@/Component/ui/Input";
import { FiChevronRight, FiChevronLeft, FiPlus, FiTrash, FiSave } from "react-icons/fi";

const CreateJobPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  // Active step
  const [step, setStep] = useState(1);

  // Form Fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [community, setCommunity] = useState("");
  const [slug, setSlug] = useState("");

  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);
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
  const [autosaveMsg, setAutosaveMsg] = useState("");

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("commdesk-create-job-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setDepartment(draft.department || "");
        setHiringManager(draft.hiringManager || "");
        setCommunity(draft.community || "");
        setSlug(draft.slug || "");
        setDescription(draft.description || "");
        setResponsibilities(draft.responsibilities || [""]);
        setRequirements(draft.requirements || [""]);
        setBenefits(draft.benefits || [""]);
        setSkills(draft.skills || "");
        setTags(draft.tags || "");
        setEmploymentType(draft.employmentType || "full-time");
        setWorkplaceType(draft.workplaceType || "remote");
        setSalaryRange(draft.salaryRange || "");
        setOpenings(draft.openings || 1);
        setTimeline(draft.timeline || "Immediate");
        setExpirationDate(draft.expirationDate || "");
        setVisibility(draft.visibility || "public");
        setIsFeatured(draft.isFeatured || false);
        setIsSponsored(draft.isSponsored || false);
        setJobStatus(draft.jobStatus || "active");
        setStep(draft.step || 1);
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    }
  }, []);

  // Auto-save draft on values change
  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = {
        title,
        department,
        hiringManager,
        community,
        slug,
        description,
        responsibilities,
        requirements,
        benefits,
        skills,
        tags,
        employmentType,
        workplaceType,
        salaryRange,
        openings,
        timeline,
        expirationDate,
        visibility,
        isFeatured,
        isSponsored,
        jobStatus,
        step,
      };
      localStorage.setItem("commdesk-create-job-draft", JSON.stringify(draft));
      setAutosaveMsg("Draft autosaved");
      setTimeout(() => setAutosaveMsg(""), 2500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    title,
    department,
    hiringManager,
    community,
    slug,
    description,
    responsibilities,
    requirements,
    benefits,
    skills,
    tags,
    employmentType,
    workplaceType,
    salaryRange,
    openings,
    timeline,
    expirationDate,
    visibility,
    isFeatured,
    isSponsored,
    jobStatus,
    step,
  ]);

  // Generate slug automatically from title
  useEffect(() => {
    if (title && step === 1) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [title, step]);

  const validateStep = (currentStep: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!title) nextErrors.title = "Job Title is required.";
      if (!department) nextErrors.department = "Department is required.";
      if (!hiringManager) nextErrors.hiringManager = "Hiring Manager is required.";
      if (!community) nextErrors.community = "Community selection is required.";
      if (!slug) nextErrors.slug = "URL Slug is required.";
    } else if (currentStep === 2) {
      if (!description) nextErrors.description = "Job Description is required.";
      if (responsibilities.filter((r) => r.trim()).length === 0) {
        nextErrors.responsibilities = "At least one responsibility is required.";
      }
      if (requirements.filter((r) => r.trim()).length === 0) {
        nextErrors.requirements = "At least one requirement is required.";
      }
    } else if (currentStep === 3) {
      if (!salaryRange) nextErrors.salaryRange = "Salary Range is required.";
      if (!expirationDate) nextErrors.expirationDate = "Expiration Date is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    const parsedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title || "Untitled Job Opening",
      department: department || "Engineering",
      hiringManager: hiringManager || "Sarah Jenkins",
      community: community || "Developer Communities",
      slug: slug || `untitled-job-${Date.now()}`,
      description: description || "No description provided yet.",
      responsibilities: responsibilities.filter((r) => r.trim()),
      requirements: requirements.filter((r) => r.trim()),
      benefits: benefits.filter((b) => b.trim()),
      skills: parsedSkills,
      tags: parsedTags,
      employmentType,
      workplaceType,
      salaryRange: salaryRange || "Not specified",
      openings,
      timeline,
      expirationDate: expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      visibility,
      isFeatured,
      isSponsored,
      status: "draft" as JobStatus,
    };

    createJobMutation.mutate(payload, {
      onSuccess: (newJob) => {
        localStorage.removeItem("commdesk-create-job-draft");
        alert(`Draft job opening '${newJob.title}' successfully saved to database!`);
        navigate("/org/jobs");
      },
      onError: (err) => {
        console.error("Failed to create draft job:", err);
        alert("Failed to save draft. Check details and retry.");
      },
    });
  };

  const handlePublish = () => {
    if (!validateStep(step)) return;

    const parsedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
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

    createJobMutation.mutate(payload, {
      onSuccess: (newJob) => {
        // Clear draft
        localStorage.removeItem("commdesk-create-job-draft");
        alert(`Job role '${newJob.title}' successfully added!`);
        navigate("/org/jobs");
      },
      onError: (err) => {
        console.error("Failed to create job:", err);
        alert("Failed to submit job opening. Check form values and retry.");
      },
    });
  };

  const handleArrayChange = (
    index: number,
    value: string,
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    stateSetter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddArrayItem = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    stateSetter((prev) => [...prev, ""]);
  };

  const handleRemoveArrayItem = (
    index: number,
    stateSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    stateSetter((prev) => {
      if (prev.length === 1) return [""];
      return prev.filter((_, idx) => idx !== index);
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20 relative" style={{ backgroundColor: theme.bg.page }}>
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: theme.text.primary }}>
            Create New Job Role
          </h1>
          <p className="text-xs" style={{ color: theme.text.muted }}>
            Post a career listing for your hiring pipelines.
          </p>
        </div>

        {autosaveMsg && (
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-1 rounded">
            {autosaveMsg}
          </span>
        )}
      </div>

      {/* Stepper visual */}
      <div className="px-6 py-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={{
                  backgroundColor: step >= s ? theme.primary.default : theme.bg.surfaceSecondary,
                  color: step >= s ? theme.text.inverse : theme.text.muted,
                  border: step === s ? `2px solid ${theme.primary.text}` : "none",
                }}
              >
                {s}
              </div>
              <span
                className="ml-2 text-xs font-bold hidden md:inline"
                style={{ color: step >= s ? theme.text.primary : theme.text.muted }}
              >
                {s === 1
                  ? "Basic Info"
                  : s === 2
                    ? "Job Description"
                    : s === 3
                      ? "Configuration"
                      : "Publishing"}
              </span>
              {s < 4 && (
                <div
                  className="flex-1 h-0.5 mx-4 hidden md:block"
                  style={{ backgroundColor: step > s ? theme.primary.default : theme.border.default }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div
          className="border rounded-xl p-6 shadow-sm"
          style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
        >
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-base font-bold" style={{ color: theme.text.primary }}>
                Step 1 &mdash; Job Metadata & Department
              </h3>
              <Input
                label="Job Title"
                name="title"
                value={title}
                onChange={(_, val) => setTitle(val)}
                placeholder="e.g. Senior Frontend Engineer"
                error={errors.title}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: errors.department ? theme.danger.default : theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select Department</option>
                    <option value="Product">Product</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                  </select>
                  {errors.department && (
                    <span className="text-xs" style={{ color: theme.danger.default }}>
                      {errors.department}
                    </span>
                  )}
                </div>

                <Input
                  label="Hiring Manager"
                  name="hiringManager"
                  value={hiringManager}
                  onChange={(_, val) => setHiringManager(val)}
                  placeholder="e.g. David Chen"
                  error={errors.hiringManager}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Community Selection *
                  </label>
                  <select
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: errors.community ? theme.danger.default : theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="">Select Community</option>
                    <option value="Global Design Excellence">Global Design Excellence</option>
                    <option value="Developer Communities">Developer Communities</option>
                    <option value="Tech Partnerships Group">Tech Partnerships Group</option>
                  </select>
                  {errors.community && (
                    <span className="text-xs" style={{ color: theme.danger.default }}>
                      {errors.community}
                    </span>
                  )}
                </div>

                <Input
                  label="URL Slug"
                  name="slug"
                  value={slug}
                  onChange={(_, val) => setSlug(val)}
                  placeholder="senior-frontend-engineer"
                  error={errors.slug}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: DESCRIPTION & LISTS */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-bold" style={{ color: theme.text.primary }}>
                Step 2 &mdash; Job Description & Requirements
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                  Job Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-36 border rounded-lg p-3 outline-none text-sm resize-none"
                  style={{
                    backgroundColor: theme.bg.surface,
                    borderColor: errors.description ? theme.danger.default : theme.border.default,
                    color: theme.text.primary,
                  }}
                  placeholder="Outline the responsibilities and scope of the role..."
                />
                {errors.description && (
                  <span className="text-xs" style={{ color: theme.danger.default }}>
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Responsibilities list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Key Responsibilities
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(setResponsibilities)}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <FiPlus /> Add Item
                  </button>
                </div>
                {errors.responsibilities && (
                  <span className="text-xs" style={{ color: theme.danger.default }}>
                    {errors.responsibilities}
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  {responsibilities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(idx, e.target.value, setResponsibilities)}
                        placeholder="e.g. Design complex layout workflows"
                        className="flex-1 p-2 border rounded-lg text-xs outline-none"
                        style={{
                          backgroundColor: theme.bg.surface,
                          borderColor: theme.border.default,
                          color: theme.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(idx, setResponsibilities)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                      >
                        <FiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Job Requirements
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(setRequirements)}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <FiPlus /> Add Item
                  </button>
                </div>
                {errors.requirements && (
                  <span className="text-xs" style={{ color: theme.danger.default }}>
                    {errors.requirements}
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  {requirements.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(idx, e.target.value, setRequirements)}
                        placeholder="e.g. 5+ years experience in Figma systems"
                        className="flex-1 p-2 border rounded-lg text-xs outline-none"
                        style={{
                          backgroundColor: theme.bg.surface,
                          borderColor: theme.border.default,
                          color: theme.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(idx, setRequirements)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                      >
                        <FiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Role Benefits / Perks
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(setBenefits)}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <FiPlus /> Add Item
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {benefits.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(idx, e.target.value, setBenefits)}
                        placeholder="e.g. 100% remote options"
                        className="flex-1 p-2 border rounded-lg text-xs outline-none"
                        style={{
                          backgroundColor: theme.bg.surface,
                          borderColor: theme.border.default,
                          color: theme.text.primary,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(idx, setBenefits)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                      >
                        <FiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagging */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Required Skills (comma separated)"
                  name="skills"
                  value={skills}
                  onChange={(_, val) => setSkills(val)}
                  placeholder="React, Figma, Go, CSS"
                />
                <Input
                  label="Search Tags (comma separated)"
                  name="tags"
                  value={tags}
                  onChange={(_, val) => setTags(val)}
                  placeholder="Remote, Senior, Product"
                />
              </div>
            </div>
          )}

          {/* STEP 3: CONFIGURATION */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-bold" style={{ color: theme.text.primary }}>
                Step 3 &mdash; Work Settings & Expirations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Workplace Type
                  </label>
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Annual Salary Range ($)"
                  name="salaryRange"
                  value={salaryRange}
                  onChange={(_, val) => setSalaryRange(val)}
                  placeholder="e.g. $140,000 - $180,000"
                  error={errors.salaryRange}
                  required
                />
                <Input
                  label="Number of Openings"
                  name="openings"
                  type="number"
                  value={openings}
                  onChange={(_, val) => setOpenings(Number(val))}
                  placeholder="1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hiring Timeline"
                  name="timeline"
                  value={timeline}
                  onChange={(_, val) => setTimeline(val)}
                  placeholder="e.g. Immediate, 2-4 Weeks"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Role Expiration Date *
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
                  {errors.expirationDate && (
                    <span className="text-xs" style={{ color: theme.danger.default }}>
                      {errors.expirationDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PUBLISHING */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h3 className="text-base font-bold" style={{ color: theme.text.primary }}>
                Step 4 &mdash; Visibility & Promotion Controls
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Portal Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as JobVisibility)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="public">Public (Career Portal & Listings)</option>
                    <option value="private">Private (Link-Only Access)</option>
                    <option value="community-only">Community-Only (Verified members only)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 p-4 rounded-xl border mt-2" style={{ backgroundColor: theme.bg.surfaceSecondary, borderColor: theme.border.default }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.secondary }}>Promotional Add-ons</span>

                  <label className="flex items-center gap-3 mt-1.5 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-gray-300 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span style={{ color: theme.text.primary }}>Pin as Featured Job</span>
                      <span className="text-[10px]" style={{ color: theme.text.muted }}>Featured roles stay at the top of the careers page grid.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 mt-3 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={isSponsored}
                      onChange={(e) => setIsSponsored(e.target.checked)}
                      className="rounded border-gray-300 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span style={{ color: theme.text.primary }}>Sponsored Distribution</span>
                      <span className="text-[10px]" style={{ color: theme.text.muted }}>Automatically syndicate to external partner boards (LinkedIn, Dribbble).</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                    Publishing Target State
                  </label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as JobStatus)}
                    className="p-2.5 border rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: theme.bg.surface,
                      borderColor: theme.border.default,
                      color: theme.text.primary,
                    }}
                  >
                    <option value="active">Publish immediately (Active)</option>
                    <option value="draft">Save as Draft role</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 py-3 px-6 border-t flex justify-between items-center shadow-lg"
        style={{
          borderColor: theme.border.default,
          backgroundColor: theme.bg.surface,
        }}
      >
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default, color: theme.text.primary }}
            >
              <FiChevronLeft /> Back
            </button>
          ) : (
            <button
              onClick={() => navigate("/org/jobs")}
              className="px-4 py-2 text-xs font-bold rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default, color: theme.text.primary }}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            style={{ borderColor: theme.border.default, color: theme.text.primary }}
          >
            <FiSave /> Save Draft
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5"
            >
              Next <FiChevronRight />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={createJobMutation.isPending}
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {createJobMutation.isPending ? "Submitting..." : "Publish Job Role"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;

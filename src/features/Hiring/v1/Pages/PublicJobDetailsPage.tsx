import React, { useState } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useJobDetail, useApplyToJob, useCompanyProfile } from "../Hooks/useHiring";
import Input from "@/Component/ui/Input";
import { FiArrowLeft, FiMapPin, FiDollarSign, FiClock } from "react-icons/fi";

const PublicJobDetailsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { slug, jobId } = useParams<{ slug: string; jobId: string }>();

  // Fetch data
  const { data: job, isLoading: jobLoading } = useJobDetail(jobId);
  const { data: profile } = useCompanyProfile();
  const applyMutation = useApplyToJob();

  // Apply Form State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="text-sm font-semibold animate-pulse" style={{ color: theme.text.secondary }}>
          Loading role requirements...
        </div>
      </div>
    );
  }

  if (!job || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 bg-zinc-50 dark:bg-zinc-950">
        <span className="text-sm font-bold" style={{ color: theme.text.primary }}>Career Opening Not Found</span>
        <button
          onClick={() => navigate(`/company/${slug}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          Return to Career Portal
        </button>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Full Name is required.";
    if (!email) nextErrors.email = "Email is required.";
    if (!experience) nextErrors.experience = "Professional experience details are required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !jobId) return;

    const parsedSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    applyMutation.mutate(
      {
        jobId,
        payload: {
          name,
          email,
          experience,
          skills: parsedSkills,
          resumeUrl: resumeUrl || "/resumes/submitted_resume.pdf",
        },
      },
      {
        onSuccess: () => {
          setAppliedSuccess(true);
          setName("");
          setEmail("");
          setExperience("");
          setSkills("");
          setResumeUrl("");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ backgroundColor: theme.bg.page }}>
      {/* Header */}
      <header
        className="px-6 py-4 border-b flex items-center justify-between sticky top-0 z-20"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/company/${slug}`)}>
          <img src="/logoWithoutText.png" alt="Logo" className="w-7 h-7" />
          <span className="font-bold text-sm" style={{ color: theme.text.primary }}>{profile.name} Careers</span>
        </div>

        <button
          onClick={() => navigate(`/company/${slug}`)}
          className="px-3.5 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          style={{ borderColor: theme.border.default, color: theme.text.primary }}
        >
          <FiArrowLeft /> Back to Openings
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Job Header Card */}
        <div
          className="border rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 shadow-sm"
          style={{ borderColor: theme.border.default }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: theme.text.primary }}>
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-zinc-500 font-semibold mt-1">
              <span className="flex items-center gap-1"><FiMapPin /> {job.workplaceType}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><FiClock /> {job.employmentType}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><FiDollarSign /> {job.salaryRange}</span>
            </div>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-6 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-bold shrink-0 shadow-md"
          >
            Apply to Position
          </button>
        </div>

        {/* Job Details Content */}
        <div
          className="border rounded-xl p-6 md:p-8 flex flex-col gap-6 bg-white dark:bg-zinc-900 shadow-sm"
          style={{ borderColor: theme.border.default }}
        >
          <div className="flex flex-col gap-2.5">
            <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>Role Context</h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.text.secondary }}>{job.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>Core Responsibilities</h3>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm" style={{ color: theme.text.secondary }}>
              {job.responsibilities.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>Requirements & Qualifications</h3>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-sm" style={{ color: theme.text.secondary }}>
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {job.benefits && job.benefits.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>Offer & Benefits</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2 text-sm" style={{ color: theme.text.secondary }}>
                {job.benefits.map((ben, idx) => (
                  <li key={idx}>{ben}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Application Form Modal Dialog */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl border rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: theme.border.default }}>
              <h3 className="text-base font-bold" style={{ color: theme.text.primary }}>Apply: {job.title}</h3>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setAppliedSuccess(false);
                }}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {appliedSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: theme.text.primary }}>Application Submitted!</h4>
                  <p className="text-xs max-w-sm" style={{ color: theme.text.secondary }}>
                    Thank you for applying. Our recruiting team will review your application details shortly.
                  </p>
                  <button
                    onClick={() => {
                      setShowApplyModal(false);
                      setAppliedSuccess(false);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    Close Dialog
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={name}
                    onChange={(_, val) => setName(val)}
                    placeholder="e.g. John Doe"
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(_, val) => setEmail(val)}
                    placeholder="e.g. john.doe@domain.com"
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Current Role & Years of Experience *"
                    name="experience"
                    value={experience}
                    onChange={(_, val) => setExperience(val)}
                    placeholder="e.g. Senior Designer, 6 Years"
                    error={errors.experience}
                    required
                  />

                  <Input
                    label="Relevant Skills (comma separated)"
                    name="skills"
                    value={skills}
                    onChange={(_, val) => setSkills(val)}
                    placeholder="e.g. Figma, Design Systems, HTML"
                  />

                  <Input
                    label="Resume PDF URL (simulated)"
                    name="resumeUrl"
                    value={resumeUrl}
                    onChange={(_, val) => setResumeUrl(val)}
                    placeholder="e.g. /resumes/johndoe_resume.pdf"
                  />

                  <div className="flex justify-end gap-2.5 mt-4 border-t pt-4" style={{ borderColor: theme.border.default }}>
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      style={{ borderColor: theme.border.default, color: theme.text.primary }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applyMutation.isPending}
                      className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-xs font-bold"
                    >
                      {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicJobDetailsPage;

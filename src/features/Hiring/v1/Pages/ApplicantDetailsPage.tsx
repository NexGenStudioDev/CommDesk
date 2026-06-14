import React, { useState } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicantDetail, useUpdateApplicantStatus, useAddRecruiterNote, useJobDetail } from "../Hooks/useHiring";
import { ApplicantStatus } from "../Types/Hiring.types";
import Button from "@/Component/ui/Button";
import { FiCalendar, FiMail, FiArrowLeft, FiPlus, FiChevronRight } from "react-icons/fi";
import { MdCheckCircle } from "react-icons/md";

const ApplicantDetailsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id: jobId, applicantId } = useParams<{ id: string; applicantId: string }>();

  // Fetch applicant
  const { data: applicant, isLoading } = useApplicantDetail(applicantId);
  const { data: job } = useJobDetail(jobId);
  const updateStatusMutation = useUpdateApplicantStatus();
  const addNoteMutation = useAddRecruiterNote();

  // Note composition state
  const [noteContent, setNoteContent] = useState("");
  const [noteRec, setNoteRec] = useState<"strong_hire" | "hire" | "neutral" | "no_hire">("hire");
  const [showNoteForm, setShowNoteForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-sm font-medium animate-pulse" style={{ color: theme.text.secondary }}>
          Loading candidate profile file...
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>Candidate file not found.</span>
        <Button text="Back to Applicants" onClick={() => navigate(`/org/jobs/${jobId}/applicants`)} />
      </div>
    );
  }

  const handleMoveStage = (status: ApplicantStatus) => {
    updateStatusMutation.mutate({ id: applicant.id, status, user: "Sarah Jenkins" });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addNoteMutation.mutate(
      {
        applicantId: applicant.id,
        note: {
          author: "Sarah Jenkins",
          content: noteContent,
          recommendation: noteRec,
          avatar: "/avatars/sarah.jpg",
        },
      },
      {
        onSuccess: () => {
          setNoteContent("");
          setShowNoteForm(false);
        },
      }
    );
  };

  const getNextStage = (status: ApplicantStatus): ApplicantStatus => {
    const sequence: ApplicantStatus[] = ["applied", "screening", "technical", "interview", "hr", "offer", "hired"];
    const idx = sequence.indexOf(status);
    if (idx !== -1 && idx < sequence.length - 1) return sequence[idx + 1];
    return status;
  };

  const nextStage = getNextStage(applicant.status);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/org/jobs/${jobId}/applicants`)}
              className="p-1.5 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default, color: theme.text.primary }}
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
                  {applicant.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-500/10">
                  {applicant.matchScore}% MATCH
                </span>
              </div>
              <span className="text-xs" style={{ color: theme.text.muted }}>
                Applied for {job?.title || "Position"} &bull; Applied {applicant.appliedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              text="Schedule Interview"
              variant="secondary"
              icon={<FiCalendar className="mr-1.5" />}
              onClick={() => alert("Redirecting to calendar integrations...")}
            />
            <Button
              text="Compose Mail"
              variant="secondary"
              icon={<FiMail className="mr-1.5" />}
              onClick={() => navigate(`/org/jobs/${jobId}/applicants/${applicant.id}/mail`)}
            />
            <Button
              text="Advance Candidate"
              icon={<FiChevronRight className="ml-1.5" />}
              onClick={() => handleMoveStage(nextStage)}
              disabled={applicant.status === "hired" || applicant.status === "rejected"}
            />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: CANDIDATE INFO & METRIC */}
          <div className="flex flex-col gap-6">
            {/* Profile Summary Card */}
            <div
              className="border rounded-xl p-5 shadow-sm flex flex-col items-center text-center gap-4 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xl text-blue-500">
                {applicant.name[0]}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-bold text-sm" style={{ color: theme.text.primary }}>{applicant.name}</h3>
                <span className="text-xs" style={{ color: theme.text.muted }}>San Francisco, CA</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 border-t pt-4 text-xs" style={{ borderColor: theme.border.default }}>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">Experience</span>
                  <span className="font-bold mt-0.5" style={{ color: theme.text.primary }}>{applicant.experience}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">Education</span>
                  <span className="font-bold mt-0.5 text-center" style={{ color: theme.text.primary }}>RISD BFA</span>
                </div>
              </div>
            </div>

            {/* Evaluation Score Card */}
            <div
              className="border rounded-xl p-5 shadow-sm flex items-center justify-between bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <div className="flex flex-col gap-3 flex-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Evaluation Matrix</h4>
                <div className="flex flex-col gap-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span style={{ color: theme.text.secondary }}>Technical Fit</span>
                    <span style={{ color: theme.text.primary }}>{applicant.rating.technical || "Pending"}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: theme.text.secondary }}>Culture Fit</span>
                    <span style={{ color: theme.text.primary }}>{applicant.rating.culture || "Pending"}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: theme.text.secondary }}>Communication</span>
                    <span style={{ color: theme.text.primary }}>{applicant.rating.communication || "Pending"}/10</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pl-6 border-l w-24 h-full" style={{ borderColor: theme.border.default }}>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Rating</span>
                <span className="text-3xl font-black text-blue-600 leading-none">{applicant.rating.rating}</span>
              </div>
            </div>

            {/* Skills & tags */}
            <div
              className="border rounded-xl p-5 shadow-sm flex flex-col gap-3 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Skills Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE: TIMELINES & NOTES */}
          <div className="flex flex-col gap-6">
            {/* Reviewer Feedback Panel */}
            <div
              className="border rounded-xl p-6 shadow-sm flex flex-col gap-5 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: theme.border.default }}>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                  Internal Reviewer Feedback
                </h4>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  <FiPlus /> Add Note
                </button>
              </div>

              {/* Note Submission Form */}
              {showNoteForm && (
                <form onSubmit={handleAddNote} className="p-4 border rounded-xl flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-900/30" style={{ borderColor: theme.border.default }}>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write recruiter feedback, notes on technical rounds..."
                    className="w-full h-20 p-2 border rounded-lg text-xs outline-none bg-white dark:bg-zinc-900"
                    style={{ borderColor: theme.border.default, color: theme.text.primary }}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.text.muted }}>Recommendation:</span>
                      <select
                        value={noteRec}
                        onChange={(e) => setNoteRec(e.target.value as any)}
                        className="p-1 border rounded text-[10px] outline-none bg-white dark:bg-zinc-900"
                        style={{ borderColor: theme.border.default, color: theme.text.primary }}
                      >
                        <option value="strong_hire">Strong Hire</option>
                        <option value="hire">Hire</option>
                        <option value="neutral">Neutral</option>
                        <option value="no_hire">No Hire</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNoteForm(false)}
                        className="px-2.5 py-1 text-[10px] font-bold border rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 text-[10px] font-bold rounded text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Notes List */}
              {applicant.notes.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: theme.text.muted }}>
                  No internal feedback logged yet.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {applicant.notes.map((note) => (
                    <div key={note.id} className="flex flex-col gap-2 p-4 border rounded-xl" style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                            {note.author[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold" style={{ color: theme.text.primary }}>{note.author}</span>
                            <span className="text-[9px]" style={{ color: theme.text.muted }}>{note.date}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            note.recommendation === "strong_hire"
                              ? "bg-green-500/10 text-green-500"
                              : note.recommendation === "hire"
                                ? "bg-blue-500/10 text-blue-500"
                                : note.recommendation === "neutral"
                                  ? "bg-zinc-200 text-zinc-600"
                                  : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {note.recommendation.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: theme.text.secondary }}>
                        "{note.content}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Candidate Experience timeline */}
            <div
              className="border rounded-xl p-6 shadow-sm flex flex-col gap-5 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                Recent Professional Experience
              </h4>

              <div className="relative border-l pl-4 flex flex-col gap-5" style={{ borderColor: theme.border.default }}>
                <div className="relative text-xs flex flex-col gap-0.5">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
                  <span className="font-bold" style={{ color: theme.text.primary }}>Senior Product Designer</span>
                  <span className="text-[10px]" style={{ color: theme.text.muted }}>Meta &bull; Jan 2021 &mdash; Present</span>
                  <p className="mt-1 leading-relaxed" style={{ color: theme.text.secondary }}>
                    Led the design of the Ads Manager dashboard, increasing user efficiency by 22% across enterprise platforms.
                  </p>
                </div>

                <div className="relative text-xs flex flex-col gap-0.5">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-300 border border-white" />
                  <span className="font-bold" style={{ color: theme.text.primary }}>Product Designer</span>
                  <span className="text-[10px]" style={{ color: theme.text.muted }}>Stripe &bull; May 2018 &mdash; Dec 2020</span>
                  <p className="mt-1 leading-relaxed" style={{ color: theme.text.secondary }}>
                    Redesigned checkout flows, reducing drop-off rates by 15%. Integrated crypto payment visualizations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PIPELINE PROGRESS & CONTROLS */}
          <div className="flex flex-col gap-6">
            {/* Pipeline Stage board */}
            <div
              className="border rounded-xl p-6 shadow-sm flex flex-col gap-5 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider border-b pb-2" style={{ color: theme.text.primary, borderColor: theme.border.default }}>
                Pipeline Progress
              </h4>

              {/* Stages List */}
              <div className="flex flex-col gap-4">
                {(["applied", "screening", "technical", "interview", "hr", "offer", "hired"] as ApplicantStatus[]).map((stage, idx) => {
                  const sequence = ["applied", "screening", "technical", "interview", "hr", "offer", "hired"];
                  const currentIdx = sequence.indexOf(applicant.status);
                  const isCompleted = currentIdx >= idx;
                  const isCurrent = applicant.status === stage;

                  return (
                    <div
                      key={stage}
                      onClick={() => handleMoveStage(stage)}
                      className={`flex items-center gap-3 text-xs font-semibold cursor-pointer p-1.5 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                        isCurrent ? "text-blue-600 bg-blue-500/5 font-bold" : ""
                      }`}
                    >
                      {isCompleted ? (
                        <MdCheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </div>
                      )}
                      <span className="capitalize" style={{ color: isCurrent ? theme.primary.default : theme.text.primary }}>
                        {stage === "hr" ? "HR Round" : stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action center */}
            <div
              className="border rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-white dark:bg-zinc-900"
              style={{ borderColor: theme.border.default }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.text.primary }}>
                Action Center
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleMoveStage(nextStage)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Accept for Next Stage
                </button>
                <button
                  onClick={() => handleMoveStage("rejected")}
                  className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500/5 rounded-lg text-xs font-bold transition-colors"
                >
                  Reject Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage;

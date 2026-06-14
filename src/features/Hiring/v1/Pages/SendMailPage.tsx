import React, { useState } from "react";
import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicantDetail, useSendMail, useMailLogs, useJobDetail } from "../Hooks/useHiring";
import Button from "@/Component/ui/Button";
import Input from "@/Component/ui/Input";
import { FiArrowLeft, FiMail, FiSend, FiClock, FiFileText } from "react-icons/fi";

const templates = [
  {
    name: "Interview Invite",
    subject: "Interview Schedule: [Position] at NexGen Studios",
    body: "Hi [CandidateName],\n\nWe would love to schedule a technical screening with you to discuss your experience and walk through some of your design architectures. Let us know your availability over the next few days.\n\nBest,\nSarah Jenkins\nLead Technical Recruiter\nNexGen Studios",
  },
  {
    name: "Offer Letter",
    subject: "Official Job Offer: [Position] at NexGen Studios",
    body: "Hi [CandidateName],\n\nWe are absolutely thrilled to offer you the position of [Position] at NexGen Studios! We were incredibly impressed by your systems thinking during our technical and design evaluations. Details regarding salary, equity, and benefits are attached in your official offer packet.\n\nBest,\nDavid Chen\nVP of Product\nNexGen Studios",
  },
  {
    name: "Rejection Mail",
    subject: "Hiring Update: [Position] at NexGen Studios",
    body: "Hi [CandidateName],\n\nThank you so much for taking the time to discuss the [Position] opening with us. While your experience is impressive, we have decided to proceed with other candidates whose profiles align more closely with our current requirements.\n\nWe wish you all the best in your search and hope to stay in touch.\n\nBest,\nSarah Jenkins\nLead Technical Recruiter\nNexGen Studios",
  },
  {
    name: "Follow-up Mail",
    subject: "Checking In: [Position] Application Update",
    body: "Hi [CandidateName],\n\nI wanted to check in and let you know that our team is still evaluating profiles for the [Position] role. We expect to have a decision on the next steps soon. Thank you for your patience!\n\nBest,\nSarah Jenkins\nNexGen Studios",
  },
];

const SendMailPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id: jobId, applicantId } = useParams<{ id: string; applicantId: string }>();

  // Fetch candidate, job, & logs
  const { data: applicant } = useApplicantDetail(applicantId);
  const { data: applicant } = useApplicantDetail(applicantId);
  const { data: job } = useJobDetail(jobId);
  const { data: mailLogs = [] } = useMailLogs(applicantId);
  const sendMailMutation = useSendMail();

  // Composer fields
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSelectTemplate = (temp: typeof templates[0]) => {
    if (!applicant) return;
    const positionTitle = job?.title || "Position";
    const resolvedSubject = temp.subject
      .replaceAll("[Position]", positionTitle)
      .replaceAll("[CandidateName]", applicant.name);
    const resolvedBody = temp.body
      .replaceAll("[Position]", positionTitle)
      .replaceAll("[CandidateName]", applicant.name);

    setSubject(resolvedSubject);
    setBody(resolvedBody);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || !applicantId) return;

    sendMailMutation.mutate(
      {
        applicantId,
        mail: {
          subject,
          body,
          sender: "Sarah Jenkins",
          status: scheduled ? "scheduled" : "sent",
          scheduledFor: scheduled ? scheduledDate : undefined,
        },
      },
      {
        onSuccess: () => {
          alert(scheduled ? "Email scheduled successfully!" : "Email sent successfully!");
          navigate(`/org/jobs/${jobId}/applicants/${applicantId}`);
        },
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Email Composer Form */}
        <form onSubmit={handleSend} className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => navigate(`/org/jobs/${jobId}/applicants/${applicantId}`)}
              className="p-1.5 rounded-lg border hover:bg-zinc-100 dark:hover:bg-zinc-800"
              style={{ borderColor: theme.border.default, color: theme.text.primary }}
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
                Compose Email
              </h1>
              <span className="text-xs" style={{ color: theme.text.muted }}>
                To: {applicant?.name} &bull; {applicant?.email}
              </span>
            </div>
          </div>

          <div
            className="border rounded-xl p-6 flex flex-col gap-5 shadow-sm"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <Input
              label="Subject Line"
              name="subject"
              value={subject}
              onChange={(_, val) => setSubject(val)}
              placeholder="e.g. Interview Schedule details..."
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.secondary }}>
                Email Body Text
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-64 border rounded-lg p-3 outline-none text-sm resize-none"
                style={{
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.default,
                  color: theme.text.primary,
                }}
                placeholder="Write your email contents..."
                required
              />
            </div>

            {/* Scheduled widget */}
            <div className="border-t pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: theme.border.default }}>
              <label className="flex items-center gap-3 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduled}
                  onChange={(e) => setScheduled(e.target.checked)}
                  className="rounded border-gray-300 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span style={{ color: theme.text.primary }}>Schedule Send Later</span>
                  <span className="text-[10px]" style={{ color: theme.text.muted }}>Specify a future date to release the message automatically.</span>
                </div>
              </label>

              {scheduled && (
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="p-1.5 border rounded-lg text-xs outline-none"
                    style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default, color: theme.text.primary }}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 items-center">
            <Button
              text="Cancel"
              variant="secondary"
              onClick={() => navigate(`/org/jobs/${jobId}/applicants/${applicantId}`)}
            />
            <Button
              text={sendMailMutation.isPending ? "Sending..." : scheduled ? "Schedule Message" : "Send Email"}
              onClick={() => {}}
              type="submit"
              disabled={sendMailMutation.isPending}
              icon={scheduled ? <FiClock className="mr-1.5" /> : <FiSend className="mr-1.5" />}
            />
          </div>
        </form>

        {/* Sidebar Templates & Sent History */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Templates Selector */}
          <div
            className="border rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-white dark:bg-zinc-900"
            style={{ borderColor: theme.border.default }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.text.primary }}>
              <FiFileText className="text-zinc-400" /> Templates
            </h3>

            <div className="flex flex-col gap-2">
              {templates.map((temp) => (
                <button
                  key={temp.name}
                  type="button"
                  onClick={() => handleSelectTemplate(temp)}
                  className="w-full p-2.5 rounded-lg border text-left text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  style={{ borderColor: theme.border.default, color: theme.text.primary }}
                >
                  {temp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mail Log History */}
          <div
            className="border rounded-xl p-5 shadow-sm flex flex-col gap-4 bg-white dark:bg-zinc-900"
            style={{ borderColor: theme.border.default }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.text.primary }}>
              <FiMail className="text-zinc-400" /> Email History
            </h3>

            {mailLogs.length === 0 ? (
              <p className="text-[10px]" style={{ color: theme.text.muted }}>No emails sent to this applicant yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {mailLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg flex flex-col gap-1 text-[11px]" style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}>
                    <div className="flex justify-between items-center font-bold">
                      <span className="truncate max-w-[150px]" style={{ color: theme.text.primary }}>{log.subject}</span>
                      <span className="text-[9px] uppercase tracking-wide text-zinc-400">{log.status}</span>
                    </div>
                    <span className="text-[9px]" style={{ color: theme.text.muted }}>{new Date(log.sentAt).toLocaleString()} &bull; {log.sender}</span>
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

export default SendMailPage;

import DropDown from "@/Component/ui/DropDown";
import Input from "@/Component/ui/Input";
import { Contact_Permissions, usePermissionMap } from "@/permissions";
import { FormEvent, useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { CONTACT_AND_SUPPORT_CONSTANT } from "../constants/ContactAndSupport.constant";

type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

type FormErrors = {
  subject?: string;
  issueDetails?: string;
};

const PRIORITY_OPTIONS: PriorityLevel[] = ["Low", "Medium", "High", "Critical"];

const priorityColor: Record<PriorityLevel, string> = {
  Low: "var(--cd-success)",
  Medium: "var(--cd-warning)",
  High: "var(--cd-danger)",
  Critical: "var(--cd-secondary)",
};

const Support = () => {
  const { canSubmitTicket } = usePermissionMap({
    canSubmitTicket: Contact_Permissions.SUBMIT_SUPPORT_TICKET,
  });
  const initialCategory = CONTACT_AND_SUPPORT_CONSTANT[0] ?? "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [subject, setSubject] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [ticketReference, setTicketReference] = useState<string>("");

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!subject.trim()) nextErrors.subject = "Issue subject is required.";
    else if (subject.trim().length < 6) nextErrors.subject = "Use at least 6 characters.";
    if (!issueDetails.trim()) nextErrors.issueDetails = "Issue details are required.";
    else if (issueDetails.trim().length < 20)
      nextErrors.issueDetails = "Add more details so support can reproduce the issue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setSubject("");
    setIssueDetails("");
    setErrors({});
  };

  const clearAll = () => {
    resetForm();
    setSelectedCategory(initialCategory);
    setPriority("Medium");
    setTicketReference("");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitTicket) return;
    if (!validateForm()) {
      setTicketReference("");
      return;
    }
    setTicketReference(`SUP-${Date.now().toString().slice(-6)}`);
    resetForm();
  };

  return (
    <div
      className="h-full w-full rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <div className="flex flex-col p-5 gap-2 border-b" style={{ borderColor: "var(--cd-border)" }}>
        <span className="flex items-center gap-2">
          <MdOutlineSupportAgent className="text-3xl" style={{ color: "var(--cd-primary)" }} />
          <h1
            className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold"
            style={{ color: "var(--cd-text)" }}
          >
            Admin Support
          </h1>
        </span>
        <p className="text-sm" style={{ color: "var(--cd-text-2)" }}>
          Submit Technical Issues, Report Bugs, or Operational Queries.
        </p>
      </div>

      <form
        className="flex w-full h-full min-h-0 flex-col p-4 md:p-5 gap-4 overflow-y-auto"
        onSubmit={onSubmit}
      >
        <DropDown
          className="w-full"
          label="Issue Category"
          options={CONTACT_AND_SUPPORT_CONSTANT}
          value={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--cd-text-2)" }}
          >
            Priority Level
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORITY_OPTIONS.map((option) => {
              const isSelected = option === priority;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPriority(option)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold transition-all"
                  style={{
                    border: `1px solid ${isSelected ? priorityColor[option] : "var(--cd-border)"}`,
                    backgroundColor: isSelected
                      ? "var(--cd-primary-subtle)"
                      : "var(--cd-surface-2)",
                    color: isSelected ? priorityColor[option] : "var(--cd-text-2)",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Issue Subject"
          name="Issue Subject"
          value={subject}
          onChange={(_, value) => setSubject(value)}
          placeholder="Example: Login keeps failing after OTP verification"
          className="w-full"
          error={errors.subject}
        />

        <div className="flex flex-col gap-1.5 -mt-2">
          <label
            htmlFor="issue-details"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--cd-text-2)" }}
          >
            Issue Details
          </label>
          <textarea
            id="issue-details"
            name="issue-details"
            value={issueDetails}
            onChange={(e) => setIssueDetails(e.target.value)}
            placeholder="Share exact steps, affected section, and what result you expected."
            rows={5}
            className="w-full rounded-lg px-3 py-2 text-sm resize-y outline-none transition-all"
            style={{
              border: `1px solid ${errors.issueDetails ? "var(--cd-danger)" : "var(--cd-border)"}`,
              backgroundColor: "var(--cd-surface)",
              color: "var(--cd-text)",
            }}
          />
          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "var(--cd-text-muted)" }}
          >
            <span>Minimum 20 characters recommended.</span>
            <span>{issueDetails.length}/1000</span>
          </div>
          {errors.issueDetails && (
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--cd-danger)" }}>
              <FiAlertCircle /> {errors.issueDetails}
            </p>
          )}
        </div>

        {ticketReference && (
          <div
            className="rounded-lg px-3 py-2 text-sm flex items-center gap-2"
            style={{
              backgroundColor: "var(--cd-success-subtle)",
              color: "var(--cd-success)",
              border: "1px solid var(--cd-border-subtle)",
            }}
          >
            <FiCheckCircle />
            Ticket submitted. Reference: <strong>{ticketReference}</strong>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {canSubmitTicket && (
            <button type="submit" className="cd-btn cd-btn-primary">
              Submit Ticket
            </button>
          )}
          <button
            type="button"
            onClick={canSubmitTicket ? clearAll : undefined}
            className="cd-btn cd-btn-secondary"
            disabled={!canSubmitTicket}
          >
            {canSubmitTicket ? "Clear Form" : "View Only"}
          </button>
        </div>

        <div
          className="rounded-lg p-3 text-sm"
          style={{
            border: "1px solid var(--cd-border)",
            backgroundColor: "var(--cd-surface-2)",
          }}
        >
          <p className="font-semibold" style={{ color: "var(--cd-text)" }}>
            What happens next?
          </p>
          <p className="mt-1" style={{ color: "var(--cd-text-2)" }}>
            Critical issues are triaged first. Include reproducible steps and screenshots to reduce
            turnaround time.
          </p>
        </div>
        {!canSubmitTicket && (
          <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
            Ticket submission is hidden until support-request permission is granted.
          </p>
        )}
      </form>
    </div>
  );
};

export default Support;

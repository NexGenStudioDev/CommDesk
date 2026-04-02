import DropDown from "@/Component/ui/DropDown";
import Input from "@/Component/ui/Input";
import { getTheme } from "@/config/them.config";
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

const Support = () => {
  const theme = getTheme("light");
  const initialCategory = CONTACT_AND_SUPPORT_CONSTANT[0] ?? "";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [subject, setSubject] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [ticketReference, setTicketReference] = useState<string>("");

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!subject.trim()) {
      nextErrors.subject = "Issue subject is required.";
    } else if (subject.trim().length < 6) {
      nextErrors.subject = "Use at least 6 characters for a clear subject.";
    }

    if (!issueDetails.trim()) {
      nextErrors.issueDetails = "Issue details are required.";
    } else if (issueDetails.trim().length < 20) {
      nextErrors.issueDetails = "Add a few more details so support can reproduce the issue.";
    }

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

    if (!validateForm()) {
      setTicketReference("");
      return;
    }

    const reference = `SUP-${Date.now().toString().slice(-6)}`;
    setTicketReference(reference);
    resetForm();
  };

  return (
    <div
      className="h-full w-full rounded-xl border-2 overflow-hidden"
      style={{ background: theme.background.primary, borderColor: theme.borderColor.primary }}
    >
      <div
        className="flex flex-col p-5 gap-2 border-b-2"
        style={{ borderColor: theme.borderColor.primary }}
      >
        <span className="flex items-center">
          <MdOutlineSupportAgent
            className="inline text-3xl"
            style={{ color: theme.textColor.tersiary }}
          />
          <h1
            className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-2"
            style={{ color: theme.textColor.primary }}
          >
            ADMIN SUPPORT
          </h1>
        </span>

        <p className="text-sm md:text-base" style={{ color: theme.textColor.secondary }}>
          Submit Technical Issues, Report Bugs, or Operational Queries.
        </p>
      </div>

      <form
        className="flex w-full h-full min-h-0 flex-col p-4 md:p-5 gap-4 overflow-y-auto"
        onSubmit={onSubmit}
      >
        <DropDown
          className="w-full"
          label="ISSUE CATEGORY"
          options={CONTACT_AND_SUPPORT_CONSTANT}
          value={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex flex-col gap-2">
          <p
            className="text-sm uppercase font-semibold tracking-wide"
            style={{ color: theme.textColor.secondary, fontFamily: theme.fontFamily.primary }}
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
                  className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
                  style={{
                    borderColor: isSelected ? theme.textColor.tersiary : theme.borderColor.primary,
                    background: isSelected ? theme.background.tertiary : theme.background.primary,
                    color: isSelected ? theme.textColor.tersiary : theme.textColor.secondary,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="ISSUE SUBJECT"
          name="Issue Subject"
          value={subject}
          onChange={(_, value) => setSubject(value)}
          placeholder="Example: Login keeps failing after OTP verification"
          className="w-full"
          error={errors.subject}
        />

        <div className="flex flex-col gap-2 -mt-2">
          <label
            htmlFor="issue-details"
            className="text-sm uppercase font-semibold tracking-wide"
            style={{ color: theme.textColor.secondary, fontFamily: theme.fontFamily.primary }}
          >
            Issue Details
          </label>

          <textarea
            id="issue-details"
            name="issue-details"
            value={issueDetails}
            onChange={(event) => setIssueDetails(event.target.value)}
            placeholder="Share exact steps, affected section, and what result you expected."
            rows={5}
            className="w-full border-2 rounded-lg px-3 py-2 text-sm md:text-base resize-y outline-none"
            style={{
              borderColor: errors.issueDetails ? theme.textColor.error : theme.borderColor.primary,
              background: theme.background.primary,
              color: theme.textColor.primary,
            }}
          />

          <div
            className="flex items-center justify-between text-xs"
            style={{ color: theme.textColor.muted }}
          >
            <span>Minimum 20 characters recommended.</span>
            <span>{issueDetails.length}/1000</span>
          </div>

          {errors.issueDetails && (
            <p className="text-sm flex items-center gap-1" style={{ color: theme.textColor.error }}>
              <FiAlertCircle />
              {errors.issueDetails}
            </p>
          )}
        </div>

        {ticketReference && (
          <div
            className="rounded-lg border px-3 py-2 text-sm flex items-center gap-2"
            style={{
              background: theme.alert.success.background,
              color: theme.alert.success.text,
              borderColor: theme.alert.success.border,
            }}
          >
            <FiCheckCircle />
            Ticket submitted successfully. Reference: <strong>{ticketReference}</strong>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: theme.textColor.tersiary, color: "#ffffff" }}
          >
            Submit Ticket
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="px-4 py-2 rounded-lg text-sm font-semibold border"
            style={{ borderColor: theme.borderColor.primary, color: theme.textColor.secondary }}
          >
            Clear Form
          </button>
        </div>

        <div
          className="rounded-lg border p-3 text-sm"
          style={{ borderColor: theme.borderColor.primary, background: theme.background.secondary }}
        >
          <p className="font-semibold" style={{ color: theme.textColor.primary }}>
            What happens next?
          </p>
          <p className="mt-1" style={{ color: theme.textColor.secondary }}>
            Critical issues are triaged first. Include reproducible steps and screenshots to reduce
            turnaround time.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Support;

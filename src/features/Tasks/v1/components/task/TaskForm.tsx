import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown, Calendar, Star, Loader2,
  AlertCircle, Github, FileUp, Layers, Users, Link, X, Check
} from "lucide-react";
import Avatar from "../common/Avatar";
import TechBadge from "../common/TechBadge";
import { useEvents } from "../../hooks/useEvents";
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";
import { mockMembers } from "../../mock/taskMockData";
import { TECH_OPTIONS } from "../../constants/tech.constants";
import type { Task, TaskPriority, SubmissionType, TechTag, CreateTaskPayload, EventOption } from "../../Task.types";

interface Props { mode: "create" | "edit"; task?: Task; }

interface Errors {
  eventId?: string; title?: string; description?: string;
  assignedTo?: string; deadline?: string; points?: string;
}

function validate(form: Partial<CreateTaskPayload>): Errors {
  const e: Errors = {};
  if (!form.eventId) e.eventId = "Please select an event.";
  if (!form.title?.trim()) e.title = "Task title is required.";
  else if (form.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (!form.description?.trim()) e.description = "Description is required.";
  if (!form.assignedTo?.length) e.assignedTo = "Assign to at least one member.";
  if (!form.deadline) e.deadline = "Deadline is required.";
  if (form.points !== undefined && form.points < 0) e.points = "Points must be ≥ 0.";
  return e;
}

function Field({ label, required, error, children, hint }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2 group/field">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within/field:text-[var(--cd-primary)]" style={{ color: "var(--cd-text-muted)" }}>
          {label} {required && <span className="text-[var(--cd-danger)] ml-0.5">*</span>}
        </label>
      </div>
      <div className="relative">{children}</div>
      {hint && !error && <p className="text-[11px] font-medium opacity-60 px-1" style={{ color: "var(--cd-text-muted)" }}>{hint}</p>}
      {error && <p className="flex items-center gap-1.5 text-[11px] font-bold px-1 mt-0.5" style={{ color: "var(--cd-danger)" }}><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-[var(--cd-surface)] p-5 transition-colors sm:p-6" style={{ borderColor: "var(--cd-border-subtle)" }}>
      <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--cd-border-subtle)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cd-primary-subtle)] text-[var(--cd-primary)]">
          <Icon size={17} />
        </div>
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--cd-text)" }}>{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5">{children}</div>
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full rounded-lg border bg-[var(--cd-surface)] px-3.5 py-2.5 text-sm text-[var(--cd-text)] outline-none transition-colors placeholder:text-[var(--cd-text-muted)]
    ${error ? "border-[var(--cd-danger)] ring-2 ring-[var(--cd-danger-subtle)]" : "border-[var(--cd-border)] focus:border-[var(--cd-primary)] focus:ring-2 focus:ring-[var(--cd-primary-subtle)]"}`;
}

// ─── Tech tag picker ──────────────────────────────────────────────────────────
function TechPicker({ selected, onChange }: { selected: TechTag[]; onChange: (tags: TechTag[]) => void }) {
  const [search, setSearch] = useState("");
  const selectedIds = new Set(selected.map((t) => t.id));

  const toggle = (tech: TechTag) => {
    if (selectedIds.has(tech.id)) onChange(selected.filter((t) => t.id !== tech.id));
    else {
      onChange([...selected, tech]);
      setSearch(""); // Clear search after selection
    }
  };

  const filtered = search.trim() === ""
    ? []
    : TECH_OPTIONS.filter((t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) && !selectedIds.has(t.id)
    );

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to add technologies (e.g. React, Python)..."
          className="w-full rounded-lg border border-[var(--cd-border)] bg-[var(--cd-surface)] px-4 py-2.5 text-sm text-[var(--cd-text)] outline-none transition-colors placeholder:text-[var(--cd-text-muted)] focus:border-[var(--cd-primary)] focus:ring-2 focus:ring-[var(--cd-primary-subtle)]"
        />

        {/* Suggestions Overlay */}
        {filtered.length > 0 && (
          <div
            className="absolute z-10 top-full left-0 right-0 mt-1.5 p-2 rounded-xl border shadow-xl flex flex-wrap gap-1.5 max-h-40 overflow-y-auto"
            style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
          >
            {filtered.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggle(tech)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--cd-hover)]"
                style={{
                  backgroundColor: "var(--cd-surface-2)",
                  color: "var(--cd-text-2)",
                  borderColor: "var(--cd-border)",
                }}
              >
                <span className="text-[10px] opacity-50">+</span>
                {tech.label}
              </button>
            ))}
          </div>
        )}

        {search.trim() !== "" && filtered.length === 0 && (
          <div
            className="absolute z-10 top-full left-0 right-0 mt-1.5 p-3 rounded-xl border shadow-lg text-xs"
            style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)", color: "var(--cd-text-muted)" }}
          >
            No matching technologies found for "{search}"
          </div>
        )}
      </div>

      {/* Selected tags (Visible below input) */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selected.map((tech) => (
            <span
              key={tech.id}
              className="group/tag inline-flex items-center gap-1 transition-colors"
            >
              <TechBadge tech={tech} />
              <button
                type="button"
                onClick={() => toggle(tech)}
                className="cd-btn-icon -ml-1 h-5 w-5 rounded-full bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)] hover:bg-[var(--cd-danger-subtle)] hover:text-[var(--cd-danger)] flex items-center justify-center transition-colors"
                title={`Remove ${tech.label}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EventPicker({ value, onChange, events, error }: { value: string; onChange: (id: string) => void; events: EventOption[]; error?: string }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedEvent = events.find(e => e.id === value);

  const filtered = events.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.status.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-[var(--cd-surface)] px-4 py-2.5 transition-colors ${error ? "border-[var(--cd-danger)] ring-2 ring-[var(--cd-danger-subtle)]" : "border-[var(--cd-border)] hover:border-[var(--cd-primary)]"}`}
      >
        <div className="flex-1 min-w-0">
          {selectedEvent ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold truncate" style={{ color: "var(--cd-text)" }}>{selectedEvent.name}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)]">{selectedEvent.status}</span>
            </div>
          ) : (
            <span className="text-sm text-[var(--cd-text-muted)]">Select an event…</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-[var(--cd-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div
          className="absolute z-30 top-full left-0 right-0 mt-1.5 p-2 rounded-xl border shadow-2xl flex flex-col gap-1 max-h-72 overflow-hidden"
          style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
        >
          <div className="relative mb-1">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full text-xs border rounded-lg px-3 py-2 outline-none bg-[var(--cd-surface-2)] text-[var(--cd-text)] border-[var(--cd-border)] focus:border-[var(--cd-primary)]"
            />
          </div>

          <div className="overflow-y-auto flex flex-col gap-0.5">
            {filtered.map((evt) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => { onChange(evt.id); setOpen(false); setSearch(""); }}
                className={`w-full flex flex-col gap-0.5 p-2.5 rounded-lg text-left transition-colors ${evt.id === value ? "bg-[var(--cd-primary-subtle)]" : "hover:bg-[var(--cd-hover)]"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold truncate" style={{ color: evt.id === value ? "var(--cd-primary-text)" : "var(--cd-text)" }}>{evt.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${evt.id === value ? "bg-[var(--cd-primary)] text-white" : "bg-[var(--cd-surface-3)] text-[var(--cd-text-muted)]"}`}>{evt.status}</span>
                </div>
                <p className="text-[10px] truncate" style={{ color: evt.id === value ? "var(--cd-primary-text)" : "var(--cd-text-muted)", opacity: 0.8 }}>{evt.subtitle}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "var(--cd-text-muted)" }}>No events found for "{search}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberPicker({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else {
      onChange([...selected, id]);
      setSearch("");
    }
  };

  const filtered = mockMembers.filter(m =>
  (m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[var(--cd-border)] bg-[var(--cd-surface)] px-4 py-2.5 transition-colors hover:border-[var(--cd-primary)]"
      >
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {selected.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              {selected.slice(0, 3).map((id) => {
                const m = mockMembers.find(x => x.id === id);
                return (
                  <div key={id} className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--cd-surface)]">
                    <Avatar name={m?.name || ""} src={m?.avatar ?? ""} size="xs" showTooltip={false} />
                  </div>
                );
              })}
            </div>
          ) : (
            <Users size={16} className="text-[var(--cd-text-muted)]" />
          )}
          <span className="text-sm font-bold truncate" style={{ color: selected.length > 0 ? "var(--cd-text)" : "var(--cd-text-muted)" }}>
            {selected.length > 0
              ? `${selected.length} member${selected.length !== 1 ? "s" : ""} assigned`
              : "Select members..."}
          </span>
        </div>
        <ChevronDown size={16} className={`text-[var(--cd-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-30 top-full left-0 right-0 mt-1.5 p-2 rounded-xl border shadow-2xl flex flex-col gap-1 max-h-80 overflow-hidden"
          style={{ backgroundColor: "var(--cd-surface)", borderColor: "var(--cd-border)" }}
        >
          {/* Search inside */}
          <div className="relative mb-1">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full text-xs border rounded-lg px-3 py-2 outline-none bg-[var(--cd-surface-2)] text-[var(--cd-text)] border-[var(--cd-border)] focus:border-[var(--cd-primary)]"
            />
          </div>

          <div className="overflow-y-auto flex flex-col gap-0.5 pr-1">
            {filtered.map((m) => {
              const isSel = selected.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${isSel ? "bg-[var(--cd-primary-subtle)]" : "hover:bg-[var(--cd-hover)]"}`}
                >
                  <Avatar name={m.name} src={m.avatar} size="sm" showTooltip={false} />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: isSel ? "var(--cd-primary-text)" : "var(--cd-text)" }}>{m.name}</p>
                    <p className="text-[10px] truncate" style={{ color: isSel ? "var(--cd-primary-text)" : "var(--cd-text-muted)", opacity: 0.8 }}>{m.role}</p>
                  </div>
                  {isSel ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--cd-primary)] text-white shadow-sm">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[var(--cd-border)] flex items-center justify-center text-[var(--cd-text-muted)]">
                      <span className="text-[10px]">+</span>
                    </div>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "var(--cd-text-muted)" }}>No members found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function TaskForm({ mode, task }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: events = [] } = useEvents();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deadlineInputRef = useRef<HTMLInputElement>(null);

  const [eventId, setEventId] = useState(task?.eventId ?? params.get("eventId") ?? "");
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assignedTo, setAssignedTo] = useState<string[]>(task?.assignedTo.map((m) => m.id) ?? []);
  const [deadline, setDeadline] = useState(task?.deadline.slice(0, 16) ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [submissionType, setSubmissionType] = useState<SubmissionType>(task?.submissionType ?? "github");
  const [isMandatory, setIsMandatory] = useState(task?.isMandatory ?? false);
  const [points, setPoints] = useState<number | "">(task?.points ?? "");
  const [allowLate, setAllowLate] = useState(task?.allowLateSubmission ?? false);
  const [maxSubs, setMaxSubs] = useState<number | "">(task?.maxSubmissions ?? "");
  const [technologies, setTechnologies] = useState<TechTag[]>(task?.technologies ?? []);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;
    const timer = setTimeout(() => {
      setErrors(validate({ eventId, title, description, assignedTo, deadline, points: points === "" ? undefined : Number(points) }));
    }, 0);
    return () => clearTimeout(timer);
  }, [touched, eventId, title, description, assignedTo, deadline, points]);

  const handleSubmit = async () => {
    setTouched(true);
    const payload: CreateTaskPayload = {
      eventId, title, description, assignedTo, deadline, priority, submissionType,
      isMandatory, points: points === "" ? undefined : Number(points),
      allowLateSubmission: allowLate, maxSubmissions: maxSubs === "" ? undefined : Number(maxSubs),
      technologies,
    };
    const errs = validate(payload);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (mode === "create") {
        await createTask.mutateAsync(payload);
        navigate(`/org/tasks?eventId=${eventId}&created=1`);
      } else if (task) {
        await updateTask.mutateAsync({ id: task.id, payload });
        navigate(`/org/tasks?eventId=${task.eventId}&updated=1`);
      }
    } catch {
      setErrors({ title: "Server error. Please try again." });
    }
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  const openDeadlinePicker = () => {
    const input = deadlineInputRef.current;
    if (!input) return;

    input.focus();
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  };

  const PRIORITY_OPTIONS: { value: TaskPriority; label: string; dot: string }[] = [
    { value: "high", label: "High", dot: "bg-red-500" },
    { value: "medium", label: "Medium", dot: "bg-amber-400" },
    { value: "low", label: "Low", dot: "bg-sky-400" },
  ];

  const SUB_OPTIONS: { value: SubmissionType; icon: React.ReactNode; label: string }[] = [
    { value: "github", icon: <Github size={14} />, label: "GitHub" },
    { value: "file", icon: <FileUp size={14} />, label: "File Upload" },
    { value: "link", icon: <Link size={14} />, label: "External Link" },
    { value: "all", icon: <Layers size={14} />, label: "Any / All" },
  ];

  return (
    <div className="relative pb-36">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-5 sm:p-6">
        {/* Section 1: General Info */}
        <Section title="General Information" icon={Layers}>
          <Field label="Event Context" required error={errors.eventId} hint="Select the event this task belongs to.">
            <EventPicker value={eventId} onChange={setEventId} events={events} error={errors.eventId} />
          </Field>

          <Field label="Task Title" required error={errors.title}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build landing page for AI showcase" className={inputCls(errors.title)} />
          </Field>

          <Field label="Description" required error={errors.description} hint="Explain deliverables and acceptance criteria clearly.">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
              placeholder="Describe the task in detail…" className={`${inputCls(errors.description)} resize-none`} />
          </Field>

          <Field label="Core Technologies" hint="Add all tech stacks required for this task.">
            <div className="rounded-lg border bg-[var(--cd-surface-2)] p-4" style={{ borderColor: "var(--cd-border-subtle)" }}>
              <TechPicker selected={technologies} onChange={setTechnologies} />
            </div>
          </Field>
        </Section>

        {/* Section 2: Assignment & Logistics */}
        <Section title="Assignment & Logistics" icon={Users}>
          <Field label="Assigned Members" required error={errors.assignedTo} hint="Who should complete this task?">
            <MemberPicker selected={assignedTo} onChange={setAssignedTo} />
          </Field>

          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Deadline" required error={errors.deadline}>
              <div className="relative group">
                <input
                  ref={deadlineInputRef}
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={inputCls(errors.deadline)}
                />
                <button
                  type="button"
                  onClick={openDeadlinePicker}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cd-text-muted)] hover:text-[var(--cd-primary)] transition-colors"
                >
                  <Calendar size={16} />
                </button>
              </div>
            </Field>

            <Field label="Task Priority">
              <div className="flex rounded-lg border bg-[var(--cd-surface-2)] p-1" style={{ borderColor: "var(--cd-border-subtle)" }}>
                {PRIORITY_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setPriority(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-xs font-medium transition-colors ${priority === opt.value ? "bg-[var(--cd-surface)] shadow-sm text-[var(--cd-text)]" : "text-[var(--cd-text-muted)] hover:text-[var(--cd-text)]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* Section 3: Rewards & Submission */}
        <Section title="Rewards & Submission" icon={Star}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Submission Type" hint="Format for user submission.">
              <div className="grid grid-cols-2 gap-2">
                {SUB_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setSubmissionType(opt.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[11px] font-medium transition-colors ${submissionType === opt.value ? "bg-[var(--cd-primary-subtle)] border-[var(--cd-primary)] text-[var(--cd-primary-text)]" : "bg-[var(--cd-surface)] border-[var(--cd-border)] text-[var(--cd-text-muted)] hover:border-[var(--cd-text-muted)]"}`}>
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Reward Points" error={errors.points} hint="Points awarded upon completion.">
              <div className="relative">
                <input type="number" value={points} onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 100" className={inputCls(errors.points)} />
                <Star size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cd-warning)] opacity-50" />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border bg-[var(--cd-surface-2)] p-4" style={{ borderColor: "var(--cd-border-subtle)" }}>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--cd-text)" }}>Mandatory Task</p>
                <p className="text-[10px]" style={{ color: "var(--cd-text-muted)" }}>Required to finish event.</p>
              </div>
              <button type="button" onClick={() => setIsMandatory(!isMandatory)}
                className={`w-10 h-6 rounded-full relative transition-colors ${isMandatory ? "bg-[var(--cd-primary)]" : "bg-[var(--cd-surface-3)]"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isMandatory ? "translate-x-5" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-[var(--cd-surface-2)] p-4" style={{ borderColor: "var(--cd-border-subtle)" }}>
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--cd-text)" }}>Late Submissions</p>
                <p className="text-[10px]" style={{ color: "var(--cd-text-muted)" }}>Accept after deadline.</p>
              </div>
              <button type="button" onClick={() => setAllowLate(!allowLate)}
                className={`w-10 h-6 rounded-full relative transition-colors ${allowLate ? "bg-[var(--cd-primary)]" : "bg-[var(--cd-surface-3)]"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${allowLate ? "translate-x-5" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <Field label="Max Submissions" hint="Leave empty for unlimited.">
            <input type="number" value={maxSubs} onChange={(e) => setMaxSubs(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Unlimited" className={inputCls()} />
          </Field>
        </Section>
      </div>

      {/* Floating Action Bar */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[var(--cd-bg)] via-[var(--cd-bg)] to-transparent p-4 transition-all sm:p-6 lg:pl-85">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center justify-between rounded-xl border bg-[var(--cd-surface)]/95 p-3 shadow-2xl backdrop-blur-md" style={{ borderColor: "var(--cd-border-subtle)" }}>
          <div className="hidden sm:block">
            <p className="text-xs font-bold" style={{ color: "var(--cd-text)" }}>{mode === "create" ? "New Task" : "Edit Mode"}</p>
            <p className="text-[10px] truncate max-w-[200px]" style={{ color: "var(--cd-text-muted)" }}>{title || "Untitled Task"}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => navigate(-1)}
              className="h-10 flex-1 rounded-lg border bg-[var(--cd-surface)] px-5 text-sm font-medium text-[var(--cd-text-2)] transition-colors hover:bg-[var(--cd-hover)] sm:flex-none"
              style={{ borderColor: "var(--cd-border)" }}>
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={isLoading}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--cd-primary)] px-7 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-50 sm:flex-none">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : (mode === "create" ? "Create Task" : "Save Changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

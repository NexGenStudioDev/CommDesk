import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown, ChevronUp, Calendar, Star, Loader2,
  AlertCircle, Github, FileUp, Layers, Users, Code2,
} from "lucide-react";
import Avatar from "../common/Avatar";
import { useEvents } from "../../hooks/useEvents";
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";
import { mockMembers } from "../../mock/taskMockData";
import { TECH_OPTIONS } from "../../constants/tech.constants";
import type { Task, TaskPriority, SubmissionType, TechTag, CreateTaskPayload } from "../../Task.types";

interface Props { mode: "create" | "edit"; task?: Task; }

interface Errors {
  eventId?: string; title?: string; description?: string;
  assignedTo?: string; deadline?: string; points?: string;
}

function validate(form: Partial<CreateTaskPayload>): Errors {
  const e: Errors = {};
  if (!form.eventId)             e.eventId     = "Please select an event.";
  if (!form.title?.trim())       e.title       = "Task title is required.";
  else if (form.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (!form.description?.trim()) e.description = "Description is required.";
  if (!form.assignedTo?.length)  e.assignedTo  = "Assign to at least one member.";
  if (!form.deadline)            e.deadline    = "Deadline is required.";
  if (form.points !== undefined && form.points < 0) e.points = "Points must be ≥ 0.";
  return e;
}

function Field({ label, required, error, children, hint }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="flex items-center gap-1 text-xs text-red-500 font-medium"><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full text-sm rounded-xl border px-3.5 py-2.5 outline-none transition-all placeholder-gray-400 text-gray-900 bg-white
    ${error ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`;
}

// ─── Tech tag picker ──────────────────────────────────────────────────────────
function TechPicker({ selected, onChange }: { selected: TechTag[]; onChange: (tags: TechTag[]) => void }) {
  const [search, setSearch] = useState("");
  const selectedIds = new Set(selected.map((t) => t.id));

  const toggle = (tech: TechTag) => {
    if (selectedIds.has(tech.id)) onChange(selected.filter((t) => t.id !== tech.id));
    else onChange([...selected, tech]);
  };

  const filtered = TECH_OPTIONS.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tech) => (
            <span key={tech.id}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${tech.color}`}>
              {tech.label}
              <button onClick={() => toggle(tech)} className="ml-0.5 opacity-60 hover:opacity-100 font-bold">×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search technologies…"
        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 bg-gray-50 focus:bg-white transition" />

      {/* Grid of options */}
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        {filtered.map((tech) => {
          const isSel = selectedIds.has(tech.id);
          return (
            <button key={tech.id} type="button" onClick={() => toggle(tech)}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md transition-all border
                ${isSel
                  ? `${tech.color} border-transparent ring-2 ring-offset-1 ring-indigo-300`
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
              {isSel && <span className="text-[10px]">✓</span>}
              {tech.label}
            </button>
          );
        })}
        {filtered.length === 0 && <p className="text-xs text-gray-400 py-2">No match for "{search}"</p>}
      </div>
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

  const [eventId,        setEventId]        = useState(task?.eventId ?? params.get("eventId") ?? "");
  const [title,          setTitle]          = useState(task?.title ?? "");
  const [description,    setDescription]    = useState(task?.description ?? "");
  const [assignedTo,     setAssignedTo]     = useState<string[]>(task?.assignedTo.map((m) => m.id) ?? []);
  const [deadline,       setDeadline]       = useState(task?.deadline.slice(0, 16) ?? "");
  const [priority,       setPriority]       = useState<TaskPriority>(task?.priority ?? "medium");
  const [submissionType, setSubmissionType] = useState<SubmissionType>(task?.submissionType ?? "github");
  const [isMandatory,    setIsMandatory]    = useState(task?.isMandatory ?? false);
  const [points,         setPoints]         = useState<number | "">(task?.points ?? "");
  const [allowLate,      setAllowLate]      = useState(task?.allowLateSubmission ?? false);
  const [maxSubs,        setMaxSubs]        = useState<number | "">(task?.maxSubmissions ?? "");
  const [technologies,   setTechnologies]   = useState<TechTag[]>(task?.technologies ?? []);
  const [showAdvanced,   setShowAdvanced]   = useState(false);
  const [errors,         setErrors]         = useState<Errors>({});
  const [touched,        setTouched]        = useState(false);

  useEffect(() => {
    if (!touched) return;
    setErrors(validate({ eventId, title, description, assignedTo, deadline, points: points === "" ? undefined : Number(points) }));
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
    { value: "high",   label: "High",   dot: "bg-red-500"   },
    { value: "medium", label: "Medium", dot: "bg-amber-400" },
    { value: "low",    label: "Low",    dot: "bg-sky-400"   },
  ];

  const SUB_OPTIONS: { value: SubmissionType; icon: React.ReactNode; label: string }[] = [
    { value: "github", icon: <Github size={14} />,  label: "GitHub"      },
    { value: "file",   icon: <FileUp size={14} />,  label: "File Upload" },
    { value: "both",   icon: <Layers size={14} />,  label: "Both"        },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-2xl w-full mx-auto p-6">
      {/* Event */}
      <Field label="Event" required error={errors.eventId}>
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={inputCls(errors.eventId)}>
          <option value="">Select an event…</option>
          {events.map((evt) => <option key={evt.id} value={evt.id}>{evt.name} · {evt.status}</option>)}
        </select>
      </Field>

      {/* Title */}
      <Field label="Task Title" required error={errors.title}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Build landing page for AI showcase" className={inputCls(errors.title)} />
      </Field>

      {/* Description */}
      <Field label="Description" required error={errors.description} hint="Explain deliverables and acceptance criteria.">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          placeholder="Describe the task in detail…" className={`${inputCls(errors.description)} resize-none`} />
      </Field>

      {/* Technologies */}
      <Field label="Technologies Used" hint="Select all relevant tech for this task.">
        <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
          <TechPicker selected={technologies} onChange={setTechnologies} />
        </div>
      </Field>

      {/* Assign to */}
      <Field label="Assign To" required error={errors.assignedTo}>
        <div className="grid grid-cols-2 gap-2">
          {mockMembers.map((m) => {
            const sel = assignedTo.includes(m.id);
            return (
              <button key={m.id} type="button" onClick={() => {
                setAssignedTo((prev) => prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id]);
              }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all
                  ${sel ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                <Avatar name={m.name} src={m.avatar} size="md" showTooltip={false} ring ringColor="ring-indigo-200" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${sel ? "text-indigo-700" : "text-gray-900"}`}>{m.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{m.role}</p>
                </div>
                {sel && <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0"><span className="text-white text-[8px] font-bold">✓</span></div>}
              </button>
            );
          })}
        </div>
        {assignedTo.length > 0 && (
          <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
            <Users size={11} />{assignedTo.length} member{assignedTo.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </Field>

      {/* Deadline + Priority */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Deadline" required error={errors.deadline}>
          <div className="relative">
            <input
              ref={deadlineInputRef}
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full text-sm rounded-xl border py-2.5 pl-3 pr-11 outline-none transition-all text-gray-900 bg-white ${errors.deadline ? "border-red-300 ring-2 ring-red-100" : "border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
            />
            <button
              type="button"
              onClick={openDeadlinePicker}
              title="Select deadline"
              aria-label="Select deadline"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <Calendar size={16} />
            </button>
          </div>
        </Field>
        <Field label="Priority">
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map((p) => (
              <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all
                  ${priority === p.value ? "border-gray-800 bg-gray-800 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <span className={`w-2 h-2 rounded-full ${p.dot}`} />{p.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Submission type */}
      <Field label="Submission Type">
        <div className="flex gap-2">
          {SUB_OPTIONS.map((o) => (
            <button key={o.value} type="button" onClick={() => setSubmissionType(o.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all
                ${submissionType === o.value ? "border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"}`}>
              {o.icon}{o.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Advanced */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button type="button" onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="flex items-center gap-2"><Star size={14} className="text-amber-500" />Advanced Options</span>
          {showAdvanced ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>

        {showAdvanced && (
          <div className="px-4 pb-4 flex flex-col gap-4 border-t bg-gray-50/50">
            <div className="h-1" />

            {[
              { label: "Mandatory Task", desc: "Required for all assignees to complete.", val: isMandatory, set: setIsMandatory },
              { label: "Allow Late Submission", desc: "Accept submissions after the deadline.", val: allowLate, set: setAllowLate },
            ].map(({ label, desc, val, set }) => (
              <div key={label} className="flex items-center justify-between">
                <div><p className="text-sm font-semibold text-gray-800">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
                <div onClick={() => set((v) => !v)}
                  className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${val ? "bg-indigo-500" : "bg-gray-200"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${val ? "translate-x-5" : "translate-x-1"}`} />
                </div>
              </div>
            ))}

            <Field label="Points (Hackathon Score)" error={errors.points} hint="Leave empty to disable scoring.">
              <div className="relative">
                <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                <input type="number" min={0} max={1000} value={points}
                  onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 100" className={`${inputCls(errors.points)} pl-8`} />
              </div>
            </Field>

            <Field label="Max Submissions Per Member" hint="Leave empty for unlimited.">
              <input type="number" min={1} value={maxSubs}
                onChange={(e) => setMaxSubs(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 3" className={inputCls()} />
            </Field>
          </div>
        )}
      </div>

      {/* Submit row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t">
        <button type="button" onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200">
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {mode === "create" ? "Create Task" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

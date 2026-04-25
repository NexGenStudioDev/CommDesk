import { Globe, Github, Link2, Save, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shadcnComponet/ui/button";

import type { ProjectRecord, ProjectUpdateInput } from "../types";

type OverviewProps = {
  project: ProjectRecord;
  canEdit: boolean;
  isEditing: boolean;
  isSaving: boolean;
  validationErrors: string[];
  onEditingChange: (editing: boolean) => void;
  onSave: (values: ProjectUpdateInput) => Promise<void>;
};

type FormState = {
  title: string;
  description: string;
  techStack: string;
  repositoryUrl: string;
  demoUrl: string;
};

function toFormState(project: ProjectRecord): FormState {
  return {
    title: project.title,
    description: project.description,
    techStack: project.techStack.join(", "),
    repositoryUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
  };
}

export default function Overview({
  project,
  canEdit,
  isEditing,
  isSaving,
  validationErrors,
  onEditingChange,
  onSave,
}: OverviewProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(project));

  async function handleSubmit() {
    await onSave({
      title: form.title,
      description: form.description,
      techStack: form.techStack
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
      repositoryUrl: form.repositoryUrl,
      demoUrl: form.demoUrl,
    });
  }

  if (isEditing && canEdit) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Refine your submission</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={isSaving} onClick={() => onEditingChange(false)}>
              <X className="size-4" />
              Cancel
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800" disabled={isSaving} onClick={handleSubmit}>
              <Save className="size-4" />
              Save changes
            </Button>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Project title
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Description
            <textarea
              className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Tech stack
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                value={form.techStack}
                onChange={(event) =>
                  setForm((current) => ({ ...current, techStack: event.target.value }))
                }
                placeholder="React, TypeScript, Node.js"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              GitHub repository
              <input
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                value={form.repositoryUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, repositoryUrl: event.target.value }))
                }
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Live demo URL
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.demoUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, demoUrl: event.target.value }))
              }
            />
          </label>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Project summary</h2>
        </div>
        {canEdit && (
          <Button variant="outline" onClick={() => onEditingChange(true)}>
            Edit details
          </Button>
        )}
      </div>

      <p className="text-base leading-7 text-slate-700">{project.description}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Link2 className="size-4" />
            Tech stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <a
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"
            href={project.repositoryUrl}
            rel="noreferrer"
            target="_blank"
          >
            <span className="flex items-center gap-2">
              <Github className="size-4" />
              GitHub repository
            </span>
            <span>Open</span>
          </a>
          <a
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
            href={project.demoUrl}
            rel="noreferrer"
            target="_blank"
          >
            <span className="flex items-center gap-2">
              <Globe className="size-4" />
              Live demo
            </span>
            <span>Visit</span>
          </a>
        </div>
      </div>
    </section>
  );
}

import { Globe, Github, Save, X, Layout, Code2, ExternalLink, Sparkles, Layers } from "lucide-react";
import { useState } from "react";
import TechChip from "./TechChip";

import type { ProjectRecord, ProjectUpdateInput } from "@/features/Projects/types/project.types";
import { Button } from "@/shadcnComponet/ui/button";

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
      <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
        <div className="bg-slate-50 border-b border-slate-100 p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
                <Layout className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Workspace</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Project Editor</h2>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-2 border-slate-200 bg-white px-6 font-black uppercase tracking-widest text-xs" 
                disabled={isSaving} 
                onClick={() => onEditingChange(false)}
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button 
                className="h-12 rounded-xl bg-indigo-600 px-6 font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200" 
                disabled={isSaving} 
                onClick={handleSubmit}
              >
                <Save className="mr-2 size-4" />
                Save Changes
              </Button>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="mt-8 rounded-2xl border-2 border-rose-200 bg-rose-50 p-6 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-700">
                <X className="size-4" />
                Validation Errors
              </p>
              <ul className="mt-3 space-y-1">
                {validationErrors.map((error) => (
                  <li key={error} className="text-sm font-bold text-rose-600/80">• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="grid gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Project Title</label>
              <input
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-lg font-black outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Project Description</label>
              <textarea
                className="min-h-[200px] w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-medium leading-relaxed outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tech Stack (comma separated)</label>
                <div className="relative">
                  <Code2 className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-14 pr-5 py-4 text-sm font-black outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                    value={form.techStack}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, techStack: event.target.value }))
                    }
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">GitHub Repository</label>
                <div className="relative">
                  <Github className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-14 pr-5 py-4 text-sm font-black outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                    value={form.repositoryUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, repositoryUrl: event.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Demo URL</label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-14 pr-5 py-4 text-sm font-black outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                  value={form.demoUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, demoUrl: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="p-10">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50/50 text-indigo-600 shadow-sm ring-1 ring-indigo-100/50 transition-transform group-hover:scale-110 duration-500">
              <Layout className="size-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500/80 mb-1">Project Overview</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Executive Summary</h2>
            </div>
          </div>
          {canEdit && (
            <Button 
              variant="outline" 
              className="h-11 rounded-xl border-2 border-slate-100 px-8 font-bold uppercase tracking-widest text-[10px] hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300" 
              onClick={() => onEditingChange(true)}
            >
              Modify Record
            </Button>
          )}
        </div>

        <div className="mt-10 max-w-4xl space-y-3">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-400">
            Strategic Brief
          </p>
          <p className="text-lg font-medium leading-8 text-slate-600/90 selection:bg-indigo-100 selection:text-indigo-700 sm:text-xl">
            {project.description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100/70 p-2.5 shadow-sm ring-1 ring-indigo-100/80">
                    <Layers className="size-4 text-indigo-600" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                    Integrated Tech Stack
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    Platform technologies in active use
                  </h3>
                  <p className="text-sm font-medium leading-6 text-slate-500">
                    Each technology is surfaced independently for cleaner scanning across project reviews.
                  </p>
                </div>
              </div>
              <div className="inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                {project.techStack.length} technologies
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.techStack.map((item) => (
                <TechChip key={item} label={item} />
              ))}
            </div>

            {project.techStack.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-5 py-4 text-sm font-medium text-slate-500">
                No technologies added yet.
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100/70 p-2.5 shadow-sm ring-1 ring-indigo-100/80">
                <Layers className="size-4 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Project Assets</p>
                <h3 className="text-xl font-black tracking-tight text-slate-950">Delivery links</h3>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <a
                className="group/link flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-950/70 hover:shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)]"
                href={project.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-950 shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover/link:bg-slate-950 group-hover/link:text-white group-hover/link:ring-slate-950">
                    <Github className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-black text-slate-900">GitHub Source</span>
                    <span className="block truncate text-[11px] font-medium text-slate-400">View implementation</span>
                  </div>
                </div>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover/link:bg-slate-950/5">
                  <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-slate-950" />
                </div>
              </a>
              <a
                className="group/link flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/70 hover:shadow-[0_20px_45px_-24px_rgba(79,70,229,0.35)]"
                href={project.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50/70 text-indigo-600 shadow-sm ring-1 ring-indigo-100/70 transition-all duration-300 group-hover/link:bg-indigo-600 group-hover/link:text-white group-hover/link:ring-indigo-600">
                    <Globe className="size-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-black text-slate-900">Live Production</span>
                    <span className="block truncate text-[11px] font-medium text-slate-400">View live deployment</span>
                  </div>
                </div>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50/70 transition-colors group-hover/link:bg-indigo-600/5">
                  <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-indigo-600" />
                </div>
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-950/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-indigo-100/70 p-2 text-indigo-600">
                  <Sparkles className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Reviewer Note
                  </p>
                  <p className="text-sm font-medium leading-6 text-slate-600">
                    Assets are grouped separately to make source review and live verification faster during moderation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

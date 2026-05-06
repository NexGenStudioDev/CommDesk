import { Globe, Github, Save, X, Layout, Code2, ExternalLink } from "lucide-react";
import { useState } from "react";

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
  }

  return (
    <section className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
              <Layout className="size-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Project Overview</p>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Executive Summary</h2>
            </div>
          </div>
          {canEdit && (
            <Button 
              variant="outline" 
              className="h-10 rounded-xl border-2 border-slate-100 px-6 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50" 
              onClick={() => onEditingChange(true)}
            >
              Modify Record
            </Button>
          )}
        </div>

        <div className="mt-8">
          <p className="text-lg font-medium leading-relaxed text-slate-600">
            {project.description}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Code2 className="size-4 text-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Integrated Tech Stack</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition-all hover:scale-105 hover:bg-white hover:shadow-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <ExternalLink className="size-4 text-indigo-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Assets</p>
            </div>
            <div className="grid gap-3">
              <a
                className="group/link flex items-center justify-between rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-slate-950 hover:bg-white hover:shadow-xl"
                href={project.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm ring-1 ring-slate-100 group-hover/link:bg-slate-950 group-hover/link:text-white group-hover/link:ring-slate-950 transition-all">
                    <Github className="size-5" />
                  </div>
                  <span className="text-sm font-black text-slate-900">GitHub Source</span>
                </div>
                <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:text-slate-950" />
              </a>
              <a
                className="group/link flex items-center justify-between rounded-2xl border-2 border-slate-50 bg-slate-50/50 p-4 transition-all hover:border-indigo-600 hover:bg-white hover:shadow-xl"
                href={project.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100 group-hover/link:bg-indigo-600 group-hover/link:text-white group-hover/link:ring-indigo-600 transition-all">
                    <Globe className="size-5" />
                  </div>
                  <span className="text-sm font-black text-slate-900">Live Production</span>
                </div>
                <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:text-indigo-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

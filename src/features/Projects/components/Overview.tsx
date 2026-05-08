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

        <div className="mt-10 max-w-4xl">
          <p className="text-xl font-medium leading-relaxed text-slate-600/90 selection:bg-indigo-100 selection:text-indigo-700">
            {project.description}
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8 rounded-3xl bg-slate-50/40 p-8 ring-1 ring-slate-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100/50 rounded-lg">
                <Layers className="size-4 text-indigo-600" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Integrated Tech Stack</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((item) => (
                <TechChip key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100/50 rounded-lg">
                <Sparkles className="size-4 text-indigo-600" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Project Assets</p>
            </div>
            <div className="grid gap-4">
              <a
                className="group/link flex items-center justify-between rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all duration-300 hover:border-slate-950 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                href={project.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-950 shadow-sm ring-1 ring-slate-100 group-hover/link:bg-slate-950 group-hover/link:text-white group-hover/link:ring-slate-950 transition-all duration-300">
                    <Github className="size-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-900">GitHub Source</span>
                    <span className="text-[11px] font-medium text-slate-400">View implementation</span>
                  </div>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-50 group-hover/link:bg-slate-950/5 transition-colors">
                  <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-slate-950" />
                </div>
              </a>
              <a
                className="group/link flex items-center justify-between rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all duration-300 hover:border-indigo-600 hover:shadow-[0_10px_30px_rgba(79,70,229,0.1)]"
                href={project.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50/50 text-indigo-600 shadow-sm ring-1 ring-indigo-100/50 group-hover/link:bg-indigo-600 group-hover/link:text-white group-hover/link:ring-indigo-600 transition-all duration-300">
                    <Globe className="size-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-900">Live Production</span>
                    <span className="text-[11px] font-medium text-slate-400">View live deployment</span>
                  </div>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-indigo-50/50 group-hover/link:bg-indigo-600/5 transition-colors">
                  <ExternalLink className="size-4 text-slate-400 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-indigo-600" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

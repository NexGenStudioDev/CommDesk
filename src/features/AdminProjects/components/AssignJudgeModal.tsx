import React, { useState } from 'react';
import { X, Search, Check, Info } from 'lucide-react';
import { ProjectJudge } from '../types/adminProjects.types';
import { cn } from '../../../lib/utils';

interface AssignJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  judges: ProjectJudge[];
  onAssign: (judgeIds: string[]) => void;
  projectName: string;
}

const AssignJudgeModal: React.FC<AssignJudgeModalProps> = ({ isOpen, onClose, judges, onAssign, projectName }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeTrack, setActiveTrack] = useState('All Tracks');

  if (!isOpen) return null;

  const toggleJudge = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredJudges = judges.filter(j => {
    const matchesSearch = j.name.toLowerCase().includes(search.toLowerCase()) || 
      j.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTrack = activeTrack === 'All Tracks' || 
      j.expertise.some(e => e.toLowerCase() === activeTrack.toLowerCase()) ||
      (activeTrack === 'AI/ML' && j.expertise.some(e => ['ai', 'ml', 'neural nets'].includes(e.toLowerCase())));

    return matchesSearch && matchesTrack;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Assign Judges</h3>
            <p className="text-sm text-slate-400">Project: <span className="text-blue-400">{projectName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, expertise, or track..."
              className="w-full bg-slate-800/50 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
             {['All Tracks', 'AI/ML', 'Cybersecurity'].map((tag) => (
               <button 
                key={tag}
                onClick={() => setActiveTrack(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  tag === activeTrack ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                )}
               >
                 {tag}
               </button>
             ))}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Judges ({filteredJudges.length})</p>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredJudges.map((judge) => (
                <div
                  key={judge.id}
                  onClick={() => toggleJudge(judge.id)}
                  className={cn(
                    "group relative flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                    selectedIds.includes(judge.id) 
                      ? "bg-blue-500/5 border-blue-500/30 ring-1 ring-blue-500/30" 
                      : "bg-slate-800/30 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=${judge.id}`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-white">{judge.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                        {judge.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{judge.role}</p>
                    <div className="flex gap-2 mt-2">
                      {judge.expertise.map(e => (
                        <span key={e} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                    selectedIds.includes(judge.id) ? "bg-blue-600 border-blue-600 text-white" : "border-slate-700 group-hover:border-slate-500"
                  )}>
                    {selectedIds.includes(judge.id) && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">
            <span className="text-white font-bold">{selectedIds.length}</span> judge{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-slate-400 hover:text-white font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onAssign(selectedIds)}
              disabled={selectedIds.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Assign Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignJudgeModal;

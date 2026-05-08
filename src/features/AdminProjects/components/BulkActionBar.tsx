import React from 'react';
import { CheckCircle, XCircle, UserPlus, Trash2, Download, X } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onApprove: () => void;
  onReject: () => void;
  onAssignJudges: () => void;
  onDelete: () => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClear,
  onApprove,
  onReject,
  onAssignJudges,
  onDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 min-w-[500px]">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {selectedCount}
          </div>
          <span className="text-slate-300 font-medium whitespace-nowrap">Projects Selected</span>
          <button onClick={onClear} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAssignJudges}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Assign Judge
          </button>
          
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all text-sm font-medium border border-emerald-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            Bulk Approve
          </button>

          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-medium"
          >
            <XCircle className="w-4 h-4" />
            Bulk Reject
          </button>

          <div className="w-[1px] h-6 bg-slate-800 mx-2" />

          <button
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
            title="Delete Selected"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;

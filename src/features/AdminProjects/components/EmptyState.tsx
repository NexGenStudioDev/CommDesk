import React from 'react';
import { Search, FolderX, Filter } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-results' | 'no-data';
  onClearFilters?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type = 'no-results', onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-2xl">
          {type === 'no-results' ? (
            <Search className="w-10 h-10 text-slate-400" />
          ) : (
            <FolderX className="w-10 h-10 text-slate-400" />
          )}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
             <span className="text-[10px]">!</span>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {type === 'no-results' ? 'No projects found' : 'No projects yet'}
      </h3>
      <p className="text-slate-400 max-w-sm mx-auto mb-8">
        {type === 'no-results' 
          ? "We couldn't find any projects matching your current filters. Try refining your search or clearing all active parameters to start fresh."
          : "There are no projects in this organization yet. New submissions will appear here once they are received."}
      </p>

      {type === 'no-results' && onClearFilters && (
        <div className="flex items-center gap-4">
          <button
            onClick={onClearFilters}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear all filters
          </button>
          <button className="px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl font-medium transition-all active:scale-95">
            View Archive
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

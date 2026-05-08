import React from 'react';

const LoadingSkeleton: React.FC<{ view?: 'table' | 'grid' }> = ({ view = 'table' }) => {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-800" />
            <div className="p-5 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-800 rounded-full w-16" />
                <div className="h-6 bg-slate-800 rounded-full w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-800/40 border-b border-slate-800/60" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-16 bg-transparent border-b border-slate-800/30 flex items-center px-6 gap-4">
          <div className="w-4 h-4 bg-slate-800 rounded" />
          <div className="w-10 h-10 bg-slate-800 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-800 rounded w-1/4" />
            <div className="h-2 bg-slate-800 rounded w-1/6" />
          </div>
          <div className="w-24 h-6 bg-slate-800 rounded-full" />
          <div className="w-20 h-6 bg-slate-800 rounded-lg" />
          <div className="w-8 h-8 bg-slate-800 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

import React from 'react';
import { X } from 'lucide-react';
import { ProjectFilters } from '../types/adminProjects.types';

interface FilterSidebarProps {
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const activeFilters = [
    { key: 'status', value: filters.status, label: `Status: ${filters.status}` },
    { key: 'event', value: filters.event, label: `Event: ${filters.event}` },
    { key: 'track', value: filters.track, label: `Track: ${filters.track}` },
    { key: 'judgeAssignment', value: filters.judgeAssignment, label: `Judges: ${filters.judgeAssignment}` },
  ].filter(f => f.value !== 'All');

  if (activeFilters.length === 0) return null;

  const removeFilter = (key: string) => {
    setFilters({ ...filters, [key]: 'All' });
  };

  const clearAll = () => {
    setFilters({
      ...filters,
      status: 'All',
      event: 'All',
      track: 'All',
      judgeAssignment: 'All'
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key)}
            className="hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterSidebar;

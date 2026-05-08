import React from 'react';
import { Search, Filter, RotateCcw, LayoutGrid, List } from 'lucide-react';
import { ProjectFilters } from '../types/adminProjects.types';
import { TRACKS, EVENTS } from '../constants/projectStatus.constants';

interface SearchBarProps {
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  view: 'table' | 'grid';
  setView: (view: 'table' | 'grid') => void;
  onRefresh: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, setFilters, view, setView, onRefresh }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="relative flex-1 w-full group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by project, team, or participant name..."
          className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          className="bg-slate-900/50 border border-slate-800 text-slate-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition-all appearance-none min-w-[140px]"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select
          className="hidden lg:block bg-slate-900/50 border border-slate-800 text-slate-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition-all appearance-none min-w-[180px]"
          value={filters.event}
          onChange={(e) => setFilters({ ...filters, event: e.target.value })}
        >
          <option value="All">All Events</option>
          {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        <select
          className="hidden xl:block bg-slate-900/50 border border-slate-800 text-slate-300 px-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition-all appearance-none min-w-[140px]"
          value={filters.track}
          onChange={(e) => setFilters({ ...filters, track: e.target.value })}
        >
          <option value="All">All Tracks</option>
          {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <button
          onClick={onRefresh}
          className="p-3 bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-2xl transition-all active:rotate-180"
          title="Refresh"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <div className="h-10 w-[1px] bg-slate-800 mx-1 hidden md:block" />

        <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-xl transition-all ${view === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

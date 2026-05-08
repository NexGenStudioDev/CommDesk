import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Filter } from 'lucide-react';
import { adminProjectsService } from '../services/adminProjects.service';
import { Project, ProjectAnalytics, ProjectFilters, ProjectJudge } from '../types/adminProjects.types';

import AnalyticsCards from '../components/AnalyticsCards';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import ProjectsTable from '../components/ProjectsTable';
import ProjectsGrid from '../components/ProjectsGrid';
import BulkActionBar from '../components/BulkActionBar';
import AssignJudgeModal from '../components/AssignJudgeModal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const AdminProjectsPage: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [judges, setJudges] = useState<ProjectJudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [activeProjectForJudge, setActiveProjectForJudge] = useState<Project | null>(null);

  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    status: 'All',
    event: 'All',
    track: 'All',
    scoreRange: [0, 10],
    judgeAssignment: 'All'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsData, analyticsData, judgesData] = await Promise.all([
        adminProjectsService.fetchProjects({ ...filters, search: debouncedSearch }, pagination),
        adminProjectsService.fetchAnalytics(),
        adminProjectsService.fetchJudges()
      ]);
      setProjects(projectsData.projects);
      setAnalytics(analyticsData);
      setJudges(judgesData);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.event, filters.track, filters.scoreRange, filters.judgeAssignment, pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map(p => p.id));
    }
  };

  const handleAction = (id: string, action: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    switch (action) {
      case 'approve':
        updateProjectStatus([id], 'Approved');
        break;
      case 'reject':
        updateProjectStatus([id], 'Rejected');
        break;
      case 'assign':
        setActiveProjectForJudge(project);
        setIsJudgeModalOpen(true);
        break;
      case 'delete':
        setProjects(prev => prev.filter(p => p.id !== id));
        break;
      default:
        console.log(`Action ${action} for ${id}`);
    }
  };

  const updateProjectStatus = async (ids: string[], status: Project['status']) => {
    try {
      await adminProjectsService.bulkUpdateStatus(ids, status);
      setProjects(prev => prev.map(p => 
        ids.includes(p.id) ? { ...p, status } : p
      ));
      setSelectedIds([]);
      // Show success toast (not implemented here but good to have)
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignJudges = async (judgeIds: string[]) => {
    const targetIds = activeProjectForJudge ? [activeProjectForJudge.id] : selectedIds;
    try {
      await adminProjectsService.assignJudges(targetIds, judgeIds);
      setIsJudgeModalOpen(false);
      setActiveProjectForJudge(null);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects Management</h1>
          <p className="text-slate-500 mt-1">Monitor and moderate global hackathon submissions across all tracks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all font-medium text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-95">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsCards data={analytics} />

      {/* Main Content Area */}
      <div className="relative">
        <SearchBar 
          filters={filters} 
          setFilters={setFilters} 
          view={view} 
          setView={setView}
          onRefresh={fetchData}
        />

        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
        />

        {loading ? (
          <LoadingSkeleton view={view} />
        ) : projects.length > 0 ? (
          view === 'table' ? (
            <ProjectsTable 
              projects={projects}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onViewProject={(p) => console.log('View', p)}
              onAction={handleAction}
              pagination={pagination}
              setPagination={setPagination}
            />
          ) : (
            <ProjectsGrid 
              projects={projects}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onViewProject={(p) => console.log('View', p)}
              onAction={handleAction}
            />
          )
        ) : (
          <EmptyState 
            type={filters.search || filters.status !== 'All' ? 'no-results' : 'no-data'} 
            onClearFilters={() => setFilters({ ...filters, search: '', status: 'All', event: 'All', track: 'All' })}
          />
        )}
      </div>

      {/* Modals & Floating UI */}
      <BulkActionBar 
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onApprove={() => updateProjectStatus(selectedIds, 'Approved')}
        onReject={() => updateProjectStatus(selectedIds, 'Rejected')}
        onAssignJudges={() => {
          setActiveProjectForJudge(null);
          setIsJudgeModalOpen(true);
        }}
        onDelete={() => {
          setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
          setSelectedIds([]);
        }}
      />

      <AssignJudgeModal 
        isOpen={isJudgeModalOpen}
        onClose={() => {
          setIsJudgeModalOpen(false);
          setActiveProjectForJudge(null);
        }}
        judges={judges}
        projectName={activeProjectForJudge?.name || `${selectedIds.length} Selected Projects`}
        onAssign={handleAssignJudges}
      />
    </div>
  );
};

export default AdminProjectsPage;

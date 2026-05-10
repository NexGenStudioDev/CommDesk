import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project } from "../types";
import { projectApi } from "../services/mockProjectApi";

import { Header } from "../components/Header";
import { Overview } from "../components/Overview";
import { Team } from "../components/Team";
import { Submission } from "../components/Submission";
import { Attachments } from "../components/Attachments";
import { ScorePanel } from "../components/ScorePanel";
import { ModerationPanel } from "../components/ModerationPanel";
import { Timeline } from "../components/Timeline";

// Mock User Context (In a real app, this would come from a global auth state)
type UserRole = "Participant" | "Judge" | "Organizer" | "Admin";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Temporary UI to switch roles for testing
  const [userRole, setUserRole] = useState<UserRole>("Admin");
  const [userName] = useState("Mock Current User");

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getProject(id);
      setProject(data);
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProject = async () => {
    if (!project) return;
    try {
      setIsProcessing(true);
      const updated = await projectApi.submitProject(project.id, userName);
      setProject(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScoreProject = async (scoreData: { innovation: number; technical: number; design: number; impact: number; feedback: string }) => {
    if (!project) return;
    try {
      const updated = await projectApi.scoreProject(project.id, {
        ...scoreData,
        judgeId: "curr-user-id",
        judgeName: userName
      });
      setProject(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleModerate = async (action: "approve" | "reject") => {
    if (!project) return;
    try {
      setIsProcessing(true);
      const updated = await projectApi.moderateProject(project.id, action, userName);
      setProject(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      try {
        setIsProcessing(true);
        await projectApi.deleteProject(project.id);
        navigate("/org/dashboard"); // redirect after delete
      } catch (err: any) {
        alert(err.message);
        setIsProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F19]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0B0F19] text-white gap-4">
        <h2 className="text-2xl font-bold text-red-400">Error</h2>
        <p className="text-slate-400">{error || "Project not found"}</p>
        <button onClick={() => projectId && loadProject(projectId)} className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Testing Role Switcher (Can be removed in production) */}
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <span className="text-sm text-slate-400 font-medium">Test Role:</span>
          {(["Participant", "Judge", "Organizer", "Admin"] as const).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${userRole === role ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {role}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-500">Only visible in dev</span>
        </div>

        <Header 
          project={project} 
          userRole={userRole} 
          onSubmit={handleSubmitProject} 
          isSubmitting={isProcessing} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <Overview project={project} />
            <Submission project={project} />
            <Attachments project={project} />
            
            {/* Role Specific Panels */}
            {userRole === "Judge" && (
              <ScorePanel project={project} onSubmitScore={handleScoreProject} />
            )}
            
            {(userRole === "Organizer" || userRole === "Admin") && (
              <ModerationPanel 
                project={project} 
                onModerate={handleModerate} 
                onDelete={handleDelete} 
                isProcessing={isProcessing} 
              />
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <Team project={project} />
            <Timeline project={project} />
            
            {/* Show scores summary if Admin or Organizer */}
            {(userRole === "Admin" || userRole === "Organizer" || userRole === "Judge") && project.scores.length > 0 && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4">Evaluation Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Scores</span>
                  <span className="text-white font-medium">{project.scores.length}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-slate-400">Average</span>
                  <span className="text-indigo-400 font-bold text-xl">
                    {(project.scores.reduce((a, b) => a + b.totalScore, 0) / project.scores.length).toFixed(1)} / 40
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { ProjectAnalytics } from '../types/adminProjects.types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, CheckCircle2, XCircle, Clock, BarChart3, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AnalyticsCardsProps {
  data: ProjectAnalytics | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ data }) => {
  if (!data) return null;

  const stats = [
    { label: 'Total Projects', value: data.totalProjects, trend: '+12%', trendUp: true, icon: BarChart3, color: 'blue', data: data.trends.total },
    { label: 'Submitted', value: data.submittedProjects, trend: '+5%', trendUp: true, icon: Users, color: 'indigo', data: data.trends.submitted },
    { label: 'Approved', value: data.approvedProjects, trend: '+8%', trendUp: true, icon: CheckCircle2, color: 'emerald', data: data.trends.approved },
    { label: 'Pending', value: data.pendingReviews, trend: '+24%', trendUp: false, icon: Clock, color: 'amber', data: data.trends.pending },
    { label: 'Rejected', value: data.rejectedProjects, trend: '-2%', trendUp: false, icon: XCircle, color: 'rose', data: data.trends.rejected },
    { label: 'Avg Score', value: `${data.averageScore}/10`, trend: '+0.4', trendUp: true, icon: TrendingUp, color: 'violet', data: data.trends.total.map(v => v * 0.1) },
    { label: 'Flagged', value: data.flaggedProjects, trend: '+2', trendUp: false, icon: AlertTriangle, color: 'orange', data: data.trends.rejected },
  ];

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-transparent text-blue-500',
    indigo: 'from-indigo-500/20 to-transparent text-indigo-500',
    emerald: 'from-emerald-500/20 to-transparent text-emerald-500',
    amber: 'from-amber-500/20 to-transparent text-amber-500',
    rose: 'from-rose-500/20 to-transparent text-rose-500',
    violet: 'from-violet-500/20 to-transparent text-violet-500',
    orange: 'from-orange-500/20 to-transparent text-orange-500',
  };

  const chartColorMap: Record<string, string> = {
    blue: '#3b82f6',
    indigo: '#6366f1',
    emerald: '#10b881',
    amber: '#f59e0b',
    rose: '#f43f5e',
    violet: '#8b5cf6',
    orange: '#f97316',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="group relative bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 overflow-hidden transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5"
        >
          <div className="flex justify-between items-start mb-2">
            <div className={cn("p-2 rounded-lg bg-slate-800/50", stat.color.includes('rose') ? 'text-rose-500' : stat.color.includes('amber') ? 'text-amber-500' : 'text-slate-400')}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              stat.trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.trend}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h4 className="text-xl font-bold text-white mt-0.5">{stat.value}</h4>
          </div>

          {/* Mini Chart */}
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-50 group-hover:opacity-80 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stat.data.map((v, i) => ({ v }))}>
                <defs>
                  <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColorMap[stat.color]} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartColorMap[stat.color]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={chartColorMap[stat.color]}
                  strokeWidth={2}
                  fill={`url(#grad-${i})`}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;

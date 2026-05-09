import React from 'react';
import { ProjectStatus } from '../types/adminProjects.types';
import { PROJECT_STATUS_COLORS } from '../constants/projectStatus.constants';
import { cn } from '../../../lib/utils';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className }) => {
  const styles = PROJECT_STATUS_COLORS[status] || PROJECT_STATUS_COLORS.Pending;

  return (
    <div
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit',
        styles.bg,
        styles.text,
        styles.border,
        styles.glow,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', styles.text.replace('text-', 'bg-'))} />
      {status}
    </div>
  );
};

export default ProjectStatusBadge;

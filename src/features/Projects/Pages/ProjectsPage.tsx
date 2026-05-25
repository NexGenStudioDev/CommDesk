import PagePlaceholder from "@/features/Member/v1/Components/PagePlaceholder";
import { AccessDenied, PermissionBoundary, PermissionLoading, Project_Permissions } from "@/permissions";

const ProjectsPage = () => {
  return (
    <PermissionBoundary
      permission={Project_Permissions.VIEW_PROJECT}
      loadingFallback={<PermissionLoading />}
      unauthorizedFallback={
        <AccessDenied
          title="Project access is unavailable"
          description="Project pages are only shown to users with project visibility permission."
        />
      }
    >
      <div className="flex item-center h-full w-full justify-center">
        <div className="w-1/2 h-1/2 flex items-center justify-center ">
          <PagePlaceholder
            title="Projects"
            description="Manage your projects, tasks, and timelines."
          />
        </div>
      </div>
    </PermissionBoundary>
  );
};

export default ProjectsPage;

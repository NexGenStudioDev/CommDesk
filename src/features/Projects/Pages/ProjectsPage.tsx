import PagePlaceholder from "@/features/Member/v1/Components/PagePlaceholder";

const ProjectsPage = () => {
  return (
    <div className="flex item-center h-full w-full justify-center">
      <div className="w-1/2 h-1/2 flex items-center justify-center ">
        <PagePlaceholder
          title="Projects"
          description="Manage your projects, tasks, and timelines."
        />
      </div>
    </div>
  );
};

export default ProjectsPage;

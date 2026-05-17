import ContactHeader from "../Section/ContactHeader";
import { AccessDenied, Contact_Permissions, PermissionBoundary, PermissionLoading } from "@/permissions";
import InternalDirectoryTable from "../Section/InternalDirectoryTable";
import Support from "../Components/Support";

const Contact = () => {
  return (
    <div className="w-full h-full min-h-0 flex flex-col cd-page">
      <ContactHeader />
      <PermissionBoundary
        permission={Contact_Permissions.VIEW_CONTACT_DIRECTORY}
        loadingFallback={<PermissionLoading />}
        unauthorizedFallback={
          <AccessDenied
            title="Contact directory access is unavailable"
            description="This area is only shown to users who can view the internal support directory."
          />
        }
      >
        <div className="w-full min-h-0 flex flex-col xl:flex-row p-4 sm:p-5 lg:p-6 gap-4 lg:gap-6">
          <div className="w-full min-w-0 xl:flex-1">
            <InternalDirectoryTable />
          </div>
          <div className="w-full min-w-0 xl:max-w-[30rem] flex">
            <Support />
          </div>
        </div>
      </PermissionBoundary>
    </div>
  );
};

export default Contact;

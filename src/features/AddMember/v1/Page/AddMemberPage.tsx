import { FormProvider } from "react-hook-form";
import AddMemberHeader from "../Component/AddMemberHeader";
import Administrative_MetaData from "../Component/Administrative_MetaData";
import Community_Involvement from "../Component/Community_Involment";
import PersonalInfoCard from "../Sections/PersonalInfoCard";
import ProfessionalDetails from "../Sections/ProfessionalDetails";
import { useAddMember } from "../hook/useAddMember";

const AddMemberPage = () => {
  const methods = useAddMember();

  const handleCreateMember = methods.handleSubmit((data) => {
    try {
      alert("Member created successfully!");
      console.log("Add member submit", data);
    } catch (error) {
      console.error("Error creating member:", error);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="w-full flex flex-col cd-page">
        <AddMemberHeader onCreate={handleCreateMember} onDiscard={() => methods.reset()} />
        <div className="flex p-8 gap-8 w-full flex-col lg:flex-row items-start overflow-x-hidden">
          <div className="w-full lg:w-[65%] h-full flex-col">
            <PersonalInfoCard />
            <ProfessionalDetails />
            <Community_Involvement />
          </div>
          <Administrative_MetaData />
        </div>
      </div>
    </FormProvider>
  );
};

export default AddMemberPage;

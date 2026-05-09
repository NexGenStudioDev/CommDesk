import AddMemberHeader from "../Component/AddMemberHeader";
import Administrative_MetaData from "../Component/Administrative_MetaData";
import Community_Involvement from "../Component/Community_Involment";
import PersonalInfoCard from "../Sections/PersonalInfoCard";
import ProfessionalDetails from "../Sections/ProfessionalDetails";

const AddMemberPage = () => {
  return (
    <div className="w-full flex flex-col cd-page">
      <AddMemberHeader />
      <div className="flex p-8 gap-8 w-full flex-col lg:flex-row items-start overflow-x-hidden">
        <div className="w-full lg:w-[65%] h-full flex-col">
          <PersonalInfoCard />
          <ProfessionalDetails />
          <Community_Involvement />
        </div>
        <Administrative_MetaData />
      </div>
    </div>
  );
};

export default AddMemberPage;

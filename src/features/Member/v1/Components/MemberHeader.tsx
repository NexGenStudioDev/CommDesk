import Button from "@/Component/ui/Button";
import { IoPersonAdd } from "react-icons/io5";
import { useNavigate } from "react-router";

const MemberHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-[3vh] bg-white border-b-[1px] border-gray-300 flex   text-xl font-bold  justify-between ">
      <div className="w-1/2 h-full  flex flex-col justify-between gap-2">
        <h1 className="text-lg sm:text-[2.5vw] lg:text-2xl  font-bold text-gray-800  ml-5 mt-2">
          Member Managements
        </h1>
        <span className="text-sm  lg:text-md  w-fit text-gray-600 ml-5 bg-gray-200 rounded-2xl py-1 px-3">
          1,248 Members
        </span>
      </div>
      <div className="w-1/3 h-full flex justify-end items-center gap-2 px-5">
        <Button
          text="Add Member"
          onClick={() => navigate("/org//add-member")}
          backgroundColor="#4f46e4"
          icon={<IoPersonAdd />}
        />

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsPJ9cm0-r5p50py0yUzvM5ZtEB-xWoJRPRA&s"
          className="w-[4.5vh] h-[4.5vh] rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default MemberHeader;

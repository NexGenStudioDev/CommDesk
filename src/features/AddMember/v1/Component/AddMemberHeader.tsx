import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router";
import Button from "../../../../Component/ui/Button";
import { memo } from "react";

const AddMemberHeader = () => {
  return (
    <div className="py-[3vh] w-full  bg-white border-b border-gray-300 flex    text-xl font-bold  justify-between">
      <Link to="/member" className="w-1/3 h-full  flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800  ml-5 mt-2">
          <IoMdArrowRoundBack className="mr-[3vw] inline" />
          Create New Member
        </h1>
      </Link>

      <div className="w-[40%] h-full mr-[3vw] flex justify-end  gap-3  ">
        <Button
          text="Discard Draft"
          onClick={() => alert("Discard Draft clicked")}
          backgroundColor="#ffffff"
          textColor="black"
        />

        <Button
          text="Create Member"
          onClick={() => alert("Create Member clicked")}
          backgroundColor="#4f46e4"
        />
      </div>
    </div>
  );
};

export default memo(AddMemberHeader);

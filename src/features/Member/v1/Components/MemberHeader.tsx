import { IoPersonAdd } from "react-icons/io5";
import { Link } from "react-router";

const MemberHeader = () => {
  return (
    <div className="w-full py-[3vh] bg-white border-b-[1px] border-gray-300 flex   text-xl font-bold  justify-between ">
      <div className="w-1/3 h-full  flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800  ml-5 mt-2">Member Managements</h1>
        <span className="text-sm text-gray-500 ml-5 bg-gray-200 rounded-2xl py-1 px-3">
          1,248 Members
        </span>
      </div>
      <div className="w-1/3 h-full flex justify-end items-center gap-2 px-5">
        <Link
          to="/add-member"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex gap-2 duration-300 mr-4 items-center"
        >
          {" "}
          <IoPersonAdd /> Add Member
        </Link>

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsPJ9cm0-r5p50py0yUzvM5ZtEB-xWoJRPRA&s"
          className="w-[4.5vh] h-[4.5vh] rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default MemberHeader;

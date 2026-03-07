import React, { memo } from "react";
import { Input } from "../../../../Component/ui/Input";
import { getTheme } from "../../../../config/them.config";
import Url from "../../../../Component/ui/Url";
import { CiCamera } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

const PersonalInfoCard = () => {
  let theme = getTheme("light");

  let [firstName, setFirstName] = React.useState("");
  let [lastName, setLastName] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [profileUrl, setProfileUrl] = React.useState("example.com");

  return (
    <div
      className="bg-white w-full flex flex-col border-2 rounded-lg self-center mt-5 p-7"
      style={{
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <FaUser className="text-[#4f46e5]" />
        Personal Information
      </span>
      <div className="flex gap-4  ">
        <div className="w-[18%] flex flex-col gap-2  mb-4">
          <div
            className="w-[130px] h-[150px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-2xl"
            style={{
              borderColor: theme.borderColor.primary,
              backgroundColor: theme.background.secondary,
            }}
          >
            <CiCamera className="text-4xl text-gray-400" />
            <p className="text-2xl text-gray-400">Upload</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-2  p-4 mb-4 text-md">
          <p className="font-bold ">Profile Photo</p>
          <p className="w-full  text-gray-500">
            Recommended size is 400x400px. Max file size is 5MB. Allowed formats are
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-[3.5vh]">
        <div className="flex gap-[2.5vw]">
          <Input
            label="First Name"
            name="firstName"
            className="w-[40%]"
            placeholder="Enter first name"
            value={firstName}
            onChange={(_, value) => setFirstName(value)}
          />
          <Input
            label="Last Name"
            name="lastName"
            className="w-[40%]"
            placeholder="Enter last name"
            value={lastName}
            onChange={(_, value) => setLastName(value)}
          />
        </div>

        <div className="flex gap-[2.5vw] items-center">
          <Input
            label="Email"
            name="email"
            className="w-[40%]"
            placeholder="Enter email"
            value={email}
            onChange={(_, value) => setEmail(value)}
          />

          <div className="w-1/2 flex flex-col gap-2  mb-4">
            <div className="Label">Public Profile URL</div>
            <Url
              protocol="http://"
              domain={profileUrl}
              className="w-[80%] text-2xl  flex"
              setDomain={(domain) => setProfileUrl(domain)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PersonalInfoCard);

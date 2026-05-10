import React, { memo } from "react";
import { Input } from "../../../../Component/ui/Input";
import Url from "../../../../Component/ui/Url";
import { CiCamera } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

const PersonalInfoCard = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [profileUrl, setProfileUrl] = React.useState("example.com");

  return (
    <div
      className="w-full flex flex-col rounded-xl self-center mt-5 p-7"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <span
        className="font-extrabold text-xl uppercase mb-[3vh] flex items-center gap-3"
        style={{ color: "var(--cd-text)" }}
      >
        <FaUser style={{ color: "var(--cd-primary)" }} />
        Personal Information
      </span>

      <div className="flex gap-4">
        <div className="w-[18%] flex flex-col gap-2 mb-4">
          <div
            className="w-[130px] h-[150px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center"
            style={{
              borderColor: "var(--cd-border)",
              backgroundColor: "var(--cd-surface-2)",
            }}
          >
            <CiCamera className="text-4xl" style={{ color: "var(--cd-text-muted)" }} />
            <p className="text-sm mt-1" style={{ color: "var(--cd-text-muted)" }}>
              Upload
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-2 p-4 mb-4">
          <p className="font-bold" style={{ color: "var(--cd-text)" }}>
            Profile Photo
          </p>
          <p className="w-full text-sm" style={{ color: "var(--cd-text-2)" }}>
            Recommended size is 400x400px. Max file size is 5MB. Allowed formats are JPG, PNG.
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
          <div className="w-1/2 flex flex-col gap-2 mb-4">
            <div
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--cd-text-2)" }}
            >
              Public Profile URL
            </div>
            <Url
              protocol="http://"
              domain={profileUrl}
              className="w-[80%] text-2xl flex"
              setDomain={(domain) => setProfileUrl(domain)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PersonalInfoCard);

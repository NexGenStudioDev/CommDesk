import React, { memo } from "react";
import { getTheme } from "../../../../config/them.config";
import { IoBag } from "react-icons/io5";
import { Input } from "../../../../Component/ui/Input";
import DropDown from "../../../../Component/ui/DropDown";
import { Roles } from "../Constant/Role.constant";
import { SkillColor } from "../Constant/Skill.constant";

const ProfessionalDetails = () => {
  let theme = getTheme("light");

  const [SkillInput, setSkillInput] = React.useState("");
  const [, setSelectedRole] = React.useState("");
  const [Location, setLocation] = React.useState("");
  const [Skills, setSkills] = React.useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const skill = SkillInput.trim();
      if (skill !== "" && !Skills.includes(skill)) {
        setSkills((prev) => [...prev, skill]);
        setSkillInput("");
      }
    }
  };

  const getSkillColor = (skill: string) => {
    const index = Skills.indexOf(skill);
    return SkillColor[index % SkillColor.length];
  };

  return (
    <div
      className="bg-white w-full flex flex-col border-2 rounded-lg self-center mt-5 p-7"
      style={{
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <IoBag className="text-[#4f46e5]" />
        Professional Details
      </span>

      <div className="flex mt-[3.5vh]">
        <div className="flex flex-col gap-2 w-[40%]">
          <p className="text-md text-gray-400 uppercase font-semibold">Primary Role</p>

          <DropDown options={Roles} onSelect={(opt: string) => setSelectedRole(opt)} />
        </div>

        <div className="flex flex-col w-[40%]">
          <Input
            label="CITY / LOCATION"
            placeholder="San Francisco CA"
            name="location"
            value={Location}
            onChange={(_, value) => setLocation(value)}
          />
        </div>
      </div>

      <div className="flex mt-[1vh] w-full">
        <div className="flex flex-col w-full">
          <Input
            name="skills"
            label="skills & expertise"
            placeholder="Type a skill and press Enter"
            value={SkillInput}
            className="w-full"
            onKeyDown={handleKeyDown}
            onChange={(_, value) => setSkillInput(value)}
          />

          <div className="flex gap-2 mt-2 flex-wrap">
            {Skills.map((skill, index) => (
              <div
                key={index}
                className={` text-gray-500 font-bold px-3 py-2 rounded-xl text-lg flex items-center gap-2`}
                style={{ backgroundColor: getSkillColor(skill) }}
              >
                {skill}
                <span
                  className="cursor-pointer text-2xl"
                  onClick={() => setSkills((prev) => prev.filter((_, i) => i !== index))}
                >
                  &times;
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfessionalDetails);

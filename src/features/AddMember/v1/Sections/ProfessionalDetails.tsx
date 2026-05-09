import React, { memo } from "react";
import { IoBag } from "react-icons/io5";
import { Input } from "../../../../Component/ui/Input";
import DropDown from "../../../../Component/ui/DropDown";
import { Roles } from "../Constant/Role.constant";
import { SkillColor } from "../Constant/Skill.constant";

const ProfessionalDetails = () => {
  const [skillInput, setSkillInput] = React.useState("");
  const [, setSelectedRole] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const skill = skillInput.trim();
      if (skill !== "" && !skills.includes(skill)) {
        setSkills((prev) => [...prev, skill]);
        setSkillInput("");
      }
    }
  };

  const getSkillColor = (skill: string) => {
    const index = skills.indexOf(skill);
    return SkillColor[index % SkillColor.length];
  };

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
        <IoBag style={{ color: "var(--cd-primary)" }} />
        Professional Details
      </span>

      <div className="flex mt-[3.5vh] gap-5">
        <div className="flex flex-col gap-2 w-[40%]">
          <p className="text-xs font-semibold uppercase" style={{ color: "var(--cd-text-2)" }}>
            Primary Role
          </p>
          <DropDown options={Roles} onSelect={(opt: string) => setSelectedRole(opt)} />
        </div>

        <div className="flex flex-col w-[40%]">
          <Input
            label="City / Location"
            placeholder="San Francisco, CA"
            name="location"
            value={location}
            onChange={(_, value) => setLocation(value)}
          />
        </div>
      </div>

      <div className="flex mt-[1vh] w-full">
        <div className="flex flex-col w-full">
          <Input
            name="skills"
            label="Skills & Expertise"
            placeholder="Type a skill and press Enter"
            value={skillInput}
            className="w-full"
            onKeyDown={handleKeyDown}
            onChange={(_, value) => setSkillInput(value)}
          />

          <div className="flex gap-2 mt-2 flex-wrap">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="font-semibold px-3 py-1.5 rounded-xl text-sm flex items-center gap-2"
                style={{
                  backgroundColor: getSkillColor(skill),
                  color: "var(--cd-text)",
                }}
              >
                {skill}
                <span
                  className="cursor-pointer text-base leading-none"
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

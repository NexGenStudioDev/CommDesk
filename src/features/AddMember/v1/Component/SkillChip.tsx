type SkillChipProps = {
  skill: string;
};

const SkillChip = (props: SkillChipProps) => {
  return (
    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{props.skill}</div>
  );
};

export default SkillChip;

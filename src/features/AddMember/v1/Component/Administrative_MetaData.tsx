import MemberShip_Status from "./MemberShip_Status";
import AccessLevel from "./AccessLevel";

const Administrative_MetaData = () => {
  return (
    <div
      className="w-full lg:w-[30%] h-full flex flex-col rounded-xl self-center mt-3 lg:mt-10 p-7"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <p className="uppercase text-lg font-bold" style={{ color: "var(--cd-text)" }}>
        Administrative Metadata
      </p>
      <MemberShip_Status />
      <AccessLevel />
    </div>
  );
};

export default Administrative_MetaData;

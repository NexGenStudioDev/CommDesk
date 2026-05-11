const PermissionHeader = () => {
  return (
    <div
      className="w-full py-[3vh] border-b flex text-xl font-bold justify-between"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <div className="w-1/2 h-full flex flex-col justify-between gap-2">
        <h1
          className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-5 mt-2"
          style={{ color: "var(--cd-text)" }}
        >
          Permission Management
        </h1>
        <span
          className="text-sm w-fit ml-5 rounded-2xl py-1 px-3"
          style={{
            backgroundColor: "var(--cd-surface-2)",
            color: "var(--cd-text-2)",
          }}
        >
          Manage roles and permissions for all members
        </span>
      </div>
      <div className="w-1/3 h-full flex justify-end items-center gap-3 px-5">
        <img
          src={`https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff`}
          className="w-9 h-9 rounded-full object-cover"
          alt="User avatar"
        />
      </div>
    </div>
  );
};

export default PermissionHeader;
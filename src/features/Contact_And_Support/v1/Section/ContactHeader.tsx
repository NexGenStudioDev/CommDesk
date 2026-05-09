const ContactHeader = () => {
  return (
    <div
      className="py-[3vh] border-b flex text-xl font-bold justify-between"
      style={{
        backgroundColor: "var(--cd-surface)",
        borderColor: "var(--cd-border)",
      }}
    >
      <span>
        <h1
          className="text-lg sm:text-[2.5vw] lg:text-2xl font-bold ml-5 mt-2"
          style={{ color: "var(--cd-text)" }}
        >
          Admin Contact & Support
        </h1>
      </span>
    </div>
  );
};

export default ContactHeader;

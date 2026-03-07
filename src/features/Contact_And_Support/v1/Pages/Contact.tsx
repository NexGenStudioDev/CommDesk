import { getTheme } from "@/config/them.config";

const Contact = () => {
  let theme = getTheme("light");
  return (
    <div className="w-full h-full flex flex-col" style={{ background: theme.background.secondary }}>
      Contact
    </div>
  );
};

export default Contact;

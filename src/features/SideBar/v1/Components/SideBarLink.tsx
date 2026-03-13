import React from "react";
import { getTheme } from "../../../../config/them.config";
import { Link } from "react-router";

type SideBarLinkProps = {
  icon: React.ReactNode;
  text: string;
  link?: string | undefined;
};

const SideBarLink = ({ icon, text, link }: SideBarLinkProps) => {
  const LinkRef = React.useRef<HTMLAnchorElement>(null);
  const theme = getTheme("light");

  return (
    <Link
      to={link || "/"}
      ref={LinkRef}
      className="sidebar-link flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
      style={{
        fontFamily: theme.fontFamily.primary,
        color: theme.textColor.secondary,
        borderColor: theme.borderColor.primary,
        background: "transparent",
      }}
      onMouseOver={() => {
        if (LinkRef.current) {
          LinkRef.current.style.backgroundColor = theme.background.secondary;
          LinkRef.current.style.color = theme.textColor.primary;
        }
      }}
      onMouseOut={() => {
        if (LinkRef.current) {
          LinkRef.current.style.backgroundColor = "transparent";
          LinkRef.current.style.color = theme.textColor.secondary;
        }
      }}
    >
      <div
        className="icon flex items-center justify-center text-[2em] lg:text-[1.7em]"
        style={{ minWidth: 32 }}
      >
        {icon}
      </div>
      <span className="link-text hidden lg:block " style={{ marginLeft: 8, fontSize: "1.1em", fontWeight: 500 }}>
        {text}
      </span>
    </Link>
  );
};

export default SideBarLink;

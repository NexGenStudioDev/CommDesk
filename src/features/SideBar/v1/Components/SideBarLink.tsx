import React from "react";
import { Link, useLocation } from "react-router";

type SideBarLinkProps = {
  icon: React.ReactNode;
  text: string;
  link?: string;
};

const SideBarLink = ({ icon, text, link = "/" }: SideBarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === link || (link !== "/org" && pathname.startsWith(link));

  return (
    <Link
      to={link}
      className="cd-nav-link"
      style={
        isActive
          ? {
              backgroundColor: "var(--cd-primary-subtle)",
              color: "var(--cd-primary-text)",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-center text-xl" style={{ minWidth: 24 }}>
        {icon}
      </div>
      <span className="hidden lg:block text-[0.9375rem] font-medium">{text}</span>
    </Link>
  );
};

export default SideBarLink;

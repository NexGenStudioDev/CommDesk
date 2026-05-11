import { RiContactsBookFill } from "react-icons/ri";
import { MdDashboard, MdEvent, MdGroup, MdSettings, MdWork, MdSecurity } from "react-icons/md";
import { useTheme } from "@/theme";
import { ThemeToggle } from "@/Component/ui/ThemeToggle";

import SideBarLink from "../Components/SideBarLink";
import { dashboardData } from "@/features/Member/v1/mock/dashboardData";

const SideBar = () => {
  const { theme } = useTheme();

  return (
    <div
      className="w-[25%] 2xl:w-[18%] min-h-screen hidden lg:flex flex-col"
      style={{
        backgroundColor: theme.bg.surface,
        borderRight: `1px solid ${theme.border.default}`,
      }}
    >
      {/* Logo */}
      <div
        className="p-2 border-b min-h-21 w-full flex items-center justify-center"
        style={{ borderColor: theme.border.default }}
      >
        <img
          src="/logoWithoutText.png"
          alt="CommDesk logo"
          className="w-[6vw] h-full object-cover shrink-0"
        />
        <h1
          className="font-bold h-fit text-[1.40em] leading-none inter"
          style={{ color: theme.primary.default }}
        >
          CommDesk
        </h1>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1 p-4 flex-1 w-full">
        <p
          className="text-xs font-semibold uppercase tracking-widest px-4 py-2"
          style={{ color: theme.text.muted }}
        >
          Operations
        </p>

        <SideBarLink icon={<MdDashboard />} text="Dashboard" link="/org/dashboard" />
        <SideBarLink icon={<MdWork />} text="Projects" link="/org/projects" />
        <SideBarLink icon={<MdGroup />} text="Teams" link="/org/member" />
        <SideBarLink icon={<MdEvent />} text="Events" link="/org/events" />
        <SideBarLink icon={<RiContactsBookFill />} text="Contact Submissions" link="/org/contact" />
        <SideBarLink icon={<MdSecurity />} text="Permissions" link="/org/permissions" />

        {/* Footer */}
        <div
          className="mt-auto w-full border-t flex flex-col py-5"
          style={{ borderColor: theme.border.default }}
        >
          <div className="flex items-center justify-between mb-2">
            <SideBarLink icon={<MdSettings />} text="Settings" link="/org" />
            <ThemeToggle />
          </div>

          <div
            className="mt-3 w-full rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors duration-150"
            style={{ backgroundColor: theme.bg.surfaceSecondary }}
          >
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
              <p className="text-sm font-semibold truncate" style={{ color: theme.text.primary }}>
                {dashboardData.user.name}
              </p>
              <p className="text-xs truncate font-medium" style={{ color: theme.primary.default }}>
                {dashboardData.user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

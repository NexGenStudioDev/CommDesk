import { RiContactsBookFill } from "react-icons/ri";
import { getTheme } from "../../../../config/them.config";
import SideBarLink from "../Components/SideBarLink";
import { MdDashboard, MdEvent, MdGroup, MdSettings, MdWork } from "react-icons/md";

const SideBar = () => {
  let theme = getTheme("light");

  return (
    <div
      className="sidebar w-[25%] 2xl:w-[18%] min-h-screen hidden lg:flex flex-col border-r"
      style={{
        borderColor: theme.borderColor.primary,
        background: theme.background.primary,
      }}
    >
      <div
        className="sidebar-header p-2 border-b border-t-2  min-h-21 w-full flex  items-center justify-center"
        style={{ borderColor: theme.borderColor.primary }}
      >
        <img
          src="/logoWithoutText.png"
          alt="CommDesk logo"
          className="w-[6vw] h-full  object-cover shrink-0"
        />

        <h1
          className="font-bold h-fit  text-[1.40em] leading-0"
          style={{
            color: theme.textColor.tersiary,
            fontFamily: theme.fontFamily.primary,
          }}
        >
          CommDesk
        </h1>
      </div>
      <div className="sidebar-content flex flex-col gap-3 p-4 flex-1 w-full">
        {/* Sidebar content goes here */}
        <h1>Operations</h1>
        <SideBarLink icon={<MdDashboard />} text="Dashboard" />
        <SideBarLink icon={<MdWork />} text="Projects" />
        <SideBarLink icon={<MdGroup />} text="Teams" link="/org/member" />
        <SideBarLink icon={<MdEvent />} text="Events" link="/org/events" />
        <SideBarLink icon={<RiContactsBookFill />} text="Contact Submissions" link="/org/contact" />

        <div
          className="mt-auto w-full border-t flex flex-col py-5"
          style={{ borderColor: theme.borderColor.primary }}
        >
          <div className="w-full">
            <SideBarLink icon={<MdSettings />} text="Settings" />
          </div>

          <div
            className="Profile mt-4 w-full rounded-lg  p-3 flex items-center gap-3 cursor-pointer  bg-[#f0f4fc]"
            style={{
              borderColor: theme.borderColor.primary,
            }}
          >
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />

            <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
              <p
                className="text-sm font-semibold truncate"
                style={{
                  color: theme.textColor.primary,
                  fontFamily: theme.fontFamily.primary,
                }}
              >
                John Doe
              </p>
              <p
                className="text-xs truncate font-black"
                style={{
                  color: theme.textColor.tersiary,
                  fontFamily: theme.fontFamily.primary,
                }}
              >
                Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

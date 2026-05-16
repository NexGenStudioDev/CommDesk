import useAuthStore from "../Auth/v1/Store/Auth.Store";
import SideBar from "../SideBar/v1/Section/SideBar";
import { Outlet, redirect } from "react-router";
import BotamNavBar from "../SideBar/v1/Section/BotamNavBar";

import { useMemo } from "react";

const Organisation_Template = () => {

  let user = useAuthStore((state) => state.user);

  useMemo(() => {

    console.log("User in Organisation_Template-->:", user);
   

      if (user?.role) {
        if (user.role !== "organization") {
          redirect("/");
        }
      }
  }, [user]);

  return (
    <div className="flex w-screen min-h-screen overflow-x-hidden items-stretch cd-page">
      <SideBar />
      <BotamNavBar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-row pb-32 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Organisation_Template;

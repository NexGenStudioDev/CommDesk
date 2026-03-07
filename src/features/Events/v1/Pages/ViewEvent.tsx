import { getTheme } from "@/config/them.config";
import React from "react";
import Event_View_Header from "../Sections/Event_View_Header";

const ViewEvent = () => {
  let theme = getTheme("light");
  return (
    <div className="w-full h-full flex flex-col" style={{ background: theme.background.secondary }}>
      <Event_View_Header />
    </div>
  );
};

export default ViewEvent;

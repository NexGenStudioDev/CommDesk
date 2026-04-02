import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import DashboardPage from "./features/Dashboard/v1/Pages/DashboardPage";
import MemberPage from "./features/Member/v1/Pages/MemberPage";
import LoginUserTemplate from "./features/template/LoginUserTemplate";
import AddMemberPage from "./features/AddMember/v1/Page/AddMemberPage";
import CreateNewEvent from "./features/Events/v1/Pages/CreateNewEvent";
import Contact from "./features/Contact_And_Support/v1/Pages/Contact";
import ViewEvent from "./features/Events/v1/Pages/ViewEvent";
import { startAutoUpdater } from "./system/updater/autoUpdater";
import LoginPage from "./features/Auth/v1/Pages/LoginPage";
import SignUpPage from "./features/Auth/v1/Pages/SignUpPage";

function App() {
  useEffect(() => {
    void startAutoUpdater();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected / Org Routes */}
        <Route path="/org" element={<LoginUserTemplate />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="member" element={<MemberPage />} />
          <Route path="add-member" element={<AddMemberPage />} />
          <Route path="events" element={<ViewEvent />} />
          <Route path="create-event" element={<CreateNewEvent />} />
          <Route path="contact" element={<Contact />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

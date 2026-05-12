import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

function renderWithRouter(
  user: { role: string } | null,
  allowedRoles: string[],
  initialPath = "/protected",
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute user={user} allowedRoles={allowedRoles}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div>Login Page</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects to / when user is null", () => {
    renderWithRouter(null, ["Admin"]);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /unauthorized when user role is not in allowedRoles", () => {
    renderWithRouter({ role: "Member" }, ["Admin"]);
    expect(screen.getByText("Unauthorized Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when user role is in allowedRoles", () => {
    renderWithRouter({ role: "Admin" }, ["Admin"]);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children when user role matches one of multiple allowed roles", () => {
    renderWithRouter({ role: "Organizer" }, ["Admin", "Organizer", "Volunteer"]);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects when user role does not match any of multiple allowed roles", () => {
    renderWithRouter({ role: "Visitor" }, ["Admin", "Organizer"]);
    expect(screen.getByText("Unauthorized Page")).toBeInTheDocument();
  });

  it("renders children for Member role when Member is allowed", () => {
    renderWithRouter({ role: "Member" }, ["Member"]);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

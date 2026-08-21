import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

function renderProtectedRoute(allowedRoles) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/" element={<div>Login Page</div>} />

        <Route
          path="/unauthorized"
          element={<div>Access Denied</div>}
        />

        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute Tests", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("redirects unauthenticated users to login", () => {
    renderProtectedRoute(["Passenger"]);

    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();
  });

  test("allows Passenger to access Passenger route", () => {
    localStorage.setItem(
      "token",
      "mock-passenger-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "passenger-001",
        email: "passenger@airport.com",
        role: "Passenger",
      })
    );

    renderProtectedRoute(["Passenger"]);

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();
  });

  test("denies Passenger access to Staff route", () => {
    localStorage.setItem(
      "token",
      "mock-passenger-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "passenger-001",
        email: "passenger@airport.com",
        role: "Passenger",
      })
    );

    renderProtectedRoute(["Staff"]);

    expect(
      screen.getByText("Access Denied")
    ).toBeInTheDocument();
  });

  test("allows Staff to access Staff route", () => {
    localStorage.setItem(
      "token",
      "mock-staff-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "staff-001",
        email: "staff@airport.com",
        role: "Staff",
      })
    );

    renderProtectedRoute(["Staff"]);

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();
  });

  test("denies Staff access to Passenger route", () => {
    localStorage.setItem(
      "token",
      "mock-staff-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "staff-001",
        email: "staff@airport.com",
        role: "Staff",
      })
    );

    renderProtectedRoute(["Passenger"]);

    expect(
      screen.getByText("Access Denied")
    ).toBeInTheDocument();
  });

  test("redirects to login when stored user data is invalid", () => {
    localStorage.setItem(
      "token",
      "mock-token"
    );

    localStorage.setItem(
      "user",
      "invalid-json"
    );

    renderProtectedRoute(["Passenger"]);

    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();

    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();
  });
});
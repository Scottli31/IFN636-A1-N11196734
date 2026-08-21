import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import LogoutButton from "./LogoutButton";

function renderLogoutButton() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={<LogoutButton />}
        />

        <Route
          path="/"
          element={<div>Login Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("LogoutButton Tests", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("renders the logout button", () => {
    renderLogoutButton();

    expect(
      screen.getByRole("button", {
        name: /log out/i,
      })
    ).toBeInTheDocument();
  });

  test("clears authentication data and redirects to login", () => {
    localStorage.setItem(
      "token",
      "mock-jwt-token"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "passenger-001",
        email: "passenger@airport.com",
        role: "Passenger",
      })
    );

    renderLogoutButton();

    fireEvent.click(
      screen.getByRole("button", {
        name: /log out/i,
      })
    );

    // Authentication data should be removed
    expect(
      localStorage.getItem("token")
    ).toBeNull();

    expect(
      localStorage.getItem("user")
    ).toBeNull();

    // User should be redirected to login
    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();
  });
});
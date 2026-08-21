import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders the airport login page", () => {
  render(<App />);

  expect(
    screen.getByText("Airport Check-in")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Passenger & Staff Portal")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: "Log in" })
  ).toBeInTheDocument();
});
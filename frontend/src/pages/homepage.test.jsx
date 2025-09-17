import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./Homepage";

test("Dummy test", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <HomePage />
    </MemoryRouter>
  );
  expect(
    screen.getByText("Real-time Attention Tracking for Smarter Virtual Classes")
  ).toBeInTheDocument();
});

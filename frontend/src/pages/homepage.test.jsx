import { screen, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Homepage";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

function makeRouter(routes = []) {
  return createMemoryRouter(
    [
      { path: "/", element: <HomePage /> },
      { path: "/teacher-dashboard", element: <div>Teacher Dashboard</div> },
      { path: "/Join", element: <div>Join Session</div> },
      ...routes,
    ],
    { initialEntries: ["/"] }
  );
}
describe("Homepage Tests", () => {
  it("Teacher button redirects to Teacher Dashboard", async () => {
    const router = makeRouter(); // CHANGED: use helper, no ...routes
    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const teacherBtn = screen.getByRole("button", {
      name: /teacher.*create session/i,
    });

    await user.click(teacherBtn);
    expect(await screen.findByText("Teacher Dashboard")).toBeInTheDocument();
  });

  it("Student button redirects to Join", async () => {
    const router = makeRouter();
    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const studentBtn = screen.getByRole("button", {
      name: /student.*join session/i,
    });

    await user.click(studentBtn);
    expect(await screen.findByText("Join Session")).toBeInTheDocument();
  });
});

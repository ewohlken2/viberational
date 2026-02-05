import { render, screen } from "@testing-library/react";
import ContactPage from "../contact/page";

jest.mock("../wrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

test("renders contact form fields and submit button", () => {
  render(<ContactPage />);

  expect(
    screen.getByRole("heading", { name: /contact me/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /send message/i })
  ).toBeInTheDocument();
});

import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders form and displays error for empty input", async () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /full-stack calculator/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("A")).toBeInTheDocument();

  const calcBtn = screen.getByRole("button", { name: /calculate/i });
  fireEvent.click(calcBtn);

  expect(await screen.findByRole("alert")).toHaveTextContent(/valid numbers/i);
});
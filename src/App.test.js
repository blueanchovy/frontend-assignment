import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders Kickstarter projects title", () => {
    render(<App />);
    const titleElement = screen.getByText(/Kickstarter projects/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders pagination buttons", () => {
    render(<App />);
    const previousButton = screen.getByText(/Previous/i);
    const nextButton = screen.getByText(/Next/i);
    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  test("previous button is disabled on first page", async () => {
    render(<App />);
    const previousButton = await screen.findByText(/Previous/i);
    expect(previousButton).toBeDisabled();
  });
});

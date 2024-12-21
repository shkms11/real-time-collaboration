import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
    it("renders React App heading", () => {
        render(<App />);
        const headingElement = screen.getByText(/React App/i);
        expect(headingElement).toBeInTheDocument();
    });
});

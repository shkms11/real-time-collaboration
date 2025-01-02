import { describe, it, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

test.skip("skipped test", () => {
    // This test will be skipped for now
});
describe("App Component", () => {
    it("renders React App heading", () => {
        render(<App />);
        const headingElement = screen.getByText(
            /Real-Time Collaboration Test/i
        );
        expect(headingElement).toBeInTheDocument();
    });
});

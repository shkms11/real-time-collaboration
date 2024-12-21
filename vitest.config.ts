import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom", // Mocks a browser environment for testing
        globals: true, // Allows using global variables like describe, it, expect without importing them
        setupFiles: "./src/setupTests.ts", // Setup file for global configurations
    },
});

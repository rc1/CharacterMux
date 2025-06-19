import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    // Ensure assets are inlined
    cssCodeSplit: false,
    assetsInlineLimit: Infinity,
  },
});

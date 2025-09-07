import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 🔥 allows refresh in dev
  },
  preview: {
    historyApiFallback: true, // 🔥 allows refresh in prod
  },
  build: {
    outDir: "dist", // make sure build goes to dist
  },
});

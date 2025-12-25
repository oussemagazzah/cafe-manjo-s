import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // For GitHub Pages: use repo name as base path, or "/" for custom domain
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/cafe-manjo-s/' : '/'),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

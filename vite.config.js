import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        admin: resolve(root, "admin", "index.html"),
      },
    },
  },
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const outDir = resolve(__dirname, "..", "nui");
  const env = loadEnv(mode, process.cwd(), "");

  const isProduction = mode === "production";
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    base: "./",
    publicDir: "./public",
    build: {
      minify: isProduction,
      assetsDir: "./",
      emptyOutDir: true,
      outDir,
    },
  };
});

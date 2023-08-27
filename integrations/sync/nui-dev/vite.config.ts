import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { minify } from "html-minifier";

function minifyHtml() {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return minify(html, {
        collapseWhitespace: true,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const outDir = resolve(__dirname, "..", "nui");

  const isProduction = mode === "production";
  return {
    plugins: [react(), minifyHtml()],
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

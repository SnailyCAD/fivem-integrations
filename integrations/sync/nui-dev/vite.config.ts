import { defineConfig, loadEnv } from "vite";
import { minify } from "html-minifier";
import { resolve } from "node:path";

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

  const env = loadEnv(mode, process.cwd(), "");

  const isProduction = mode === "production";
  return {
    define: {
      "process.env": env,
    },
    plugins: [isProduction && minifyHtml()],
    base: "./",
    publicDir: "./public",
    build: {
      minify: isProduction,
      assetsDir: "./",
      emptyOutDir: true,
      outDir,
      rollupOptions: {
        output: {
          entryFileNames: `js/[name].js`,
          chunkFileNames: `js/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
    },
  };
});

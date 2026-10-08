import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { defineConfig, type Connect, type Plugin } from "vite";

// Match GitHub Pages' real 404 response in local dev and production previews.
function harborNotFound(): Plugin {
  const install = (server: { config: { publicDir: string }; middlewares: Connect.Server }) => {
    server.middlewares.use((request, response, next) => {
      if (!["GET", "HEAD"].includes(request.method ?? "") || !request.headers.accept?.includes("text/html")) return next();
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      if (["/", "/index.html", "/404.html"].includes(pathname) || pathname.startsWith("/@") || pathname.startsWith("/src/") || pathname.startsWith("/node_modules/")) return next();
      const assetPath = resolve(server.config.publicDir, `.${pathname}`);
      if (assetPath.startsWith(`${server.config.publicDir}${sep}`) && existsSync(assetPath)) return next();
      readFile(resolve(server.config.publicDir, "404.html"), "utf8").then((html) => {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(request.method === "HEAD" ? undefined : html);
      }).catch(next);
    });
  };
  return { name: "harbor-not-found", configureServer: install, configurePreviewServer: install };
}

export default defineConfig({
  base: "./",
  plugins: [react(), harborNotFound()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
});

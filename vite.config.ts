import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
  build: {
    chunkSizeWarningLimit: 850,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const lesson = id.match(/\/src\/content\/domain([1-6])\/l(\d+)\.ts$/);
          if (lesson)
            return `lessons-d${lesson[1]}-${Math.floor((Number(lesson[2]) - 1) / 4) + 1}`;
          if (/\/src\/content\/domain[1-6]\//.test(id))
            return "content-helpers";
          if (/\/src\/content\/domain[1-6]\.ts$/.test(id))
            return "content-index";
          if (id.includes("/node_modules/"))
            return id.includes("@mui") || id.includes("@emotion")
              ? "mui"
              : "framework";
        },
      },
    },
  },
});

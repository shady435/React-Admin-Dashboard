import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => ({
  plugins: [tailwindcss(), react()],

  base: process.env.VERCEL ? "/" : "/Dashboardd/",

  server: {
    port: 5173,
    strictPort: true,
  },
}));
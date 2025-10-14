import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://api.github.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
    },
  },
  // Add only these new configuration lines
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactrouter: ["react-router", "react-router-dom"],
        },
      },
    },
  },
});
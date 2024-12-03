import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: './public/index.html',
        main: './public/main-page.html',
        teacher: './public/main-page-teacher.html',
        policy: './public/privacy-policy.html',
      }
    }
  },
  root:"./public",
  server: {
        port: 5173,
        host: "10.5.0.8",
    }
    
});
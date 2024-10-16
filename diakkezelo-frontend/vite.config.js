import { defineConfig } from "vite";

export default defineConfig({
  server: {
        port: 5173,
        host: "10.5.0.8",
        watch: {
            usePolling: true
        }
    }
    
});
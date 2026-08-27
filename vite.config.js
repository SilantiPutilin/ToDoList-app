import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ToDoList-app/",
  server: {
    proxy: {
      // Прокси для Bored API: сервер не отдаёт CORS-заголовки, поэтому
      // браузер не может обратиться к нему напрямую. Vite перенаправляет
      // /api/bored/random -> https://bored-api.appbrewery.com/random
      "/api/bored": {
        target: "https://bored-api.appbrewery.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bored/, ""),
      },
    },
  },
});

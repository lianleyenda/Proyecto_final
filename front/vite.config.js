import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // <--- 💡 activa describe/test/expect sin importar
    environment: "jsdom", // <--- necesario para React
  },
});

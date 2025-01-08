import { defineConfig } from "vite";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    port: 5173, // ou a porta que você deseja
  },
});

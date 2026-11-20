import "dotenv/config";
import { fileURLToPath } from "node:url";
import process from "node:process";

export const config = {
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:8080",
  dataFile: fileURLToPath(new URL("../../data/tasks.json", import.meta.url)),
};

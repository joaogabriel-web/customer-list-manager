import express from "express";
import cors from "cors";

import { config } from "./config/index.js";
import { createTaskModel } from "./model/task.js";
import { createTaskService } from "./service/task.js";
import { createTaskController } from "./controller/task.js";
import { createTaskRouter } from "./router/task.js";

export function createApp(store, { frontendOrigin = config.frontendOrigin } = {}) {
  const app = express();

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json({ limit: "32kb" }));
  const service = createTaskService(store);
  const controller = createTaskController(service);
  app.use("/api", createTaskRouter(controller));

  app.use((_request, response) => {
    response.status(404).json({ error: "Rota não encontrada." });
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ error: "Erro interno do servidor." });
  });

  return app;
}

export async function createConfiguredApp() {
  const store = createTaskModel(config.dataFile);
  await store.load();
  return createApp(store);
}

import crypto from "node:crypto";
import express from "express";
import cors from "cors";

import { config } from "./config.js";
import { createTaskStore } from "./store.js";
import { validateTaskInput } from "./validation.js";

export function createApp(store, { frontendOrigin = config.frontendOrigin } = {}) {
  const app = express();

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, service: "aula-exemplo-ia-api" });
  });

  app.get("/api/tarefas", (_request, response) => {
    response.json({ data: store.list() });
  });

  app.post("/api/tarefas", async (request, response, next) => {
    try {
      const result = validateTaskInput(request.body ?? {});
      if (!result.ok) {
        response.status(400).json({ error: "Dados inválidos.", details: result.errors });
        return;
      }
      const now = new Date().toISOString();
      const task = await store.insert({
        id: crypto.randomUUID(),
        ...result.value,
        createdAt: now,
        updatedAt: now,
        isMock: false,
      });
      response.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/tarefas/:id", async (request, response, next) => {
    try {
      const result = validateTaskInput(request.body ?? {}, { partial: true });
      if (!result.ok) {
        response.status(400).json({ error: "Dados inválidos.", details: result.errors });
        return;
      }
      const task = await store.update(request.params.id, result.value);
      if (!task) {
        response.status(404).json({ error: "Tarefa não encontrada." });
        return;
      }
      response.json({ data: task });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tarefas/:id", async (request, response, next) => {
    try {
      const task = await store.remove(request.params.id);
      if (!task) {
        response.status(404).json({ error: "Tarefa não encontrada." });
        return;
      }
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

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
  const store = createTaskStore(config.dataFile);
  await store.load();
  return createApp(store);
}

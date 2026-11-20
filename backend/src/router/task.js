import express from "express";

export function createTaskRouter(controller) {
  const router = express.Router();
  router.get("/health", controller.health);
  router.get("/tarefas", controller.list);
  router.post("/tarefas", controller.create);
  router.patch("/tarefas/:id", controller.update);
  router.delete("/tarefas/:id", controller.remove);
  return router;
}

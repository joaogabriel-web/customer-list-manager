export function createTaskController(service) {
  return {
    async health(_request, response) {
      response.json({ ok: true, service: "custlist-api" });
    },
    async list(_request, response) {
      response.json({ data: await service.list() });
    },
    async create(request, response, next) {
      try {
        const result = await service.create(request.body ?? {});
        if (!result.ok) {
          response.status(400).json({ error: "Dados inválidos.", details: result.errors });
          return;
        }
        response.status(201).json({ data: result.task });
      } catch (error) {
        next(error);
      }
    },
    async update(request, response, next) {
      try {
        const result = await service.update(request.params.id, request.body ?? {});
        if (!result.ok && result.notFound) {
          response.status(404).json({ error: "Tarefa não encontrada." });
          return;
        }
        if (!result.ok) {
          response.status(400).json({ error: "Dados inválidos.", details: result.errors });
          return;
        }
        response.json({ data: result.task });
      } catch (error) {
        next(error);
      }
    },
    async remove(request, response, next) {
      try {
        const result = await service.remove(request.params.id);
        if (!result.ok) {
          response.status(404).json({ error: "Tarefa não encontrada." });
          return;
        }
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}

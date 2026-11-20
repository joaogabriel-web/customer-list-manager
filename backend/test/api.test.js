import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createApp } from "../src/app.js";

function createMemoryStore() {
  const tasks = [];
  return {
    list: () => [...tasks],
    find: (id) => tasks.find((task) => task.id === id) ?? null,
    insert: async (task) => {
      tasks.unshift(task);
      return task;
    },
    update: async (id, changes) => {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) return null;
      tasks[index] = { ...tasks[index], ...changes };
      return tasks[index];
    },
    remove: async (id) => {
      const task = tasks.find((current) => current.id === id) ?? null;
      if (task) tasks.splice(tasks.indexOf(task), 1);
      return task;
    },
  };
}

async function request(app, path, options) {
  const server = app.listen(0);
  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      headers: { "content-type": "application/json" },
      ...options,
    });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

describe("API de tarefas", () => {
  it("cria, lista, atualiza e exclui tarefas", async () => {
    const app = createApp(createMemoryStore(), { frontendOrigin: "*" });
    const created = await request(app, "/api/tarefas", {
      method: "POST",
      body: JSON.stringify({
        title: "Testar API",
        description: "",
        status: "pending",
        priority: "high",
        dueDate: null,
      }),
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.title, "Testar API");

    const id = created.body.data.id;
    const listed = await request(app, "/api/tarefas");
    assert.equal(listed.body.data.length, 1);

    const updated = await request(app, `/api/tarefas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "done" }),
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.status, "done");

    const removed = await request(app, `/api/tarefas/${id}`, { method: "DELETE" });
    assert.equal(removed.status, 204);
  });

  it("rejeita tarefa sem título", async () => {
    const app = createApp(createMemoryStore(), { frontendOrigin: "*" });
    const response = await request(app, "/api/tarefas", {
      method: "POST",
      body: JSON.stringify({ title: "   " }),
    });
    assert.equal(response.status, 400);
    assert.match(response.body.details.title, /título/i);
  });
});

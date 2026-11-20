import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const VERSION = 1;

function isTask(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.status === "string" &&
    typeof value.priority === "string" &&
    (value.dueDate === null || typeof value.dueDate === "string") &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function createTaskModel(fileUrl) {
  let tasks = [];

  async function load() {
    try {
      const raw = await readFile(fileUrl, "utf8");
      const payload = JSON.parse(raw);
      if (payload?.version !== VERSION || !Array.isArray(payload.tasks)) {
        throw new Error("O arquivo de tarefas possui formato inválido.");
      }
      tasks = payload.tasks.filter(isTask);
    } catch (error) {
      if (error.code === "ENOENT") {
        tasks = [];
        await persist();
        return;
      }
      throw error;
    }
  }

  async function persist() {
    await mkdir(dirname(fileUrl), { recursive: true });
    await writeFile(fileUrl, JSON.stringify({ version: VERSION, tasks }, null, 2), "utf8");
  }

  return {
    load,
    list: () => [...tasks],
    find: (id) => tasks.find((task) => task.id === id) ?? null,
    async insert(task) {
      tasks = [task, ...tasks];
      await persist();
      return task;
    },
    async update(id, changes) {
      const index = tasks.findIndex((task) => task.id === id);
      if (index === -1) return null;
      const updated = { ...tasks[index], ...changes, updatedAt: new Date().toISOString() };
      tasks = tasks.map((task, currentIndex) => (currentIndex === index ? updated : task));
      await persist();
      return updated;
    },
    async remove(id) {
      const task = tasks.find((current) => current.id === id) ?? null;
      if (!task) return null;
      tasks = tasks.filter((current) => current.id !== id);
      await persist();
      return task;
    },
  };
}

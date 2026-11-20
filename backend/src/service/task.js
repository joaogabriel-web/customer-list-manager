import crypto from "node:crypto";

export const STATUSES = ["pending", "in_progress", "done"];
export const PRIORITIES = ["low", "medium", "high"];
export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function cleanText(value, multiline = false) {
  if (typeof value !== "string") return "";
  let text = value.replace(CONTROL_CHARS, "");
  if (!multiline) text = text.replace(/[\r\n\t]+/g, " ");
  return text.trim();
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateTaskInput(input, { partial = false } = {}) {
  const errors = {};
  const value = {};

  if (!partial || input.title !== undefined) {
    const title = cleanText(input.title);
    if (!title) errors.title = "Informe um título para a tarefa.";
    else if (title.length > TITLE_MAX) errors.title = `O título pode ter no máximo ${TITLE_MAX} caracteres.`;
    else value.title = title;
  }

  if (!partial || input.description !== undefined) {
    const description = cleanText(input.description, true);
    if (description.length > DESCRIPTION_MAX) errors.description = `A descrição pode ter no máximo ${DESCRIPTION_MAX} caracteres.`;
    else value.description = description;
  }

  if (!partial || input.status !== undefined) {
    if (!STATUSES.includes(input.status)) errors.status = "Escolha um status válido.";
    else value.status = input.status;
  }

  if (!partial || input.priority !== undefined) {
    if (!PRIORITIES.includes(input.priority)) errors.priority = "Escolha uma prioridade válida.";
    else value.priority = input.priority;
  }

  if (!partial || input.dueDate !== undefined) {
    const dueDate = cleanText(input.dueDate);
    if (dueDate && !isValidDateString(dueDate)) errors.dueDate = "Informe uma data válida no formato AAAA-MM-DD.";
    else value.dueDate = dueDate || null;
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

export function createTaskService(store) {
  return {
    async list() {
      return store.list();
    },
    async create(input) {
      const result = validateTaskInput(input);
      if (!result.ok) return { ok: false, errors: result.errors };
      const now = new Date().toISOString();
      const task = await store.insert({
        id: crypto.randomUUID(),
        ...result.value,
        createdAt: now,
        updatedAt: now,
        isMock: false,
      });
      return { ok: true, task };
    },
    async update(id, input) {
      const result = validateTaskInput(input, { partial: true });
      if (!result.ok) return { ok: false, errors: result.errors };
      const task = await store.update(id, result.value);
      return task ? { ok: true, task } : { ok: false, notFound: true };
    },
    async remove(id) {
      const task = await store.remove(id);
      return task ? { ok: true, task } : { ok: false, notFound: true };
    },
  };
}

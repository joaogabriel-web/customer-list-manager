import type {
  SortKey,
  StatusFilter,
  Task,
  TaskDraft,
  TaskInput,
  TaskPriority,
  TaskStatus,
  ValidationErrors,
} from "./types";

export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;

export const STATUSES: readonly TaskStatus[] = ["pending", "in_progress", "done"];
export const PRIORITIES: readonly TaskPriority[] = ["low", "medium", "high"];
export const SORT_KEYS: readonly SortKey[] = ["created", "due", "priority", "title"];
export const STATUS_FILTERS: readonly StatusFilter[] = ["all", "pending", "in_progress", "done"];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluída",
};

export const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "Todos",
  pending: "Pendentes",
  in_progress: "Em andamento",
  done: "Concluídas",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const SORT_LABELS: Record<SortKey, string> = {
  created: "Mais recentes",
  due: "Data da tarefa",
  priority: "Prioridade",
  title: "Título (A–Z)",
};

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

// Caracteres de controle invisíveis (exceto quebra de linha e tabulação).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && (PRIORITIES as readonly string[]).includes(value);
}

export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && (SORT_KEYS as readonly string[]).includes(value);
}

/** Remove caracteres de controle e espaços nas pontas. Título não aceita quebras de linha. */
export function cleanText(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  let text = value.replace(CONTROL_CHARS, "");
  if (!multiline) text = text.replace(/[\r\n\t]+/g, " ");
  return text.trim();
}

function parseDateParts(value: string): [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Aceita somente datas reais no formato AAAA-MM-DD. */
export function isValidDateString(value: string): boolean {
  const parts = parseDateParts(value);
  if (!parts) return false;
  const [y, m, d] = parts;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export type ValidationResult =
  { ok: true; value: TaskDraft } | { ok: false; errors: ValidationErrors };

export function validateTaskInput(input: TaskInput): ValidationResult {
  const errors: ValidationErrors = {};
  const title = cleanText(input.title);
  const description = cleanText(input.description, true);
  const dueDate = cleanText(input.dueDate);

  if (!title) {
    errors.title = "Informe um título para a tarefa. Ele não pode ficar vazio.";
  } else if (title.length > TITLE_MAX) {
    errors.title = `O título pode ter no máximo ${TITLE_MAX} caracteres. Remova ${title.length - TITLE_MAX}.`;
  }
  if (description.length > DESCRIPTION_MAX) {
    errors.description = `A descrição pode ter no máximo ${DESCRIPTION_MAX} caracteres. Remova ${description.length - DESCRIPTION_MAX}.`;
  }
  if (!isTaskStatus(input.status)) errors.status = "Escolha um status da lista.";
  if (!isTaskPriority(input.priority)) errors.priority = "Escolha uma prioridade da lista.";
  if (dueDate && !isValidDateString(dueDate)) {
    errors.dueDate = "Informe uma data válida (dia, mês e ano) ou deixe o campo vazio.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      title,
      description,
      status: input.status as TaskStatus,
      priority: input.priority as TaskPriority,
      dueDate: dueDate || null,
    },
  };
}

export function createTask(draft: TaskDraft, id: string, now: Date): Task {
  const stamp = now.toISOString();
  return { ...draft, id, createdAt: stamp, updatedAt: stamp, isMock: false };
}

/** Ao editar, o registro passa a ser do usuário e deixa de ser simulado. */
export function applyDraft(task: Task, draft: TaskDraft, now: Date): Task {
  return { ...task, ...draft, updatedAt: now.toISOString(), isMock: false };
}

export function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterTasks(
  tasks: readonly Task[],
  { query, status }: { query: string; status: StatusFilter },
): Task[] {
  const needle = normalizeForSearch(query);
  return tasks.filter((task) => {
    if (status !== "all" && task.status !== status) return false;
    if (!needle) return true;
    return (
      normalizeForSearch(task.title).includes(needle) ||
      normalizeForSearch(task.description).includes(needle)
    );
  });
}

const byCreatedDesc = (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt);

export function sortTasks(tasks: readonly Task[], key: SortKey): Task[] {
  const list = [...tasks];
  switch (key) {
    case "due":
      // Datas mais próximas primeiro; tarefas sem data vão para o fim.
      return list.sort((a, b) => {
        if (a.dueDate === b.dueDate) return byCreatedDesc(a, b);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority":
      return list.sort(
        (a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] || byCreatedDesc(a, b),
      );
    case "title":
      return list.sort(
        (a, b) =>
          a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" }) || byCreatedDesc(a, b),
      );
    case "created":
    default:
      return list.sort(byCreatedDesc);
  }
}

export function countByStatus(tasks: readonly Task[]): Record<TaskStatus, number> {
  const counts: Record<TaskStatus, number> = { pending: 0, in_progress: 0, done: 0 };
  for (const task of tasks) counts[task.status] += 1;
  return counts;
}

/** Valida um registro lido do armazenamento; descarta o que não tiver o formato esperado. */
export function sanitizeStoredTask(raw: unknown): Task | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Record<keyof Task, unknown>>;
  if (typeof r.id !== "string" || !r.id) return null;
  const title = cleanText(r.title).slice(0, TITLE_MAX);
  if (!title) return null;
  const dueDate = typeof r.dueDate === "string" && isValidDateString(r.dueDate) ? r.dueDate : null;
  const createdAt =
    typeof r.createdAt === "string" && !Number.isNaN(Date.parse(r.createdAt))
      ? r.createdAt
      : new Date(0).toISOString();
  const updatedAt =
    typeof r.updatedAt === "string" && !Number.isNaN(Date.parse(r.updatedAt))
      ? r.updatedAt
      : createdAt;
  return {
    id: r.id.slice(0, 64),
    title,
    description: cleanText(r.description, true).slice(0, DESCRIPTION_MAX),
    status: isTaskStatus(r.status) ? r.status : "pending",
    priority: isTaskPriority(r.priority) ? r.priority : "medium",
    dueDate,
    createdAt,
    updatedAt,
    isMock: r.isMock === true,
  };
}

export function formatDueDate(value: string): string {
  const parts = parseDateParts(value);
  if (!parts) return value;
  const [y, m, d] = parts;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

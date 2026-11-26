import { cloneMockData } from "./mock-data";
import { isSortKey, sanitizeStoredTask } from "./tasks";
import type { Preferences, StorageLike, Task } from "./types";

export const TASKS_KEY = "custlist:tasks:v1";
export const PREFERENCES_KEY = "custlist:preferences:v1";

export const DEFAULT_PREFERENCES: Preferences = Object.freeze({
  theme: "light",
  accent: "tangerina",
  density: "comfortable",
  defaultSort: "created",
}) as Preferences;

export type TasksIssue = "unavailable" | "corrupted" | "write_failed" | null;

/** Retorna o localStorage apenas se ele realmente aceitar leitura e escrita. */
export function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window === "undefined") return null;
    const storage = window.localStorage;
    const probe = "__custlist_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

type ReadResult = { ok: true; value: unknown } | { ok: false; reason: "unavailable" | "corrupted" };

export function readJSON(storage: StorageLike, key: string): ReadResult {
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return { ok: false, reason: "unavailable" };
  }
  if (raw === null) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, reason: "corrupted" };
  }
}

export function writeJSON(storage: StorageLike, key: string, value: unknown): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Armazenamento cheio (QuotaExceededError), bloqueado ou indisponível.
    return false;
  }
}

export function loadTasks(storage: StorageLike | null): { tasks: Task[]; issue: TasksIssue } {
  if (!storage) return { tasks: cloneMockData(), issue: "unavailable" };
  const result = readJSON(storage, TASKS_KEY);
  if (!result.ok) return { tasks: cloneMockData(), issue: result.reason };
  // Primeiro acesso: nada salvo ainda, então mostramos os dados simulados.
  if (result.value === null) return { tasks: cloneMockData(), issue: null };
  const payload = result.value as { version?: unknown; tasks?: unknown };
  if (!payload || payload.version !== 1 || !Array.isArray(payload.tasks)) {
    return { tasks: cloneMockData(), issue: "corrupted" };
  }
  const seen = new Set<string>();
  const tasks: Task[] = [];
  for (const raw of payload.tasks) {
    const task = sanitizeStoredTask(raw);
    if (task && !seen.has(task.id)) {
      seen.add(task.id);
      tasks.push(task);
    }
  }
  return { tasks, issue: null };
}

export function saveTasks(storage: StorageLike, tasks: readonly Task[]): boolean {
  return writeJSON(storage, TASKS_KEY, { version: 1, tasks });
}

export function sanitizePreferences(raw: unknown): Preferences {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<
    Record<keyof Preferences, unknown>
  >;
  return {
    theme: r.theme === "dark" ? "dark" : "light",
    accent:
      r.accent === "laranja" ||
      r.accent === "ambar" ||
      r.accent === "amarelo" ||
      r.accent === "rosa-violeta"
        ? r.accent
        : "tangerina",
    density: r.density === "compact" ? "compact" : "comfortable",
    defaultSort: isSortKey(r.defaultSort) ? r.defaultSort : DEFAULT_PREFERENCES.defaultSort,
  };
}

export function loadPreferences(storage: StorageLike | null): {
  preferences: Preferences;
  ok: boolean;
} {
  if (!storage) return { preferences: { ...DEFAULT_PREFERENCES }, ok: false };
  const result = readJSON(storage, PREFERENCES_KEY);
  if (!result.ok) return { preferences: { ...DEFAULT_PREFERENCES }, ok: false };
  return { preferences: sanitizePreferences(result.value), ok: true };
}

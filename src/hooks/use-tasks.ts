import { useCallback, useEffect, useRef, useState } from "react";

import { getBrowserStorage, loadTasks, saveTasks, type TasksIssue } from "@/lib/custlist/storage";
import { applyDraft, createTask } from "@/lib/custlist/tasks";
import type { StorageLike, Task, TaskDraft, TaskStatus } from "@/lib/custlist/types";

export interface UseTasksOptions {
  /** `undefined` usa o localStorage do navegador; `null` simula armazenamento indisponível. */
  storage?: StorageLike | null | undefined;
  loadingDelayMs?: number | undefined;
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Estado central das tarefas: tudo fica no navegador, nada sai do dispositivo. */
export function useTasks({ storage, loadingDelayMs = 400 }: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<TasksIssue>(null);
  const tasksRef = useRef<Task[]>([]);
  const storageRef = useRef<StorageLike | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (cancelled) return;
      const resolved = storage === undefined ? getBrowserStorage() : storage;
      storageRef.current = resolved;
      const result = loadTasks(resolved);
      tasksRef.current = result.tasks;
      setTasks(result.tasks);
      setIssue(result.issue);
      setLoading(false);
    };
    if (loadingDelayMs <= 0) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const timer = setTimeout(load, loadingDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [storage, loadingDelayMs]);

  /** Aplica a nova lista e tenta gravá-la. Retorna se a gravação realmente aconteceu. */
  const commit = useCallback((next: Task[]): boolean => {
    tasksRef.current = next;
    setTasks(next);
    const target = storageRef.current;
    if (!target) return false;
    if (saveTasks(target, next)) {
      setIssue((prev) => (prev === "write_failed" || prev === "corrupted" ? null : prev));
      return true;
    }
    setIssue("write_failed");
    return false;
  }, []);

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const task = createTask(draft, newId(), new Date());
      const persisted = commit([task, ...tasksRef.current]);
      return { task, persisted };
    },
    [commit],
  );

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => {
      const current = tasksRef.current.find((t) => t.id === id);
      if (!current) return null;
      const task = applyDraft(current, draft, new Date());
      const persisted = commit(tasksRef.current.map((t) => (t.id === id ? task : t)));
      return { task, persisted };
    },
    [commit],
  );

  const setStatus = useCallback(
    (id: string, status: TaskStatus) => {
      const current = tasksRef.current.find((t) => t.id === id);
      if (!current || current.status === status) return null;
      const task: Task = { ...current, status, updatedAt: new Date().toISOString() };
      const persisted = commit(tasksRef.current.map((t) => (t.id === id ? task : t)));
      return { task, persisted };
    },
    [commit],
  );

  const removeTask = useCallback(
    (id: string) => {
      const index = tasksRef.current.findIndex((t) => t.id === id);
      if (index === -1) return null;
      const task = tasksRef.current[index];
      if (!task) return null;
      const persisted = commit(tasksRef.current.filter((t) => t.id !== id));
      return { task, index, persisted };
    },
    [commit],
  );

  const restoreTask = useCallback(
    (task: Task, index: number) => {
      if (tasksRef.current.some((t) => t.id === task.id)) return false;
      const next = [...tasksRef.current];
      next.splice(Math.min(Math.max(index, 0), next.length), 0, task);
      return commit(next);
    },
    [commit],
  );

  return { tasks, loading, issue, addTask, updateTask, setStatus, removeTask, restoreTask };
}

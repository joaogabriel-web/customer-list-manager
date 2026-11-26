import { describe, expect, it } from "vitest";

import { MOCK_DATA } from "@/lib/custlist/mock-data";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  loadTasks,
  saveTasks,
  TASKS_KEY,
} from "@/lib/custlist/storage";
import { filterTasks, sortTasks, validateTaskInput } from "@/lib/custlist/tasks";
import type { StorageLike } from "@/lib/custlist/types";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & {
  data: Record<string, string>;
} {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

const base = { description: "", status: "pending", priority: "medium", dueDate: "" };

describe("validação de tarefas", () => {
  it("remove espaços das pontas do título", () => {
    const r = validateTaskInput({ ...base, title: "   Comprar pão   " });
    expect(r.ok && r.value.title).toBe("Comprar pão");
  });

  it("bloqueia título vazio ou só com espaços", () => {
    const r = validateTaskInput({ ...base, title: "    " });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errors.title).toBeTruthy();
  });

  it("aceita 100 caracteres no título e bloqueia 101", () => {
    expect(validateTaskInput({ ...base, title: "a".repeat(100) }).ok).toBe(true);
    expect(validateTaskInput({ ...base, title: "a".repeat(101) }).ok).toBe(false);
  });

  it("aceita 500 caracteres na descrição e bloqueia 501", () => {
    expect(validateTaskInput({ ...base, title: "x", description: "d".repeat(500) }).ok).toBe(true);
    expect(validateTaskInput({ ...base, title: "x", description: "d".repeat(501) }).ok).toBe(false);
  });

  it("rejeita status, prioridade e datas inválidas", () => {
    expect(validateTaskInput({ ...base, title: "x", status: "hack" }).ok).toBe(false);
    expect(validateTaskInput({ ...base, title: "x", priority: "urgente" }).ok).toBe(false);
    expect(validateTaskInput({ ...base, title: "x", dueDate: "2026-02-30" }).ok).toBe(false);
  });

  it("mantém marcação HTML como texto, sem interpretar", () => {
    const r = validateTaskInput({ ...base, title: "<img src=x onerror=alert(1)>" });
    expect(r.ok && r.value.title).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("busca, filtros e ordenação", () => {
  it("busca no título e na descrição ignorando acentos", () => {
    expect(filterTasks(MOCK_DATA, { query: "agua", status: "all" }).map((t) => t.id)).toEqual([
      "mock-1",
    ]);
    expect(filterTasks(MOCK_DATA, { query: "capítulo", status: "all" }).map((t) => t.id)).toEqual([
      "mock-5",
    ]);
  });

  it("filtra por status", () => {
    expect(filterTasks(MOCK_DATA, { query: "", status: "in_progress" })).toHaveLength(2);
    expect(filterTasks(MOCK_DATA, { query: "", status: "done" })).toHaveLength(1);
  });

  it("ordena por prioridade alta primeiro e por data com tarefas sem data no fim", () => {
    expect(sortTasks(MOCK_DATA, "priority")[0]?.priority).toBe("high");
    const byDue = sortTasks(MOCK_DATA, "due");
    expect(byDue[0]?.dueDate).toBe("2026-11-18");
    expect(byDue.at(-1)?.dueDate).toBeNull();
  });

  it("ordena por título em ordem alfabética", () => {
    expect(sortTasks(MOCK_DATA, "title")[0]?.title).toBe("Beber água ao acordar");
  });
});

describe("armazenamento local", () => {
  it("carrega os dados simulados no primeiro acesso", () => {
    const r = loadTasks(memoryStorage());
    expect(r.tasks).toHaveLength(MOCK_DATA.length);
    expect(r.tasks.every((t) => t.isMock)).toBe(true);
    expect(r.issue).toBeNull();
  });

  it("grava e lê de volta a lista", () => {
    const storage = memoryStorage();
    saveTasks(storage, MOCK_DATA.slice(0, 1));
    expect(loadTasks(storage).tasks.map((t) => t.id)).toEqual(["mock-1"]);
  });

  it("mantém lista vazia salva sem recarregar os exemplos", () => {
    const storage = memoryStorage();
    saveTasks(storage, []);
    expect(loadTasks(storage).tasks).toEqual([]);
  });

  it("indica dados corrompidos e volta para os exemplos", () => {
    const r = loadTasks(memoryStorage({ [TASKS_KEY]: "{não é json" }));
    expect(r.issue).toBe("corrupted");
    expect(r.tasks).toHaveLength(MOCK_DATA.length);
  });

  it("indica armazenamento indisponível quando a leitura falha", () => {
    const broken: StorageLike = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {},
      removeItem: () => {},
    };
    expect(loadTasks(broken).issue).toBe("unavailable");
    expect(loadTasks(null).issue).toBe("unavailable");
  });

  it("retorna falso quando o armazenamento está cheio", () => {
    const full: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("cheio", "QuotaExceededError");
      },
      removeItem: () => {},
    };
    expect(saveTasks(full, [])).toBe(false);
  });

  it("ignora preferências inválidas e usa os padrões", () => {
    const storage = memoryStorage({
      "custlist:preferences:v1": JSON.stringify({ theme: "neon", accent: "roxo", density: "x" }),
    });
    expect(loadPreferences(storage).preferences).toEqual(DEFAULT_PREFERENCES);
  });

  it("carrega a nova paleta rosa e violeta", () => {
    const storage = memoryStorage({
      "custlist:preferences:v1": JSON.stringify({ accent: "rosa-violeta" }),
    });
    expect(loadPreferences(storage).preferences.accent).toBe("rosa-violeta");
  });
});

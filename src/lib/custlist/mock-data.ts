import type { Task } from "./types";

/**
 * MOCK_DATA — DADOS SIMULADOS DE DEMONSTRAÇÃO.
 * Estes registros não pertencem a ninguém: servem apenas para mostrar como a
 * lista funciona no primeiro acesso. Todos têm `isMock: true`, e a interface
 * exibe o aviso "Demonstração com dados simulados" enquanto algum deles existir.
 */
export const MOCK_DATA: readonly Task[] = Object.freeze([
  {
    id: "mock-1",
    title: "Beber água ao acordar",
    description: "Deixar uma garrafa ao lado da cama para lembrar.",
    status: "done",
    priority: "low",
    dueDate: "2026-11-18",
    createdAt: "2026-11-15T08:00:00.000Z",
    updatedAt: "2026-11-15T08:00:00.000Z",
    isMock: true,
  },
  {
    id: "mock-2",
    title: "Pagar a conta de luz",
    description: "Vence nesta semana. Conferir o valor antes de pagar.",
    status: "pending",
    priority: "high",
    dueDate: "2026-11-20",
    createdAt: "2026-11-16T10:30:00.000Z",
    updatedAt: "2026-11-16T10:30:00.000Z",
    isMock: true,
  },
  {
    id: "mock-3",
    title: "Caminhada de 30 minutos",
    description: "",
    status: "in_progress",
    priority: "medium",
    dueDate: null,
    createdAt: "2026-11-16T18:00:00.000Z",
    updatedAt: "2026-11-16T18:00:00.000Z",
    isMock: true,
  },
  {
    id: "mock-4",
    title: "Organizar a mesa de trabalho",
    description: "Separar papéis antigos e guardar os cabos soltos.",
    status: "pending",
    priority: "low",
    dueDate: "2026-11-23",
    createdAt: "2026-11-17T09:15:00.000Z",
    updatedAt: "2026-11-17T09:15:00.000Z",
    isMock: true,
  },
  {
    id: "mock-5",
    title: "Ler 20 páginas do livro",
    description: "Continuar a partir do capítulo 4.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-11-21",
    createdAt: "2026-11-17T21:00:00.000Z",
    updatedAt: "2026-11-17T21:00:00.000Z",
    isMock: true,
  },
]);

/** Cópia independente dos dados simulados, para nunca alterar o original. */
export function cloneMockData(): Task[] {
  return MOCK_DATA.map((task) => ({ ...task }));
}

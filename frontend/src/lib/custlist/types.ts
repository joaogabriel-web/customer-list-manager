export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type SortKey = "created" | "due" | "priority" | "title";
export type StatusFilter = "all" | TaskStatus;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** Data opcional no formato AAAA-MM-DD. */
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  /** true apenas para os registros de demonstração (MOCK_DATA). */
  isMock: boolean;
}

/** Valores crus vindos do formulário, antes da validação. */
export interface TaskInput {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

/** Dados já validados e normalizados. */
export interface TaskDraft {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

export type ValidationErrors = Partial<Record<keyof TaskInput, string>>;

export type ThemePreference = "light" | "dark";
export type AccentPreference = "laranja" | "tangerina" | "ambar" | "amarelo" | "rosa-violeta";
export type DensityPreference = "comfortable" | "compact";
export type TextSizePreference = "small" | "medium" | "large";
export type TaskViewPreference = "cards" | "list";

export interface Preferences {
  theme: ThemePreference;
  accent: AccentPreference;
  density: DensityPreference;
  defaultSort: SortKey;
  defaultFilter: StatusFilter;
  textSize: TextSizePreference;
  taskView: TaskViewPreference;
}

/** Subconjunto do Web Storage usado pelo app; permite injetar falhas nos testes. */
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

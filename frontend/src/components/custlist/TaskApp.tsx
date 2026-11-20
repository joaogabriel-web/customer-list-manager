import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppHeader } from "./AppHeader";
import { ConfirmDialog } from "./ConfirmDialog";
import { CustomizationPanel } from "./CustomizationPanel";
import { LoadingState } from "./LoadingState";
import { StorageNotice } from "./StorageNotice";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskSummary } from "./TaskSummary";
import { TaskToolbar } from "./TaskToolbar";
import { ToastMessage, type ToastData } from "./ToastMessage";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/use-preferences";
import { useTasks } from "@/hooks/use-tasks";
import { countByStatus, filterTasks, sortTasks, STATUS_LABELS } from "@/lib/custlist/tasks";
import type { SortKey, StatusFilter, StorageLike, Task, TaskStatus } from "@/lib/custlist/types";

interface TaskAppProps {
  /** Injeção para testes. `undefined` = localStorage do navegador. */
  storage?: StorageLike | null | undefined;
  loadingDelayMs?: number | undefined;
}

export function TaskApp({ storage, loadingDelayMs = 400 }: TaskAppProps) {
  const { tasks, loading, issue, addTask, updateTask, setStatus, removeTask, restoreTask } =
    useTasks({ storage, loadingDelayMs });
  const { preferences, update, reset, saveFailed } = usePreferences(storage);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>(preferences.defaultSort);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const deletedRef = useRef(false);
  // Elemento que abriu um diálogo, para devolver o foco ao fechar.
  const openerRef = useRef<HTMLElement | null>(null);
  const rememberOpener = () => {
    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  };
  const returnFocus = (event: Event) => {
    event.preventDefault();
    const target = openerRef.current;
    openerRef.current = null;
    if (target && target.isConnected) target.focus();
    else listHeadingRef.current?.focus();
  };
  const toastId = useRef(0);

  // A ordenação padrão escolhida nas preferências passa a valer imediatamente.
  useEffect(() => setSort(preferences.defaultSort), [preferences.defaultSort]);

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingId) ?? null,
    [tasks, editingId],
  );
  const counts = useMemo(() => countByStatus(tasks), [tasks]);
  const visible = useMemo(
    () => sortTasks(filterTasks(tasks, { query, status: statusFilter }), sort),
    [tasks, query, statusFilter, sort],
  );
  const statusCounts = useMemo(() => {
    const base = filterTasks(tasks, { query, status: "all" });
    const c = countByStatus(base);
    return { all: base.length, ...c };
  }, [tasks, query]);
  const isDemo = tasks.some((t) => t.isMock);

  const focusForm = useCallback(() => {
    requestAnimationFrame(() => {
      titleRef.current?.focus();
      titleRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setStatusFilter("all");
  }, []);

  const handleEdit = useCallback(
    (task: Task) => {
      setEditingId(task.id);
      focusForm();
    },
    [focusForm],
  );

  const handleFinishEdit = useCallback((id: string) => {
    setEditingId(null);
    requestAnimationFrame(() => document.getElementById(`edit-${id}`)?.focus());
  }, []);

  const handleStatusChange = useCallback(
    (task: Task, status: TaskStatus) => {
      const result = setStatus(task.id, status);
      if (!result) return;
      setAnnouncement(
        `Status de “${task.title}” alterado para ${STATUS_LABELS[status]}.` +
          (result.persisted ? "" : " Não foi possível salvar no dispositivo."),
      );
      // Se a tarefa sair do filtro atual, o foco vai para o título da lista.
      if (statusFilter !== "all" && statusFilter !== status) {
        requestAnimationFrame(() => listHeadingRef.current?.focus());
      }
    },
    [setStatus, statusFilter],
  );

  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    const removed = removeTask(pendingDelete.id);
    setPendingDelete(null);
    if (!removed) return;
    deletedRef.current = true;
    if (editingId === removed.task.id) setEditingId(null);
    const id = ++toastId.current;
    setToast({
      id,
      message: `Tarefa “${removed.task.title}” excluída.`,
      actionLabel: "Desfazer",
      onAction: () => {
        restoreTask(removed.task, removed.index);
        setToast({ id: ++toastId.current, message: `Tarefa “${removed.task.title}” restaurada.` });
        requestAnimationFrame(() => document.getElementById(`edit-${removed.task.id}`)?.focus());
      },
    });
  }, [pendingDelete, removeTask, restoreTask, editingId]);

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        isDemo={!loading && isDemo}
        onOpenSettings={() => {
          rememberOpener();
          setSettingsOpen(true);
        }}
      />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10 compact:pt-4">
        {loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-4">
            <StorageNotice issue={issue} />
            {isDemo && (
              <p className="text-sm text-muted-foreground">
                As tarefas marcadas como “Exemplo simulado” são dados de demonstração. Edite ou
                exclua à vontade.
              </p>
            )}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] compact:gap-4">
              <div className="space-y-4 lg:sticky lg:top-4 lg:self-start compact:space-y-3">
                <TaskSummary counts={counts} />
                <TaskForm
                  editingTask={editingTask}
                  onCreate={addTask}
                  onUpdate={updateTask}
                  onFinishEdit={handleFinishEdit}
                  titleRef={titleRef}
                />
              </div>
              <div className="min-w-0 space-y-4 compact:space-y-3">
                <TaskToolbar
                  query={query}
                  onQueryChange={setQuery}
                  status={statusFilter}
                  onStatusChange={setStatusFilter}
                  statusCounts={statusCounts}
                  sort={sort}
                  onSortChange={setSort}
                  resultCount={visible.length}
                  totalCount={tasks.length}
                  onClear={clearFilters}
                />
                <TaskList
                  ref={listHeadingRef}
                  tasks={visible}
                  totalCount={tasks.length}
                  editingId={editingId}
                  onEdit={handleEdit}
                  onDelete={(task) => {
                    rememberOpener();
                    setPendingDelete(task);
                  }}
                  onStatusChange={handleStatusChange}
                  onCreateFirst={focusForm}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {!loading && (
        <div className="fixed bottom-4 right-4 z-30 lg:hidden">
          <Button size="lg" className="shadow-float" onClick={focusForm}>
            <Plus aria-hidden="true" />
            Nova tarefa
          </Button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir tarefa?"
        description={
          pendingDelete
            ? `A tarefa “${pendingDelete.title}” será removida deste dispositivo. Você poderá desfazer logo em seguida.`
            : ""
        }
        confirmLabel="Excluir tarefa"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        onCloseAutoFocus={(event) => {
          // Após excluir, o botão que abriu o diálogo sumiu: o foco vai para o título da lista.
          if (deletedRef.current) {
            deletedRef.current = false;
            openerRef.current = null;
          }
          returnFocus(event);
        }}
      />

      <CustomizationPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        preferences={preferences}
        onUpdate={update}
        onReset={reset}
        saveFailed={saveFailed}
        onCloseAutoFocus={returnFocus}
      />

      <ToastMessage toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

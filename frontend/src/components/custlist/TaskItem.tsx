import { CalendarDays, FlaskConical, Pencil, Trash2 } from "lucide-react";
import { useId } from "react";

import { PriorityBadge, StatusBadge } from "./badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABELS, formatDueDate, isTaskStatus } from "@/lib/custlist/tasks";
import type { Task, TaskStatus, TaskViewPreference } from "@/lib/custlist/types";

interface TaskItemProps {
  task: Task;
  viewStyle: TaskViewPreference;
  isEditing: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

/** Todo texto do usuário é renderizado como texto puro pelo React (nunca como HTML). */
export function TaskItem({
  task,
  viewStyle,
  isEditing,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskItemProps) {
  const statusId = useId();
  const done = task.status === "done";
  return (
    <li>
      <article
        aria-label={task.title}
        className={cn(
          "surface flex h-full flex-col gap-3 p-4 compact:gap-2 compact:p-3",
          viewStyle === "list" &&
            "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 p-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4",
          isEditing && "border-2 border-primary",
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            viewStyle === "list" && "flex-col items-start",
          )}
        >
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.isMock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-demo px-2 py-0.5 text-xs font-medium text-ink">
              <FlaskConical className="size-3" aria-hidden="true" />
              Exemplo simulado
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3
            className={cn(
              "break-words text-lg font-bold leading-snug [overflow-wrap:anywhere]",
              done && "line-through decoration-2 decoration-muted-foreground",
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 whitespace-pre-line break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {task.description}
            </p>
          )}
          {task.dueDate && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Data:</span>
              <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
            </p>
          )}
        </div>
        <div
          className={cn(
            "mt-auto flex flex-col gap-2 border-t pt-3 compact:pt-2",
            viewStyle === "list" &&
              "col-span-2 mt-0 flex-row flex-wrap items-end gap-3 border-t-0 pt-0 md:col-span-1 md:flex-nowrap md:border-l md:py-0 md:pl-4",
          )}
        >
          <div className={cn(viewStyle === "list" && "min-w-32 flex-1")}>
            <label htmlFor={statusId} className="text-xs font-semibold text-muted-foreground">
              Status
            </label>
            <select
              id={statusId}
              aria-label={`Status de ${task.title}`}
              value={task.status}
              onChange={(e) => {
                if (isTaskStatus(e.target.value)) onStatusChange(task, e.target.value);
              }}
              className="field mt-1"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div className={cn("grid grid-cols-2 gap-2", viewStyle === "list" && "min-w-36 flex-1")}>
            <Button
              id={`edit-${task.id}`}
              variant="outline"
              onClick={() => onEdit(task)}
              aria-label={`Editar ${task.title}`}
            >
              <Pencil aria-hidden="true" />
              Editar
            </Button>
            <Button
              id={`delete-${task.id}`}
              variant="destructive-outline"
              onClick={() => onDelete(task)}
              aria-label={`Excluir ${task.title}`}
            >
              <Trash2 aria-hidden="true" />
              Excluir
            </Button>
          </div>
        </div>
      </article>
    </li>
  );
}

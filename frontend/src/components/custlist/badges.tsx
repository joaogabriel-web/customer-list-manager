import { ArrowDown, ArrowUp, CircleCheck, Circle, Equal, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/custlist/tasks";
import type { TaskPriority, TaskStatus } from "@/lib/custlist/types";

export const STATUS_ICONS = {
  pending: Circle,
  in_progress: LoaderCircle,
  done: CircleCheck,
} as const;

const STATUS_BG: Record<TaskStatus, string> = {
  pending: "bg-status-pending",
  in_progress: "bg-status-progress",
  done: "bg-status-done",
};

/** Status sempre com ícone + texto + fundo: nunca só a cor. Texto em #03071e. */
export function StatusBadge({ status }: { status: TaskStatus }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink",
        STATUS_BG[status],
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_ICONS = { low: ArrowDown, medium: Equal, high: ArrowUp } as const;

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const Icon = PRIORITY_ICONS[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        priority === "high"
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      Prioridade {PRIORITY_LABELS[priority].toLowerCase()}
    </span>
  );
}

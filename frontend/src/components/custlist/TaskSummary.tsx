import { STATUS_ICONS } from "./badges";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/lib/custlist/types";

const ITEMS: { status: TaskStatus; label: string; bg: string }[] = [
  { status: "pending", label: "Pendentes", bg: "bg-status-pending" },
  { status: "in_progress", label: "Em andamento", bg: "bg-status-progress" },
  { status: "done", label: "Concluídas", bg: "bg-status-done" },
];

export function TaskSummary({ counts }: { counts: Record<TaskStatus, number> }) {
  return (
    <section aria-labelledby="summary-title" className="surface p-4 compact:p-3">
      <h2 id="summary-title" className="text-base font-bold">
        Resumo
      </h2>
      <ul className="mt-3 grid grid-cols-3 gap-2 compact:mt-2">
        {ITEMS.map(({ status, label, bg }) => {
          const Icon = STATUS_ICONS[status];
          return (
            <li
              key={status}
              className={cn("rounded-lg p-3 text-ink compact:p-2", bg)}
              data-testid={`summary-${status}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums">{counts[status]}</p>
              <p className="mt-1 text-xs font-semibold leading-tight">{label}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

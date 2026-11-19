import { cn } from "@/lib/utils";
import { FILTER_LABELS, STATUS_FILTERS } from "@/lib/custlist/tasks";
import type { StatusFilter } from "@/lib/custlist/types";

interface StatusFiltersProps {
  value: StatusFilter;
  counts: Record<StatusFilter, number>;
  onChange: (value: StatusFilter) => void;
}

export function StatusFilters({ value, counts, onChange }: StatusFiltersProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-semibold">Filtrar por status</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = value === filter;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(filter)}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-sm font-semibold transition-colors compact:min-h-10",
                active
                  ? "border-ink bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:bg-accent",
              )}
            >
              {active && <span aria-hidden="true">✓</span>}
              {FILTER_LABELS[filter]}
              <span className="tabular-nums opacity-80">({counts[filter]})</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

import { FilterX } from "lucide-react";

import { SearchField } from "./SearchField";
import { SortControl } from "./SortControl";
import { StatusFilters } from "./StatusFilters";
import { Button } from "@/components/ui/button";
import type { SortKey, StatusFilter } from "@/lib/custlist/types";

interface TaskToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  statusCounts: Record<StatusFilter, number>;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  resultCount: number;
  totalCount: number;
  onClear: () => void;
}

export function TaskToolbar(props: TaskToolbarProps) {
  const hasFilters = props.query.trim() !== "" || props.status !== "all";
  return (
    <section aria-label="Busca, filtros e ordenação" className="surface space-y-4 p-4 compact:space-y-3 compact:p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchField value={props.query} onChange={props.onQueryChange} />
        <SortControl value={props.sort} onChange={props.onSortChange} />
      </div>
      <StatusFilters
        value={props.status}
        counts={props.statusCounts}
        onChange={props.onStatusChange}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <p aria-live="polite" className="text-sm font-medium text-muted-foreground">
          {props.resultCount === 1
            ? `1 tarefa encontrada de ${props.totalCount}`
            : `${props.resultCount} tarefas encontradas de ${props.totalCount}`}
        </p>
        {hasFilters && (
          <Button variant="link" size="sm" onClick={props.onClear} className="px-1">
            <FilterX aria-hidden="true" />
            Limpar busca e filtros
          </Button>
        )}
      </div>
    </section>
  );
}

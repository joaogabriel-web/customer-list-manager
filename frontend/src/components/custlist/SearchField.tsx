import { Search, X } from "lucide-react";
import { useId } from "react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="text-sm font-semibold">
        Buscar tarefas
      </label>
      <div className="relative mt-1.5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          autoComplete="off"
          maxLength={100}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Título ou descrição"
          className="field pl-9 pr-11 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpar busca"
            className="absolute right-0.5 top-1/2 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

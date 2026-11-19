import { useId } from "react";

import { SORT_KEYS, SORT_LABELS, isSortKey } from "@/lib/custlist/tasks";
import type { SortKey } from "@/lib/custlist/types";

interface SortControlProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
  label?: string;
}

export function SortControl({ value, onChange, label = "Ordenar por" }: SortControlProps) {
  const id = useId();
  return (
    <div className="sm:w-52">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          if (isSortKey(e.target.value)) onChange(e.target.value);
        }}
        className="field mt-1.5"
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  );
}

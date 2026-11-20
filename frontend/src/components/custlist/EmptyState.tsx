import { FilterX, Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Ilustração simples feita só com CSS: uma prancheta com linhas vazias. */
function ClipboardIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-24 w-20">
      <div className="absolute inset-x-0 bottom-0 top-2 rounded-lg border-2 border-dashed border-input bg-muted" />
      <div className="absolute left-1/2 top-0 h-4 w-10 -translate-x-1/2 rounded-md ember-stripe" />
      <div className="absolute inset-x-4 top-9 space-y-2.5">
        <div className="h-1.5 rounded-full bg-input/50" />
        <div className="h-1.5 w-3/4 rounded-full bg-input/50" />
        <div className="h-1.5 w-1/2 rounded-full bg-input/50" />
      </div>
    </div>
  );
}

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="surface px-6 py-10 text-center">
      <ClipboardIllustration />
      <h3 className="mt-4 text-lg font-bold">Sua lista está vazia</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Comece registrando algo que você quer fazer hoje. A tarefa fica salva só neste dispositivo.
      </p>
      <Button className="mt-5" size="lg" onClick={onCreate}>
        <Plus aria-hidden="true" />
        Criar primeira tarefa
      </Button>
    </div>
  );
}

export function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="surface border-dashed px-6 py-10 text-center">
      <SearchX className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 text-lg font-bold">Nenhuma tarefa encontrada</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        A busca e os filtros atuais não correspondem a nenhuma tarefa.
      </p>
      <Button className="mt-5" variant="outline" onClick={onClear}>
        <FilterX aria-hidden="true" />
        Limpar filtros
      </Button>
    </div>
  );
}

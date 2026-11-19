import { FlaskConical, Laptop, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  isDemo: boolean;
  onOpenSettings: () => void;
}

export function AppHeader({ isDemo, onOpenSettings }: AppHeaderProps) {
  return (
    <header className="bg-header text-header-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 compact:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-header-muted">
              <span aria-hidden="true" className="inline-block size-3 rounded-sm ember-stripe" />
              CustList
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Minha Rotina</h1>
          </div>
          <Button variant="header" onClick={onOpenSettings} aria-label="Personalizar aparência">
            <SlidersHorizontal aria-hidden="true" />
            <span className="hidden sm:inline">Personalizar</span>
          </Button>
        </div>
        <p className="flex max-w-2xl items-start gap-2 text-sm text-header-muted sm:text-base">
          <Laptop className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Seus dados ficam somente neste dispositivo, salvos no próprio navegador. Sem conta, sem
            nuvem e sem sincronização.
          </span>
        </p>
        {isDemo && (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-demo px-3 py-1 text-sm font-semibold text-ink">
            <FlaskConical className="size-4" aria-hidden="true" />
            Demonstração com dados simulados
          </p>
        )}
      </div>
      <div aria-hidden="true" className="h-1 ember-stripe" />
    </header>
  );
}

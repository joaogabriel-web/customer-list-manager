import { RotateCcw, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { SortControl } from "./SortControl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type {
  AccentPreference,
  DensityPreference,
  Preferences,
  ThemePreference,
} from "@/lib/custlist/types";

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

const ACCENTS: { value: AccentPreference; label: string; swatch: string }[] = [
  { value: "laranja", label: "Laranja", swatch: "bg-[var(--p-orange)]" },
  { value: "tangerina", label: "Tangerina", swatch: "bg-[var(--p-tangerine)]" },
  { value: "ambar", label: "Âmbar", swatch: "bg-[var(--p-amber)]" },
  { value: "amarelo", label: "Amarelo", swatch: "bg-[var(--p-yellow)]" },
];

const DENSITIES: { value: DensityPreference; label: string; hint: string }[] = [
  { value: "comfortable", label: "Confortável", hint: "Mais espaço entre os itens" },
  { value: "compact", label: "Compacta", hint: "Mostra mais tarefas na tela" },
];

function OptionCard({
  name,
  checked,
  onSelect,
  children,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-[1.5px] px-3 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        checked ? "border-ink bg-accent dark:border-primary" : "border-input hover:bg-accent",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="size-4 accent-[var(--p-orange)] focus-visible:outline-none"
      />
      {children}
    </label>
  );
}

interface CustomizationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: Preferences;
  onUpdate: (patch: Partial<Preferences>) => void;
  onReset: () => void;
  saveFailed: boolean;
  onCloseAutoFocus?: (event: Event) => void;
}

export function CustomizationPanel({
  open,
  onOpenChange,
  preferences,
  onUpdate,
  onReset,
  saveFailed,
  onCloseAutoFocus,
}: CustomizationPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        onCloseAutoFocus={onCloseAutoFocus}
        className="flex w-full flex-col gap-0 overflow-y-auto bg-card p-0 text-card-foreground sm:max-w-md"
      >
        <SheetHeader className="border-b p-5 pr-16 text-left">
          <SheetTitle className="text-xl">Personalização</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Ajuste a aparência da lista. As preferências ficam salvas apenas neste navegador.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 p-5">
          {saveFailed && (
            <p
              role="alert"
              className="flex gap-2 rounded-lg border-2 border-destructive-text bg-destructive-soft p-3 text-sm"
            >
              <TriangleAlert className="size-4 shrink-0 text-destructive-text" aria-hidden="true" />
              <span>
                Não foi possível salvar as preferências neste navegador. Elas valem só até você
                fechar a página.
              </span>
            </p>
          )}

          <fieldset>
            <legend className="text-sm font-bold">Tema</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <OptionCard
                  key={t.value}
                  name="theme"
                  checked={preferences.theme === t.value}
                  onSelect={() => onUpdate({ theme: t.value })}
                >
                  {t.label}
                </OptionCard>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold">Cor de destaque</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ACCENTS.map((a) => (
                <OptionCard
                  key={a.value}
                  name="accent"
                  checked={preferences.accent === a.value}
                  onSelect={() => onUpdate({ accent: a.value })}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-5 shrink-0 rounded-full border border-ink/30", a.swatch)}
                  />
                  {a.label}
                </OptionCard>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold">Densidade</legend>
            <div className="mt-2 grid gap-2">
              {DENSITIES.map((d) => (
                <OptionCard
                  key={d.value}
                  name="density"
                  checked={preferences.density === d.value}
                  onSelect={() => onUpdate({ density: d.value })}
                >
                  <span>
                    {d.label}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {d.hint}
                    </span>
                  </span>
                </OptionCard>
              ))}
            </div>
          </fieldset>

          <SortControl
            label="Ordenação padrão"
            value={preferences.defaultSort}
            onChange={(defaultSort) => onUpdate({ defaultSort })}
          />
        </div>

        <div className="border-t p-5">
          <Button variant="outline" className="w-full" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Restaurar preferências
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

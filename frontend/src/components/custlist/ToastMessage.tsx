import { CircleCheck, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastMessageProps {
  toast: ToastData | null;
  onDismiss: () => void;
  durationMs?: number;
}

/** Região ARIA sempre presente para que leitores de tela anunciem cada nova mensagem. */
export function ToastMessage({ toast, onDismiss, durationMs = 8000 }: ToastMessageProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 lg:bottom-6"
    >
      {toast && (
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl bg-header p-3 pl-4 text-header-foreground shadow-float">
          <CircleCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="min-w-0 flex-1 break-words text-sm font-medium [overflow-wrap:anywhere]">
            {toast.message}
          </p>
          {toast.actionLabel && toast.onAction && (
            <Button size="sm" onClick={toast.onAction}>
              {toast.actionLabel}
            </Button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fechar mensagem"
            className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-header-muted hover:bg-header-foreground/10 hover:text-header-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

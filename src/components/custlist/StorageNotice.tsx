import { TriangleAlert } from "lucide-react";

import type { TasksIssue } from "@/lib/custlist/storage";

const MESSAGES: Record<Exclude<TasksIssue, null>, { title: string; body: string }> = {
  unavailable: {
    title: "Não foi possível acessar o armazenamento deste navegador.",
    body: "Você pode continuar usando a lista, mas as alterações serão perdidas ao fechar ou recarregar a página. Para corrigir, saia da navegação privada ou permita que este site guarde dados.",
  },
  corrupted: {
    title: "Os dados salvos estavam ilegíveis e foram ignorados.",
    body: "Mostramos as tarefas de exemplo no lugar. Assim que você fizer uma alteração, uma lista nova e válida será salva neste dispositivo.",
  },
  write_failed: {
    title: "Suas últimas alterações não foram salvas no dispositivo.",
    body: "Elas continuam disponíveis apenas nesta sessão. O armazenamento do navegador pode estar cheio: libere espaço excluindo tarefas ou dados de sites e tente novamente.",
  },
};

export function StorageNotice({ issue }: { issue: TasksIssue }) {
  if (!issue) return null;
  const { title, body } = MESSAGES[issue];
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border-2 border-destructive-text bg-destructive-soft p-4 text-foreground"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive-text" aria-hidden="true" />
      <div>
        <p className="font-bold text-destructive-text">{title}</p>
        <p className="mt-1 text-sm">{body}</p>
      </div>
    </div>
  );
}

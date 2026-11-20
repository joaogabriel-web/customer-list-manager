import { createFileRoute } from "@tanstack/react-router";

import { TaskApp } from "@/components/custlist/TaskApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CustList — Minha Rotina, sua lista de tarefas local" },
      {
        name: "description",
        content:
          "Organize tarefas e a rotina diária sem criar conta. Tudo fica salvo apenas no seu navegador.",
      },
      { property: "og:title", content: "CustList — Minha Rotina" },
      {
        property: "og:description",
        content: "Lista de tarefas simples, acessível e 100% local: sem conta, sem nuvem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <TaskApp />;
}

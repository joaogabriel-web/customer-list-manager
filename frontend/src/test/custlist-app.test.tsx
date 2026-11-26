import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { TaskApp } from "@/components/custlist/TaskApp";
import { PREFERENCES_KEY, TASKS_KEY } from "@/lib/custlist/storage";
import type { StorageLike } from "@/lib/custlist/types";

beforeAll(() => {
  // jsdom não implementa estes métodos usados para foco e rolagem.
  Element.prototype.scrollIntoView = () => {};
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  };
});

function memoryStorage(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial };
  const storage: StorageLike = {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
  return { storage, data };
}

function savedTasks(data: Record<string, string>) {
  return JSON.parse(data[TASKS_KEY] ?? "{}").tasks as { title: string; status: string }[];
}

async function renderApp(storage: StorageLike | null) {
  render(<TaskApp storage={storage} loadingDelayMs={0} />);
  return screen.findByRole("heading", { name: "Tarefas" });
}

const titleField = () => screen.getByLabelText(/^Título/);

describe("CustList", () => {
  it("mostra o aviso de dados simulados no primeiro acesso", async () => {
    const { storage } = memoryStorage();
    await renderApp(storage);
    expect(screen.getByText("Demonstração com dados simulados")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("cria uma tarefa válida e salva no localStorage", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.change(titleField(), { target: { value: "  Comprar pão  " } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar tarefa" }));

    expect(screen.getByRole("article", { name: "Comprar pão" })).toBeInTheDocument();
    expect(screen.getByText(/adicionada e salva neste dispositivo/)).toBeInTheDocument();
    expect(savedTasks(data)[0]?.title).toBe("Comprar pão");
  });

  it("bloqueia título vazio com mensagem associada ao campo", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.change(titleField(), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar tarefa" }));

    const field = titleField();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(/Informe um título/);
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(data[TASKS_KEY]).toBeUndefined();
  });

  it("edita uma tarefa existente", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.click(screen.getByRole("button", { name: "Editar Pagar a conta de luz" }));

    expect(screen.getByRole("heading", { name: "Editar tarefa" })).toBeInTheDocument();
    expect(titleField()).toHaveValue("Pagar a conta de luz");
    fireEvent.change(titleField(), { target: { value: "Pagar a conta de água" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar tarefa" }));

    expect(screen.getByRole("article", { name: "Pagar a conta de água" })).toBeInTheDocument();
    expect(screen.queryByRole("article", { name: "Pagar a conta de luz" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Nova tarefa" })).toBeInTheDocument();
    expect(savedTasks(data).some((t) => t.title === "Pagar a conta de água")).toBe(true);
  });

  it("altera o status direto no cartão e atualiza o resumo", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    expect(within(screen.getByTestId("summary-done")).getByText("1")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Status de Pagar a conta de luz"), {
      target: { value: "done" },
    });

    expect(within(screen.getByTestId("summary-done")).getByText("2")).toBeInTheDocument();
    expect(savedTasks(data).find((t) => t.title === "Pagar a conta de luz")?.status).toBe("done");
  });

  it("busca, filtra e limpa os filtros", async () => {
    const { storage } = memoryStorage();
    await renderApp(storage);

    fireEvent.click(screen.getByRole("button", { name: /^Em andamento/ }));
    expect(screen.getAllByRole("article")).toHaveLength(2);

    fireEvent.change(screen.getByLabelText("Buscar tarefas"), { target: { value: "livro" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("1 tarefa encontrada de 5")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Buscar tarefas"), { target: { value: "inexistente" } });
    expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("exclui somente após confirmar e permite desfazer", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);

    fireEvent.click(screen.getByRole("button", { name: "Excluir Caminhada de 30 minutos" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Excluir tarefa?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(screen.getAllByRole("article")).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "Excluir Caminhada de 30 minutos" }));
    const again = await screen.findByRole("alertdialog");
    fireEvent.click(within(again).getByRole("button", { name: "Excluir tarefa" }));

    await waitFor(() => expect(screen.getAllByRole("article")).toHaveLength(4));
    expect(savedTasks(data)).toHaveLength(4);

    fireEvent.click(screen.getByRole("button", { name: "Desfazer" }));
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(savedTasks(data)).toHaveLength(5);
  });

  it("continua funcionando em memória quando o localStorage falha", async () => {
    const full: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("cheio", "QuotaExceededError");
      },
      removeItem: () => {},
    };
    await renderApp(full);
    fireEvent.change(titleField(), { target: { value: "Tarefa sem espaço" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar tarefa" }));

    expect(screen.getByRole("article", { name: "Tarefa sem espaço" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("não foram salvas no dispositivo");
    expect(screen.getByText(/só nesta sessão/)).toBeInTheDocument();
  });

  it("avisa quando o armazenamento está indisponível", async () => {
    await renderApp(null);
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível acessar o armazenamento");
  });

  it("carrega tarefas salvas anteriormente", async () => {
    const { storage } = memoryStorage({
      [TASKS_KEY]: JSON.stringify({
        version: 1,
        tasks: [{ id: "a", title: "Minha tarefa salva", status: "pending", priority: "low" }],
      }),
    });
    await renderApp(storage);
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.queryByText("Demonstração com dados simulados")).toBeNull();
  });

  it("salva preferências e as restaura", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.click(screen.getByRole("button", { name: "Personalizar aparência" }));
    const panel = await screen.findByRole("dialog", { name: "Personalização" });

    await act(async () => {
      fireEvent.click(within(panel).getByLabelText("Escuro"));
    });
    expect(document.documentElement).toHaveClass("dark");
    expect(JSON.parse(data[PREFERENCES_KEY] ?? "{}").theme).toBe("dark");

    fireEvent.click(within(panel).getByRole("button", { name: "Restaurar preferências" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(JSON.parse(data[PREFERENCES_KEY] ?? "{}").theme).toBe("light");
  });

  it("salva e aplica a paleta rosa e violeta", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.click(screen.getByRole("button", { name: "Personalizar aparência" }));
    const panel = await screen.findByRole("dialog", { name: "Personalização" });

    await act(async () => {
      fireEvent.click(within(panel).getByLabelText("Rosa e violeta"));
    });

    expect(document.documentElement).toHaveAttribute("data-accent", "rosa-violeta");
    expect(JSON.parse(data[PREFERENCES_KEY] ?? "{}").accent).toBe("rosa-violeta");
  });

  it("aplica e salva tamanho do texto, filtro inicial e estilo de lista", async () => {
    const { storage, data } = memoryStorage();
    await renderApp(storage);
    fireEvent.click(screen.getByRole("button", { name: "Personalizar aparência" }));
    const panel = await screen.findByRole("dialog", { name: "Personalização" });

    await act(async () => {
      fireEvent.click(within(panel).getByLabelText("Grande"));
      fireEvent.click(within(panel).getByLabelText(/Lista/));
      fireEvent.change(within(panel).getByLabelText("Filtro inicial da lista"), {
        target: { value: "in_progress" },
      });
    });

    fireEvent.click(within(panel).getByRole("button", { name: "Fechar" }));
    expect(document.documentElement).toHaveAttribute("data-text-size", "large");
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getAllByRole("article")[0]?.className).toContain(
      "grid-cols-[auto_minmax(0,1fr)]",
    );
    expect(screen.getAllByRole("list").some((list) => list.className.includes("grid-cols-1"))).toBe(
      true,
    );
    expect(JSON.parse(data[PREFERENCES_KEY] ?? "{}")).toMatchObject({
      defaultFilter: "in_progress",
      textSize: "large",
      taskView: "list",
    });
  });

  it("dá nomes acessíveis aos controles principais", async () => {
    const { storage } = memoryStorage();
    await renderApp(storage);
    expect(screen.getByRole("button", { name: "Personalizar aparência" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Título/ })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Buscar tarefas" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Ordenar por" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Filtrar por status" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova tarefa" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Excluir / })).toHaveLength(5);
  });
});

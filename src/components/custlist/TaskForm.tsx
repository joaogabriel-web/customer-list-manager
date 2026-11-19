import { CircleAlert, CircleCheck, Pencil, Plus } from "lucide-react";
import { useEffect, useId, useState, type ChangeEvent, type FormEvent, type RefObject } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DESCRIPTION_MAX,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  TITLE_MAX,
  validateTaskInput,
} from "@/lib/custlist/tasks";
import type { Task, TaskDraft, TaskInput, ValidationErrors } from "@/lib/custlist/types";

const EMPTY: TaskInput = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

type SaveResult = { task: Task; persisted: boolean } | null;

interface TaskFormProps {
  editingTask: Task | null;
  onCreate: (draft: TaskDraft) => SaveResult;
  onUpdate: (id: string, draft: TaskDraft) => SaveResult;
  onFinishEdit: (id: string) => void;
  titleRef: RefObject<HTMLInputElement | null>;
}

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-destructive-text">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export function TaskForm({ editingTask, onCreate, onUpdate, onFinishEdit, titleRef }: TaskFormProps) {
  const uid = useId();
  const ids = {
    title: `${uid}-title`,
    titleError: `${uid}-title-error`,
    titleCount: `${uid}-title-count`,
    titleSuccess: `${uid}-title-success`,
    description: `${uid}-description`,
    descriptionError: `${uid}-description-error`,
    descriptionCount: `${uid}-description-count`,
    status: `${uid}-status`,
    priority: `${uid}-priority`,
    dueDate: `${uid}-due`,
    dueDateError: `${uid}-due-error`,
    heading: `${uid}-heading`,
  };

  const [values, setValues] = useState<TaskInput>(EMPTY);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const editingId = editingTask?.id ?? null;
  const isEditing = editingTask !== null;

  useEffect(() => {
    setErrors({});
    if (editingTask) {
      setSuccess(null);
      setValues({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ?? "",
      });
    } else {
      setValues(EMPTY);
    }
    // Só reinicia o formulário quando muda a tarefa em edição.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  const handleChange =
    (field: keyof TaskInput) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...values, [field]: e.target.value };
      setValues(next);
      if (field === "title") setSuccess(null);
      if (errors[field]) {
        const result = validateTaskInput(next);
        setErrors((prev) => ({ ...prev, [field]: result.ok ? undefined : result.errors[field] }));
      }
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateTaskInput(values);
    if (!result.ok) {
      setErrors(result.errors);
      setSuccess(null);
      const first = result.errors.title
        ? ids.title
        : result.errors.description
          ? ids.description
          : ids.dueDate;
      document.getElementById(first)?.focus();
      return;
    }
    setErrors({});
    if (editingTask) {
      const saved = onUpdate(editingTask.id, result.value);
      if (!saved) return;
      setSuccess(
        saved.persisted
          ? `Alterações em “${saved.task.title}” salvas neste dispositivo.`
          : `Alterações em “${saved.task.title}” aplicadas só nesta sessão: não foi possível salvar no dispositivo.`,
      );
      onFinishEdit(editingTask.id);
    } else {
      const saved = onCreate(result.value);
      if (!saved) return;
      setValues(EMPTY);
      setSuccess(
        saved.persisted
          ? `Tarefa “${saved.task.title}” adicionada e salva neste dispositivo.`
          : `Tarefa “${saved.task.title}” adicionada só nesta sessão: não foi possível salvar no dispositivo.`,
      );
      titleRef.current?.focus();
    }
  };

  const handleCancel = () => {
    if (!editingTask) return;
    setSuccess(null);
    onFinishEdit(editingTask.id);
  };

  const describedBy = (...list: (string | false | null | undefined)[]) =>
    list.filter(Boolean).join(" ") || undefined;

  return (
    <section
      aria-labelledby={ids.heading}
      className={cn(
        "surface scroll-mt-4 p-4 compact:p-3",
        isEditing && "border-2 border-primary",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={ids.heading} className="text-lg font-bold">
          {isEditing ? "Editar tarefa" : "Nova tarefa"}
        </h2>
        {isEditing && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
            <Pencil className="size-3.5" aria-hidden="true" />
            Modo edição
          </span>
        )}
      </div>
      {isEditing && (
        <p className="mt-1 break-words text-sm text-muted-foreground">
          Você está alterando “{editingTask.title}”.
        </p>
      )}

      <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4 compact:mt-3 compact:space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={ids.title} className="text-sm font-semibold">
              Título <span aria-hidden="true">*</span>
              <span className="sr-only">(obrigatório)</span>
            </label>
            <span id={ids.titleCount} className="text-xs tabular-nums text-muted-foreground">
              {values.title.length}/{TITLE_MAX}
              <span className="sr-only"> caracteres</span>
            </span>
          </div>
          <div className="relative mt-1.5">
            <input
              ref={titleRef}
              id={ids.title}
              name="title"
              type="text"
              autoComplete="off"
              maxLength={TITLE_MAX}
              required
              aria-required="true"
              aria-invalid={errors.title ? true : undefined}
              data-success={success ? "true" : undefined}
              aria-describedby={describedBy(
                ids.titleCount,
                errors.title && ids.titleError,
                success && ids.titleSuccess,
              )}
              value={values.title}
              onChange={handleChange("title")}
              placeholder="Ex.: Regar as plantas"
              className={cn("field", (errors.title || success) && "pr-10")}
            />
            {errors.title && (
              <CircleAlert
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-destructive-text"
                aria-hidden="true"
              />
            )}
            {success && !errors.title && (
              <CircleCheck
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-success"
                aria-hidden="true"
              />
            )}
          </div>
          <FieldError id={ids.titleError} message={errors.title} />
          <div role="status" aria-live="polite">
            {success && (
              <p
                id={ids.titleSuccess}
                className="mt-1.5 flex items-start gap-1.5 break-words text-sm font-medium text-success"
              >
                <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{success}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={ids.description} className="text-sm font-semibold">
              Descrição <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <span id={ids.descriptionCount} className="text-xs tabular-nums text-muted-foreground">
              {values.description.length}/{DESCRIPTION_MAX}
              <span className="sr-only"> caracteres</span>
            </span>
          </div>
          <textarea
            id={ids.description}
            name="description"
            rows={3}
            maxLength={DESCRIPTION_MAX}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={describedBy(
              ids.descriptionCount,
              errors.description && ids.descriptionError,
            )}
            value={values.description}
            onChange={handleChange("description")}
            className="field mt-1.5 resize-y"
          />
          <FieldError id={ids.descriptionError} message={errors.description} />
        </div>

        <fieldset className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2 compact:gap-2">
          <legend className="mb-2 text-sm font-semibold">Detalhes</legend>
          <div>
            <label htmlFor={ids.status} className="text-sm font-medium">
              Status
            </label>
            <select
              id={ids.status}
              name="status"
              value={values.status}
              onChange={handleChange("status")}
              className="field mt-1"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={ids.priority} className="text-sm font-medium">
              Prioridade
            </label>
            <select
              id={ids.priority}
              name="priority"
              value={values.priority}
              onChange={handleChange("priority")}
              className="field mt-1"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <label htmlFor={ids.dueDate} className="text-sm font-medium">
              Data <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              id={ids.dueDate}
              name="dueDate"
              type="date"
              aria-invalid={errors.dueDate ? true : undefined}
              aria-describedby={describedBy(errors.dueDate && ids.dueDateError)}
              value={values.dueDate}
              onChange={handleChange("dueDate")}
              className="field mt-1"
            />
            <FieldError id={ids.dueDateError} message={errors.dueDate} />
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" size="lg" className="w-full sm:flex-1">
            {isEditing ? (
              "Salvar tarefa"
            ) : (
              <>
                <Plus aria-hidden="true" />
                Adicionar tarefa
              </>
            )}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

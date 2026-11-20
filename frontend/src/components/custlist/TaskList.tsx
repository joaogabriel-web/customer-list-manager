import { forwardRef } from "react";

import { EmptyState, NoResults } from "./EmptyState";
import { TaskItem } from "./TaskItem";
import type { Task, TaskStatus } from "@/lib/custlist/types";

interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  editingId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onCreateFirst: () => void;
  onClearFilters: () => void;
}

export const TaskList = forwardRef<HTMLHeadingElement, TaskListProps>(function TaskList(
  { tasks, totalCount, editingId, onEdit, onDelete, onStatusChange, onCreateFirst, onClearFilters },
  headingRef,
) {
  return (
    <section aria-labelledby="task-list-title" className="space-y-3">
      <h2 id="task-list-title" ref={headingRef} tabIndex={-1} className="text-xl font-bold">
        Tarefas
      </h2>
      {totalCount === 0 ? (
        <EmptyState onCreate={onCreateFirst} />
      ) : tasks.length === 0 ? (
        <NoResults onClear={onClearFilters} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 compact:gap-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </ul>
      )}
    </section>
  );
});

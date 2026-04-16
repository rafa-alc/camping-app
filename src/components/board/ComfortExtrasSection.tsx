import { useState } from 'react';

import { TaskItem } from '@/components/board/TaskItem';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type {
  TaskStatus,
  TripTask,
} from '@/types/trip';

type ComfortExtrasSectionProps = {
  tasks: TripTask[];
  doneCount: number;
  totalCount: number;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onUpdateCustomTaskTitle: (taskId: string, title: string) => void;
  onDeleteCustomTask: (taskId: string) => void;
};

export const ComfortExtrasSection = ({
  tasks,
  doneCount,
  totalCount,
  onStatusChange,
  onUpdateCustomTaskTitle,
  onDeleteCustomTask,
}: ComfortExtrasSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="panel-surface overflow-hidden">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ui-icon-badge h-11 w-11 shrink-0 rounded-2xl">
            <CategoryIcon category="comfort_extras" className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-pine-700 sm:text-lg">
                Extras de confort
              </h2>
              <span className="ui-chip-muted">Opcional</span>
            </div>
            <p className="mt-1 text-sm text-mist-600">
              {totalCount > 0
                ? `${doneCount} de ${totalCount} listos`
                : 'Elementos opcionales para viajar con más comodidad'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="ui-button-ghost min-w-[5.5rem] justify-center text-center"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>

      <div className={`ui-collapse ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-70'}`}>
        <div className="overflow-hidden border-t border-stone-200/80 bg-[rgba(247,242,234,0.78)]">
          {tasks.map((task) => (
            <div className="border-b border-stone-200/70 last:border-b-0" key={task.id}>
              <TaskItem
                onDeleteCustomTask={onDeleteCustomTask}
                onStatusChange={onStatusChange}
                onUpdateCustomTaskTitle={onUpdateCustomTaskTitle}
                task={task}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

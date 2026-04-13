import { useState } from 'react';

import { TaskItem } from '@/components/board/TaskItem';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { CategoryProgress, TaskStatus, TripTask } from '@/types/trip';
import { CATEGORY_LABELS } from '@/utils/constants';

type CategoryCardProps = {
  summary: CategoryProgress;
  tasks: TripTask[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export const CategoryCard = ({
  summary,
  tasks,
  onStatusChange,
}: CategoryCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="panel-surface overflow-hidden">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ui-icon-badge h-11 w-11 shrink-0 rounded-2xl">
            <CategoryIcon category={summary.category} className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-pine-700 sm:text-lg">
              {CATEGORY_LABELS[summary.category]}
            </h3>
            <p className="mt-1 text-sm text-mist-600">
              {summary.done} of {summary.total} ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`ui-chip-muted ${summary.status === 'done' ? 'border-pine-200 bg-pine-50/80 text-pine-700' : ''}`}>
            {summary.status === 'done' ? 'Ready' : `${summary.total - summary.done} left`}
          </span>
          <button
            className="ui-button-ghost min-w-[5.5rem] justify-center text-center"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-stone-200/80 bg-[#fcfbf8]">
          {tasks.map((task) => (
            <div className="border-b border-stone-200/70 last:border-b-0" key={task.id}>
              <TaskItem
                onStatusChange={onStatusChange}
                task={task}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { TaskStatus, TripTask } from '@/types/trip';

type TaskItemProps = {
  task: TripTask;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export const TaskItem = ({ task, onStatusChange }: TaskItemProps) => {
  const isDone = task.status === 'done';

  return (
    <article
      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
        isDone ? 'bg-stone-50/85' : 'bg-transparent hover:bg-stone-50/65'
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          isDone ? 'bg-stone-200/80 text-mist-400' : 'bg-stone-100 text-mist-500'
        }`}
      >
        <CategoryIcon category={task.category} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-6 sm:text-[15px] ${
            isDone
              ? 'text-mist-500 line-through decoration-mist-400'
              : 'font-medium text-pine-700'
          }`}
        >
          {task.title}
        </p>
      </div>

      <label className="flex shrink-0 items-center">
        <span className="sr-only">
          {isDone ? 'Mark as to do' : 'Mark as done'}: {task.title}
        </span>
        <input
          checked={isDone}
          className="ui-checkbox"
          onChange={() => onStatusChange(task.id, isDone ? 'todo' : 'done')}
          type="checkbox"
        />
      </label>
    </article>
  );
};

import { useEffect, useState } from 'react';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { TaskStatus, TripTask } from '@/types/trip';
import { validateCustomItemName } from '@/utils/validation';

type TaskItemProps = {
  task: TripTask;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onUpdateCustomTaskTitle?: (taskId: string, title: string) => void;
  onDeleteCustomTask?: (taskId: string) => void;
};

export const TaskItem = ({
  task,
  onStatusChange,
  onUpdateCustomTaskTitle,
  onDeleteCustomTask,
}: TaskItemProps) => {
  const isDone = task.status === 'done';
  const isCustom = task.source === 'custom';
  const canManageCustomTask =
    isCustom &&
    typeof onUpdateCustomTaskTitle === 'function' &&
    typeof onDeleteCustomTask === 'function';
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  useEffect(() => {
    setDraftTitle(task.title);
  }, [task.title]);

  const trimmedDraftTitle = draftTitle.trim();
  const customTitleError = validateCustomItemName(draftTitle);

  const handleSaveTitle = () => {
    if (!canManageCustomTask || trimmedDraftTitle.length === 0 || customTitleError) {
      return;
    }

    onUpdateCustomTaskTitle(task.id, trimmedDraftTitle);
    setIsEditing(false);
  };

  return (
    <article
      className={`flex items-center gap-3 px-4 py-3 transition-[background,box-shadow,transform,opacity] duration-200 ease-out ${
        isDone
          ? 'bg-[linear-gradient(180deg,rgba(244,239,231,0.88)_0%,rgba(239,233,223,0.88)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]'
          : 'bg-transparent hover:bg-[linear-gradient(180deg,rgba(249,245,238,0.84)_0%,rgba(243,237,228,0.84)_100%)]'
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-[transform,background-color,color] duration-200 ease-out ${
          isDone
            ? 'bg-[rgba(225,215,200,0.78)] text-mist-400 scale-[0.96]'
            : 'bg-[rgba(243,236,227,0.96)] text-mist-500'
        }`}
      >
        <CategoryIcon category={task.category} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <input
              className="ui-input"
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSaveTitle();
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDraftTitle(task.title);
                  setIsEditing(false);
                }
              }}
              type="text"
              value={draftTitle}
            />
            {customTitleError && (
              <p className="text-xs leading-5 text-rose-700">{customTitleError}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button className="ui-text-button" onClick={handleSaveTitle} type="button">
                Guardar
              </button>
              <button
                className="ui-text-button"
                onClick={() => {
                  setDraftTitle(task.title);
                  setIsEditing(false);
                }}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`text-sm leading-6 transition-colors duration-200 sm:text-[15px] ${
                isDone
                  ? 'text-mist-500 line-through decoration-mist-400'
                  : 'font-medium text-pine-700'
              }`}
            >
              {task.title}
            </p>

            {canManageCustomTask && (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button className="ui-text-button" onClick={() => setIsEditing(true)} type="button">
                  Editar
                </button>
                <button
                  className="ui-text-button text-rose-600 hover:text-rose-700"
                  onClick={() => onDeleteCustomTask?.(task.id)}
                  type="button"
                >
                  Eliminar
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <label className="flex shrink-0 items-center">
        <span className="sr-only">
          {isDone ? 'Marcar como pendiente' : 'Marcar como hecho'}: {task.title}
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

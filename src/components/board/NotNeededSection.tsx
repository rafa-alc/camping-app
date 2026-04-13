import { useEffect, useMemo, useState } from 'react';

import { groupTasksByCategory } from '@/logic/tripLogic';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { TripTask } from '@/types/trip';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/utils/constants';

type NotNeededSectionProps = {
  excludedTasks: TripTask[];
  activeTasks: TripTask[];
  onRestoreTask: (taskId: string) => void;
  onMarkNotNeeded: (taskIds: string[]) => void;
};

export const NotNeededSection = ({
  excludedTasks,
  activeTasks,
  onRestoreTask,
  onMarkNotNeeded,
}: NotNeededSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const groupedActiveTasks = useMemo(
    () => groupTasksByCategory(activeTasks),
    [activeTasks],
  );
  const availableTaskIds = useMemo(
    () => activeTasks.map((task) => task.id),
    [activeTasks],
  );
  const visibleActiveCategories = useMemo(
    () =>
      CATEGORY_ORDER.filter(
        (category) => (groupedActiveTasks[category] ?? []).length > 0,
      ),
    [groupedActiveTasks],
  );

  useEffect(() => {
    setSelectedTaskIds((current) =>
      current.filter((taskId) => availableTaskIds.includes(taskId)),
    );
  }, [availableTaskIds]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((currentTaskId) => currentTaskId !== taskId)
        : [...current, taskId],
    );
  };

  const handleApply = () => {
    if (selectedTaskIds.length === 0) {
      return;
    }

    onMarkNotNeeded(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  return (
    <section className="panel-surface p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Not needed</h2>
          <p className="mt-1 section-helper">
            Keep irrelevant suggestions out of the main flow, while still being able to
            restore them any time.
          </p>
        </div>
        <button
          className="ui-button-secondary"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? 'Hide section' : 'Manage not needed'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6">
          <section>
            <h3 className="ui-subtle-heading">
              Excluded items
            </h3>

            <div className="mt-3 space-y-3">
              {excludedTasks.length === 0 && (
                <div className="rounded-3xl border border-dashed border-stone-200/80 bg-stone-50 p-5 text-sm text-mist-600">
                  No excluded tasks right now.
                </div>
              )}

              {excludedTasks.map((task) => (
                <article
                  className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-[#f8f5ef] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  key={task.id}
                >
                  <div>
                    <div className="font-semibold text-pine-700">{task.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-mist-600">
                      <span className="ui-chip-muted">
                        <CategoryIcon category={task.category} className="h-3.5 w-3.5" />
                        {CATEGORY_LABELS[task.category]}
                      </span>
                      <span className="ui-chip-muted">
                        {task.type === 'essential' ? 'Essential' : 'Extra'}
                      </span>
                    </div>
                  </div>
                  <button
                    className="ui-button-secondary"
                    onClick={() => onRestoreTask(task.id)}
                    type="button"
                  >
                    Restore to to-do
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-stone-200/80 pt-6">
            <div className="flex flex-col gap-2">
              <h3 className="ui-subtle-heading">
                Select active tasks to exclude
              </h3>
              <p className="section-helper">
                Choose one or more active tasks to mark as not needed for this trip.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {visibleActiveCategories.length === 0 && (
                <div className="rounded-3xl border border-dashed border-stone-200/80 bg-stone-50 p-5 text-sm text-mist-600">
                  No active tasks are available to exclude right now.
                </div>
              )}

              {visibleActiveCategories.map((category) => (
                <section key={category}>
                  <div className="flex items-center gap-2">
                    <div className="ui-icon-badge h-8 w-8 rounded-xl">
                      <CategoryIcon category={category} className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-pine-700">
                      {CATEGORY_LABELS[category]}
                    </h4>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(groupedActiveTasks[category] ?? []).map((task) => {
                      const isSelected = selectedTaskIds.includes(task.id);

                      return (
                        <label
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-3 py-3 transition ${
                            isSelected
                              ? 'border-pine-300 bg-pine-50/85'
                              : 'border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50'
                          }`}
                          key={task.id}
                        >
                          <input
                            checked={isSelected}
                            className="mt-1 h-4 w-4 rounded border-stone-300 text-pine-600 focus:ring-pine-500"
                            onChange={() => toggleTaskSelection(task.id)}
                            type="checkbox"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-pine-700">
                              {task.title}
                            </span>
                            {task.description && (
                              <span className="mt-1 block text-sm leading-6 text-mist-600">
                                {task.description}
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-stone-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-mist-600">
                {selectedTaskIds.length === 0
                  ? 'Select one or more tasks to exclude.'
                  : `${selectedTaskIds.length} task${selectedTaskIds.length > 1 ? 's' : ''} selected.`}
              </p>
              <button
                className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
                disabled={selectedTaskIds.length === 0}
                onClick={handleApply}
                type="button"
              >
                Mark as not needed
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

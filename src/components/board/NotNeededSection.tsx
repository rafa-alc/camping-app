import { useEffect, useMemo, useState } from 'react';

import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { groupTasksByCategory } from '@/logic/tripLogic';
import type { TripTask } from '@/types/trip';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/utils/constants';

type NotNeededSectionProps = {
  excludedTasks: TripTask[];
  activeTasks: TripTask[];
  onRestoreTask: (taskId: string) => void;
  onMarkNotNeeded: (taskIds: string[]) => void;
  onDeleteCustomTask?: (taskId: string) => void;
};

export const NotNeededSection = ({
  excludedTasks,
  activeTasks,
  onRestoreTask,
  onMarkNotNeeded,
  onDeleteCustomTask,
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
          <h2 className="section-title">No hace falta</h2>
          <p className="mt-1 section-helper">
            Aparta sugerencias que no encajan en este viaje y recupéralas cuando quieras.
          </p>
        </div>
        <button
          className="ui-button-secondary"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? 'Ocultar' : 'Gestionar'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6">
          <section>
            <h3 className="ui-subtle-heading">Elementos excluidos</h3>

            <div className="mt-3 space-y-3">
              {excludedTasks.length === 0 && (
                <div className="paper-inset-soft rounded-3xl border-dashed p-5 text-sm text-mist-600">
                  No hay elementos excluidos ahora mismo.
                </div>
              )}

              {excludedTasks.map((task) => (
                <article
                  className="paper-inset flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
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
                        {task.type === 'essential' ? 'Esencial' : 'Extra'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.source === 'custom' && onDeleteCustomTask && (
                      <button
                        className="ui-button-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => onDeleteCustomTask(task.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    )}
                    <button
                      className="ui-button-secondary"
                      onClick={() => onRestoreTask(task.id)}
                      type="button"
                    >
                      Volver a pendientes
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-stone-200/80 pt-6">
            <div className="flex flex-col gap-2">
              <h3 className="ui-subtle-heading">Selecciona elementos activos para excluir</h3>
              <p className="section-helper">
                Elige uno o varios elementos activos para apartarlos de este viaje.
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {visibleActiveCategories.length === 0 && (
                <div className="paper-inset-soft rounded-3xl border-dashed p-5 text-sm text-mist-600">
                  No hay elementos activos para excluir ahora mismo.
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
                              ? 'border-pine-300 bg-[linear-gradient(180deg,rgba(234,243,233,0.92)_0%,rgba(244,238,228,0.94)_100%)]'
                              : 'border-stone-200/80 bg-[linear-gradient(180deg,rgba(252,249,244,0.96)_0%,rgba(246,239,230,0.94)_100%)] hover:border-stone-300 hover:bg-[linear-gradient(180deg,rgba(253,250,246,0.98)_0%,rgba(248,242,233,0.98)_100%)]'
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
                  ? 'Selecciona uno o más elementos para excluir.'
                  : `${selectedTaskIds.length} elemento${selectedTaskIds.length > 1 ? 's' : ''} seleccionado${selectedTaskIds.length > 1 ? 's' : ''}.`}
              </p>
              <button
                className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
                disabled={selectedTaskIds.length === 0}
                onClick={handleApply}
                type="button"
              >
                Excluir seleccionados
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

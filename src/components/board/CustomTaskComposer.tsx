import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import type { CustomTaskInput, TaskCategory } from '@/types/trip';
import { CUSTOM_TASK_DESTINATION_LABELS } from '@/utils/constants';
import { CUSTOM_ITEM_MAX_COUNT } from '@/utils/limits';
import { validateCustomItemCount, validateCustomItemName } from '@/utils/validation';

type CustomTaskComposerProps = {
  destinations: TaskCategory[];
  defaultDestination: TaskCategory;
  currentCustomCount: number;
  onCancel: () => void;
  onSubmit: (input: CustomTaskInput) => void;
};

export const CustomTaskComposer = ({
  destinations,
  defaultDestination,
  currentCustomCount,
  onCancel,
  onSubmit,
}: CustomTaskComposerProps) => {
  const initialDestination = destinations.includes(defaultDestination)
    ? defaultDestination
    : destinations[0];

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState<TaskCategory>(initialDestination);

  const trimmedTitle = title.trim();
  const destinationOptions = useMemo(() => destinations, [destinations]);
  const titleError = validateCustomItemName(title);
  const countError = validateCustomItemCount(currentCustomCount);
  const submitError = countError ?? titleError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitError) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      destination,
    });
  };

  return (
    <form
      className="border-b border-stone-200/80 bg-stone-50/80 px-4 py-4 sm:px-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(14rem,1fr)]">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="ui-subtle-heading !tracking-[0.12em]">Nombre del elemento</span>
          <input
            autoFocus
            className="ui-input"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Añadir un elemento personalizado"
            type="text"
            value={title}
          />
          {titleError && <p className="text-xs leading-5 text-rose-700">{titleError}</p>}
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="ui-subtle-heading !tracking-[0.12em]">Añadir a</span>
          <select
            className="ui-input"
            onChange={(event) => setDestination(event.target.value as TaskCategory)}
            value={destination}
          >
            {destinationOptions.map((option) => (
              <option key={option} value={option}>
                {CUSTOM_TASK_DESTINATION_LABELS[option]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs leading-5 text-mist-500">
            Lo que añadas a Extras de confort seguirá siendo opcional. El resto irá a la
            checklist principal.
          </p>
          {countError ? (
            <p className="mt-1 text-xs leading-5 text-rose-700">{countError}</p>
          ) : (
            <p className="mt-1 text-xs leading-5 text-mist-500">
              {currentCustomCount}/{CUSTOM_ITEM_MAX_COUNT} personalizados
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="ui-button-ghost" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button
            className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={submitError !== null || trimmedTitle.length === 0}
            type="submit"
          >
            Añadir elemento
          </button>
        </div>
      </div>
    </form>
  );
};

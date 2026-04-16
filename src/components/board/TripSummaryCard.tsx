import { useState } from 'react';

import { CustomTaskComposer } from '@/components/board/CustomTaskComposer';
import type { CustomTaskInput, TaskCategory, TripContext } from '@/types/trip';
import { CUSTOM_ITEM_MAX_COUNT } from '@/utils/limits';
import { formatFlagSummary, formatTripContext } from '@/utils/format';
import { validateTripName } from '@/utils/validation';

const EditPencilIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M4 20h4l10.5-10.5a1.414 1.414 0 0 0 0-2L16.5 5.5a1.414 1.414 0 0 0-2 0L4 16v4Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
    <path
      d="m13.5 6.5 4 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
);

type TripSummaryCardProps = {
  context: TripContext;
  currentTripName: string | null;
  activeTaskCount: number;
  customTaskCount: number;
  savedTripCount: number;
  saveErrorMessage?: string | null;
  availableDestinations: TaskCategory[];
  onAddCustomTask: (input: CustomTaskInput) => void;
  onClearCurrentTripName: () => void;
  onEditContext: () => void;
  onOpenSummary: () => void;
  onOpenSavedTrips: () => void;
  onSaveTrip: () => void;
  onUpdateCurrentTripName: (name: string) => void;
};

export const TripSummaryCard = ({
  context,
  currentTripName,
  activeTaskCount,
  customTaskCount,
  savedTripCount,
  saveErrorMessage,
  availableDestinations,
  onAddCustomTask,
  onClearCurrentTripName,
  onEditContext,
  onOpenSummary,
  onOpenSavedTrips,
  onSaveTrip,
  onUpdateCurrentTripName,
}: TripSummaryCardProps) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(currentTripName ?? '');
  const tripContextLabel = formatTripContext(context);
  const displayTitle = currentTripName ?? tripContextLabel;
  const trimmedNameDraft = nameDraft.trim();
  const tripNameError = validateTripName(nameDraft);
  const customItemCountReached = customTaskCount >= CUSTOM_ITEM_MAX_COUNT;

  const handleStartEditingName = () => {
    setNameDraft(currentTripName ?? '');
    setIsEditingName(true);
  };

  return (
    <section className="panel-surface overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <span className="ui-chip-soft">Viaje actual</span>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-start gap-2">
              <h2 className="min-w-0 text-2xl font-semibold tracking-tight text-pine-700 sm:text-3xl">
                {displayTitle}
              </h2>
              {!isEditingName && (
                <button
                  aria-label={currentTripName ? 'Renombrar viaje' : 'Poner nombre al viaje'}
                  className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-mist-500 transition hover:bg-stone-100/80 hover:text-pine-700"
                  onClick={handleStartEditingName}
                  type="button"
                >
                  <EditPencilIcon />
                </button>
              )}
            </div>
            {currentTripName && (
              <p className="mt-2 text-sm font-medium text-mist-600">{tripContextLabel}</p>
            )}
            <p className="mt-2 section-helper">
              Una checklist sencilla para este viaje, con extras opcionales y exclusiones
              recuperables sin mezclarlo todo.
            </p>
            {currentTripName && !isEditingName && (
              <div className="mt-3">
                <button className="ui-text-button" onClick={onClearCurrentTripName} type="button">
                  Usar título automático
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <button className="ui-button-primary" onClick={onOpenSummary} type="button">
              Ver resumen
            </button>
            <button className="ui-button-ghost" onClick={onEditContext} type="button">
              Editar contexto
            </button>
          </div>
        </div>

        {isEditingName && (
          <div className="paper-inset p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="ui-subtle-heading !tracking-[0.12em]">Nombre del viaje</span>
                <input
                  autoFocus
                  className="ui-input mt-2"
                  onChange={(event) => setNameDraft(event.target.value)}
                  placeholder="Ponle un nombre a este viaje"
                  type="text"
                  value={nameDraft}
                />
                {tripNameError && (
                  <p className="mt-2 text-xs leading-5 text-rose-700">{tripNameError}</p>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className="ui-button-ghost"
                  onClick={() => {
                    setIsEditingName(false);
                    setNameDraft(currentTripName ?? '');
                  }}
                  type="button"
                >
                  Cancelar
                </button>
                {currentTripName && (
                  <button
                    className="ui-button-secondary"
                    onClick={() => {
                      onClearCurrentTripName();
                      setIsEditingName(false);
                      setNameDraft('');
                    }}
                    type="button"
                  >
                    Quitar nombre
                  </button>
                )}
                <button
                  className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
                  disabled={trimmedNameDraft.length === 0 || tripNameError !== null}
                  onClick={() => {
                    onUpdateCurrentTripName(trimmedNameDraft);
                    setIsEditingName(false);
                  }}
                  type="button"
                >
                  Guardar nombre
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {formatFlagSummary(context).map((item) => (
              <span className="ui-chip-muted" key={item}>
                {item}
              </span>
            ))}
            <span className="ui-chip-muted">{activeTaskCount} secciones</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto sm:shrink-0 sm:flex-nowrap">
            <button
              className="ui-button-secondary whitespace-nowrap disabled:cursor-not-allowed disabled:bg-stone-300"
              disabled={customItemCountReached}
              onClick={() => setIsAddingItem((current) => !current)}
              type="button"
            >
              {isAddingItem ? 'Ocultar formulario' : 'Añadir elemento'}
            </button>
            <button
              className="ui-button-secondary whitespace-nowrap"
              onClick={onSaveTrip}
              type="button"
            >
              Guardar viaje
            </button>
            <button
              className="ui-button-ghost whitespace-nowrap"
              onClick={onOpenSavedTrips}
              type="button"
            >
              {savedTripCount > 0 ? `Viajes guardados (${savedTripCount})` : 'Viajes guardados'}
            </button>
          </div>
        </div>

        {saveErrorMessage && <p className="text-sm leading-6 text-rose-700">{saveErrorMessage}</p>}
        {customItemCountReached && (
          <p className="text-sm leading-6 text-rose-700">
            Has alcanzado el máximo de 100 elementos personalizados para este viaje.
          </p>
        )}
      </div>

      {isAddingItem && (
        <div className="mt-5 border-t border-stone-200/80 pt-5">
          <CustomTaskComposer
            currentCustomCount={customTaskCount}
            defaultDestination="shelter_rest"
            destinations={availableDestinations}
            onCancel={() => setIsAddingItem(false)}
            onSubmit={(input) => {
              onAddCustomTask(input);
              setIsAddingItem(false);
            }}
          />
        </div>
      )}
    </section>
  );
};

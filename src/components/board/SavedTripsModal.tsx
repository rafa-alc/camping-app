import { useEffect, useMemo, useState, type FormEvent } from 'react';

import type { SavedTripRecord } from '@/types/trip';
import { formatSavedTripTimestamp, formatTripContext } from '@/utils/format';
import { validateTripName } from '@/utils/validation';

type SavedTripsModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  savedTrips: SavedTripRecord[];
  activeSavedTripId: string | null;
  statusMessage?: string | null;
  storageSource?: 'local' | 'cloud';
  onClose: () => void;
  onOpenTrip: (savedTripId: string) => void;
  onDuplicateTrip: (savedTripId: string) => void;
  onUseTemplate: (savedTripId: string) => void;
  onRenameTrip: (savedTripId: string, name: string) => void;
  onDeleteTrip: (savedTripId: string) => void;
};

export const SavedTripsModal = ({
  isOpen,
  isLoading = false,
  savedTrips,
  activeSavedTripId,
  statusMessage,
  storageSource = 'local',
  onClose,
  onOpenTrip,
  onDuplicateTrip,
  onUseTemplate,
  onRenameTrip,
  onDeleteTrip,
}: SavedTripsModalProps) => {
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const renameError = validateTripName(renameDraft);

  const sortedTrips = useMemo(
    () =>
      [...savedTrips].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [savedTrips],
  );

  useEffect(() => {
    if (!isOpen) {
      setEditingTripId(null);
      setRenameDraft('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleStartRename = (trip: SavedTripRecord) => {
    setEditingTripId(trip.id);
    setRenameDraft(trip.name);
  };

  const handleSubmitRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTripId || renameDraft.trim().length === 0 || renameError) {
      return;
    }

    onRenameTrip(editingTripId, renameDraft);
    setEditingTripId(null);
    setRenameDraft('');
  };

  return (
    <div className="ui-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface ui-dialog-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ui-chip-soft">Viajes guardados</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-pine-700">
              Tus viajes
            </h2>
            <p className="mt-2 section-helper">
              Guarda y retoma tus preparativos cuando quieras
            </p>
          </div>
          <button
            aria-label="Cerrar viajes guardados"
            className="ui-button-secondary"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {statusMessage && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
              {statusMessage}
            </div>
          )}

          {isLoading && (
            <div className="paper-inset-soft rounded-3xl p-6 text-sm text-mist-600">
              Cargando viajes guardados...
            </div>
          )}

          {!isLoading && sortedTrips.length === 0 && (
            <div className="paper-inset-soft rounded-3xl border-dashed p-6 text-sm text-mist-600">
              Aún no hay viajes guardados. Guarda el viaje actual para conservar una
              instantánea {storageSource === 'cloud' ? 'en la nube' : 'local'} y retomarlo más
              adelante.
            </div>
          )}

          {sortedTrips.map((trip) => {
            const isEditing = editingTripId === trip.id;
            const customTaskCount = trip.tasks.filter((task) => task.source === 'custom').length;
            const completedTaskCount = trip.tasks.filter((task) => task.status === 'done').length;

            return (
              <article className="paper-inset rounded-3xl p-5" key={trip.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold tracking-tight text-pine-700">
                        {trip.name}
                      </h3>
                      {activeSavedTripId === trip.id && (
                        <span className="ui-chip-soft">Abierto</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-mist-600">
                      {formatTripContext(trip.context)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-mist-500">
                      <span className="ui-chip-muted">
                        Actualizado {formatSavedTripTimestamp(trip.updatedAt)}
                      </span>
                      <span className="ui-chip-muted">{trip.tasks.length} elementos</span>
                      <span className="ui-chip-muted">{completedTaskCount} completados</span>
                      {customTaskCount > 0 && (
                        <span className="ui-chip-muted">
                          {customTaskCount} personalizado{customTaskCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:max-w-[17rem] lg:justify-end">
                    <button
                      className="ui-button-secondary"
                      onClick={() => onOpenTrip(trip.id)}
                      type="button"
                    >
                      Abrir
                    </button>
                    <button
                      className="ui-button-secondary"
                      onClick={() => onUseTemplate(trip.id)}
                      type="button"
                    >
                      Usar como plantilla
                    </button>
                    <button
                      className="ui-button-ghost"
                      onClick={() => onDuplicateTrip(trip.id)}
                      type="button"
                    >
                      Duplicar
                    </button>
                    <button
                      className="ui-button-ghost"
                      onClick={() => handleStartRename(trip)}
                      type="button"
                    >
                      Renombrar
                    </button>
                    <button
                      className="ui-button-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => onDeleteTrip(trip.id)}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <form
                    className="mt-4 flex flex-col gap-3 border-t border-stone-200/80 pt-4 sm:flex-row sm:items-end"
                    onSubmit={handleSubmitRename}
                  >
                    <label className="flex-1">
                      <span className="ui-subtle-heading !tracking-[0.12em]">
                        Nombre del viaje
                      </span>
                      <input
                        autoFocus
                        className="ui-input mt-2"
                        onChange={(event) => setRenameDraft(event.target.value)}
                        type="text"
                        value={renameDraft}
                      />
                      {renameError && (
                        <p className="mt-2 text-xs leading-5 text-rose-700">{renameError}</p>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <button
                        className="ui-button-ghost"
                        onClick={() => {
                          setEditingTripId(null);
                          setRenameDraft('');
                        }}
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button
                        className="ui-button-primary disabled:cursor-not-allowed disabled:bg-stone-300"
                        disabled={renameDraft.trim().length === 0 || renameError !== null}
                        type="submit"
                      >
                        Guardar nombre
                      </button>
                    </div>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

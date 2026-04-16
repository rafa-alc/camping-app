import { useEffect, useState } from 'react';

import type {
  AccommodationType,
  PeopleCount,
  TripContextInput,
  TripSetupInput,
  TripDuration,
} from '@/types/trip';
import {
  ACCOMMODATION_OPTIONS,
  DURATION_OPTIONS,
  PEOPLE_OPTIONS,
} from '@/utils/constants';
import { validateTripName } from '@/utils/validation';

type TripSetupFormProps = {
  initialValue: TripContextInput;
  initialTripName: string;
  mode: 'create' | 'edit';
  onSubmit: (value: TripSetupInput) => void;
  onCancel: () => void;
};

type SelectorRowProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; helper: string }>;
  onChange: (value: T) => void;
};

const SelectorRow = <T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectorRowProps<T>) => {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 md:min-h-[5.75rem] md:flex-row md:items-start md:justify-between">
      <div className="md:w-48 md:shrink-0">
        <p className="text-[15px] font-semibold tracking-tight text-pine-800">{label}</p>
        <p className="mt-1 min-h-[2rem] text-[11px] leading-4 text-mist-500">
          {selectedOption?.helper ?? '\u00A0'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:justify-end md:pt-1">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                isSelected
                  ? 'border-pine-500 bg-[linear-gradient(180deg,rgba(67,120,101,1)_0%,rgba(47,102,85,1)_100%)] text-white shadow-[0_10px_18px_-16px_rgba(47,102,85,0.75)]'
                  : 'border-stone-200 bg-[linear-gradient(180deg,rgba(249,245,238,0.98)_0%,rgba(243,236,227,0.98)_100%)] text-pine-700 hover:border-stone-300 hover:bg-[linear-gradient(180deg,rgba(252,248,242,1)_0%,rgba(246,239,230,1)_100%)]'
              }`}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type ToggleRowProps = {
  label: string;
  helper: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const ToggleRow = ({ label, helper, value, onChange }: ToggleRowProps) => (
  <div className="flex flex-col gap-2 px-4 py-3.5 md:min-h-[5.75rem] md:flex-row md:items-start md:justify-between">
    <div className="md:w-48 md:shrink-0">
      <p className="text-[15px] font-semibold tracking-tight text-pine-800">{label}</p>
      <p className="mt-1 min-h-[2rem] text-[11px] leading-4 text-mist-500">{helper}</p>
    </div>

    <div className="flex flex-wrap gap-2 md:justify-end md:pt-1">
      <button
        className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
          !value
            ? 'border-pine-500 bg-[linear-gradient(180deg,rgba(67,120,101,1)_0%,rgba(47,102,85,1)_100%)] text-white shadow-[0_10px_18px_-16px_rgba(47,102,85,0.75)]'
            : 'border-stone-200 bg-[linear-gradient(180deg,rgba(249,245,238,0.98)_0%,rgba(243,236,227,0.98)_100%)] text-pine-700 hover:border-stone-300 hover:bg-[linear-gradient(180deg,rgba(252,248,242,1)_0%,rgba(246,239,230,1)_100%)]'
        }`}
        onClick={() => onChange(false)}
        type="button"
      >
        No
      </button>
      <button
        className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
          value
            ? 'border-pine-500 bg-[linear-gradient(180deg,rgba(67,120,101,1)_0%,rgba(47,102,85,1)_100%)] text-white shadow-[0_10px_18px_-16px_rgba(47,102,85,0.75)]'
            : 'border-stone-200 bg-[linear-gradient(180deg,rgba(249,245,238,0.98)_0%,rgba(243,236,227,0.98)_100%)] text-pine-700 hover:border-stone-300 hover:bg-[linear-gradient(180deg,rgba(252,248,242,1)_0%,rgba(246,239,230,1)_100%)]'
        }`}
        onClick={() => onChange(true)}
        type="button"
      >
        Sí
      </button>
    </div>
  </div>
);

export const TripSetupForm = ({
  initialValue,
  initialTripName,
  mode,
  onSubmit,
  onCancel,
}: TripSetupFormProps) => {
  const [form, setForm] = useState<TripContextInput>(initialValue);
  const [tripName, setTripName] = useState(initialTripName);
  const tripNameError = validateTripName(tripName);

  useEffect(() => {
    setForm(initialValue);
    setTripName(initialTripName);
  }, [initialValue, initialTripName]);

  return (
    <section className="mx-auto w-full max-w-4xl panel-surface p-4 sm:p-5">
      <div className="max-w-2xl">
        <span className="ui-chip-soft">{mode === 'edit' ? 'Editar contexto' : 'Preparar viaje'}</span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-pine-700 sm:text-[2rem]">
          {mode === 'edit'
            ? 'Actualiza los datos del viaje y regenera la checklist'
            : 'Elige los datos del viaje y crea la checklist'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-mist-600">
          Un paso rápido antes de ver la checklist.
        </p>
      </div>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (tripNameError) {
            return;
          }
          onSubmit({
            tripName: tripName.trim(),
            context: form,
          });
        }}
      >
        <div className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(248,243,235,0.96)_0%,rgba(243,236,226,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="px-4 py-3.5 md:flex md:items-start md:justify-between">
            <div className="md:w-48 md:shrink-0">
              <p className="text-[15px] font-semibold tracking-tight text-pine-800">
                Nombre del viaje
              </p>
              <p className="mt-1 min-h-[2rem] text-[11px] leading-4 text-mist-500">
                Opcional. Déjalo vacío si prefieres usar el título automático del viaje.
              </p>
            </div>

            <div className="mt-2 md:mt-0 md:w-[24rem] md:max-w-full md:pt-1">
              <input
                className="ui-input"
                onChange={(event) => setTripName(event.target.value)}
                placeholder="Nombre del viaje (opcional)"
                type="text"
                value={tripName}
              />
              {tripNameError && (
                <p className="mt-2 text-xs leading-5 text-rose-700">{tripNameError}</p>
              )}
            </div>
          </div>

          <div className="border-t border-stone-200/80">
          <SelectorRow<PeopleCount>
            label="Personas"
            onChange={(peopleCount) => setForm((current) => ({ ...current, peopleCount }))}
            options={PEOPLE_OPTIONS}
            value={form.peopleCount}
          />
          </div>

          <div className="border-t border-stone-200/80">
            <SelectorRow<TripDuration>
              label="Duración"
              onChange={(tripDuration) =>
                setForm((current) => ({ ...current, tripDuration }))
              }
              options={DURATION_OPTIONS}
              value={form.tripDuration}
            />
          </div>

          <div className="border-t border-stone-200/80">
            <SelectorRow<AccommodationType>
              label="Alojamiento"
              onChange={(accommodationType) =>
                setForm((current) => ({ ...current, accommodationType }))
              }
              options={ACCOMMODATION_OPTIONS}
              value={form.accommodationType}
            />
          </div>

          <div className="border-t border-stone-200/80">
            <ToggleRow
              helper="Añade una sección de mascota cuando haga falta."
              label="Mascota"
              onChange={(hasPet) => setForm((current) => ({ ...current, hasPet }))}
              value={form.hasPet}
            />
          </div>
        </div>

        {mode === 'edit' && (
          <div className="mt-4 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm leading-6 text-sand-600">
            Al aplicar estos cambios se regenerará la checklist de este viaje. El
            progreso actual no se conservará.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="ui-button-primary px-6 py-3 disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={tripNameError !== null}
            type="submit"
          >
            {mode === 'edit' ? 'Actualizar checklist' : 'Crear checklist'}
          </button>
          <button
            className="ui-button-secondary px-6 py-3 font-semibold"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

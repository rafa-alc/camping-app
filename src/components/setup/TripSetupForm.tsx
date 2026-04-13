import { useEffect, useState } from 'react';

import type {
  AccommodationType,
  PeopleCount,
  TripContextInput,
  TripDuration,
} from '@/types/trip';
import {
  ACCOMMODATION_OPTIONS,
  DURATION_OPTIONS,
  PEOPLE_OPTIONS,
} from '@/utils/constants';

type TripSetupFormProps = {
  initialValue: TripContextInput;
  mode: 'create' | 'edit';
  onSubmit: (value: TripContextInput) => void;
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
                  ? 'border-pine-500 bg-pine-600 text-white'
                  : 'border-stone-200 bg-stone-50 text-pine-700 hover:border-stone-300 hover:bg-white'
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
            ? 'border-pine-500 bg-pine-600 text-white'
            : 'border-stone-200 bg-stone-50 text-pine-700 hover:border-stone-300 hover:bg-white'
        }`}
        onClick={() => onChange(false)}
        type="button"
      >
        No
      </button>
      <button
        className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
          value
            ? 'border-pine-500 bg-pine-600 text-white'
            : 'border-stone-200 bg-stone-50 text-pine-700 hover:border-stone-300 hover:bg-white'
        }`}
        onClick={() => onChange(true)}
        type="button"
      >
        Yes
      </button>
    </div>
  </div>
);

export const TripSetupForm = ({
  initialValue,
  mode,
  onSubmit,
  onCancel,
}: TripSetupFormProps) => {
  const [form, setForm] = useState<TripContextInput>(initialValue);

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  return (
    <section className="mx-auto w-full max-w-4xl panel-surface p-4 sm:p-5">
      <div className="max-w-2xl">
        <span className="ui-chip-soft">{mode === 'edit' ? 'Edit context' : 'Trip setup'}</span>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-pine-700 sm:text-[2rem]">
          {mode === 'edit'
            ? 'Update the trip details and refresh the checklist'
            : 'Choose the trip details and build the checklist'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-mist-600">
          A quick selector step before the checklist appears.
        </p>
      </div>

      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
      >
        <div className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#f8f5ef]">
          <SelectorRow<PeopleCount>
            label="People"
            onChange={(peopleCount) => setForm((current) => ({ ...current, peopleCount }))}
            options={PEOPLE_OPTIONS}
            value={form.peopleCount}
          />

          <div className="border-t border-stone-200/80">
            <SelectorRow<TripDuration>
              label="Duration"
              onChange={(tripDuration) =>
                setForm((current) => ({ ...current, tripDuration }))
              }
              options={DURATION_OPTIONS}
              value={form.tripDuration}
            />
          </div>

          <div className="border-t border-stone-200/80">
            <SelectorRow<AccommodationType>
              label="Stay type"
              onChange={(accommodationType) =>
                setForm((current) => ({ ...current, accommodationType }))
              }
              options={ACCOMMODATION_OPTIONS}
              value={form.accommodationType}
            />
          </div>

          <div className="border-t border-stone-200/80">
            <ToggleRow
              helper="Adds a pet care section if needed."
              label="Pet"
              onChange={(hasPet) => setForm((current) => ({ ...current, hasPet }))}
              value={form.hasPet}
            />
          </div>
        </div>

        {mode === 'edit' && (
          <div className="mt-4 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3 text-sm leading-6 text-sand-600">
            Applying these changes will regenerate the checklist for this trip. Existing
            task progress is not preserved in V1.5.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="ui-button-primary px-6 py-3" type="submit">
            {mode === 'edit' ? 'Regenerate checklist' : 'Create checklist'}
          </button>
          <button
            className="ui-button-secondary px-6 py-3 font-semibold"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

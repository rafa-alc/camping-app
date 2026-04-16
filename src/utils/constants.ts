import { catalogCategories } from '@/catalog';
import type { AccommodationType, PeopleCount, TaskCategory, TripDuration } from '@/types/trip';

export const CATEGORY_ORDER: TaskCategory[] = [
  ...(catalogCategories.map((category) => category.id) as Exclude<
    TaskCategory,
    'comfort_extras'
  >[]),
  'comfort_extras',
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  ...(Object.fromEntries(
    catalogCategories.map((category) => [category.id, category.label]),
  ) as Record<Exclude<TaskCategory, 'comfort_extras'>, string>),
  comfort_extras: 'Extras de confort',
};

export const CUSTOM_TASK_DESTINATIONS: TaskCategory[] = [
  ...CATEGORY_ORDER,
];

export const CUSTOM_TASK_DESTINATION_LABELS = CATEGORY_LABELS;

export const PEOPLE_OPTIONS: Array<{ value: PeopleCount; label: string; helper: string }> = [
  { value: '1', label: 'Solo', helper: 'Una checklist más ligera, centrada en lo esencial.' },
  { value: '2', label: '2 personas', helper: 'Planificación equilibrada para un viaje compartido.' },
  { value: '3', label: '3 personas', helper: 'Algo más de comida, ropa y coordinación.' },
  { value: '4_plus', label: '4+ personas', helper: 'Destaca lo que suele requerir más cantidad.' },
];

export const DURATION_OPTIONS: Array<{ value: TripDuration; label: string; helper: string }> = [
  { value: 'short', label: 'Corta', helper: 'Una escapada rápida con lo imprescindible.' },
  { value: 'medium', label: 'Media', helper: 'Añade suministros para una estancia más estable.' },
  { value: 'long', label: 'Larga', helper: 'Da más peso al confort y a los elementos de uso repetido.' },
];

export const ACCOMMODATION_OPTIONS: Array<{
  value: AccommodationType;
  label: string;
  helper: string;
}> = [
  { value: 'tent', label: 'Tienda', helper: 'Preparación completa de refugio y descanso.' },
  { value: 'caravan', label: 'Caravana', helper: 'Sin montaje de refugio, pero con autonomía propia.' },
  { value: 'bungalow', label: 'Bungaló', helper: 'Menos carga en descanso y cocina.' },
  { value: 'camping_cabin', label: 'Cabaña', helper: 'Más foco en lo personal y en el confort.' },
];

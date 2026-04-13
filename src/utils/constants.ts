import type { AccommodationType, PeopleCount, TaskCategory, TripDuration } from '@/types/trip';

export const CATEGORY_ORDER: TaskCategory[] = [
  'essentials',
  'sleep',
  'shelter',
  'cooking',
  'food',
  'clothing',
  'hygiene',
  'safety',
  'pet',
  'comfort_extras',
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  essentials: 'Trip basics',
  sleep: 'Sleep setup',
  shelter: 'Shelter',
  cooking: 'Cooking',
  food: 'Food',
  clothing: 'Clothing',
  hygiene: 'Hygiene',
  safety: 'Safety',
  pet: 'Pet care',
  comfort_extras: 'Comfort extras',
};

export const PEOPLE_OPTIONS: Array<{ value: PeopleCount; label: string; helper: string }> = [
  { value: '1', label: 'Solo', helper: 'A lighter checklist focused on personal basics.' },
  { value: '2', label: '2 people', helper: 'Balanced planning for a shared trip.' },
  { value: '3', label: '3 people', helper: 'A bit more food, clothing and coordination.' },
  { value: '4_plus', label: '4+ people', helper: 'Highlights items that usually need more quantity.' },
];

export const DURATION_OPTIONS: Array<{ value: TripDuration; label: string; helper: string }> = [
  { value: 'short', label: 'Short', helper: 'Quick getaway with the essentials.' },
  { value: 'medium', label: 'Medium', helper: 'Adds supplies for a steadier stay.' },
  { value: 'long', label: 'Long', helper: 'Prioritizes comfort and repeat-use items.' },
];

export const ACCOMMODATION_OPTIONS: Array<{
  value: AccommodationType;
  label: string;
  helper: string;
}> = [
  { value: 'tent', label: 'Tent', helper: 'Full shelter and sleep preparation.' },
  { value: 'caravan', label: 'Caravan', helper: 'No shelter setup, but still self-sufficient.' },
  { value: 'bungalow', label: 'Bungalow', helper: 'Lighter sleep and cooking needs.' },
  { value: 'camping_cabin', label: 'Camping cabin', helper: 'Focus on personal essentials and comfort.' },
];

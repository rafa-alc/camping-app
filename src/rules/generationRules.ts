import type { AccommodationType, TaskPriority, TripDuration } from '@/types/trip';

export const accommodationBaseTaskIds: Record<AccommodationType, string[]> = {
  tent: [
    'reservation_docs',
    'phone',
    'charger',
    'wallet_keys',
    'water',
    'sleeping_bag',
    'pillow',
    'sleeping_pad',
    'tent',
    'stakes',
    'tarp',
    'stove',
    'cookware',
    'planned_food',
    'snacks',
    'change_clothes',
    'rain_jacket',
    'toothbrush',
    'sunscreen',
    'flashlight',
    'first_aid',
    'camp_chair',
    'ambient_light',
    'special_breakfast',
  ],
  caravan: [
    'reservation_docs',
    'phone',
    'charger',
    'wallet_keys',
    'water',
    'sleeping_bag',
    'pillow',
    'blanket',
    'stove',
    'fuel',
    'planned_food',
    'snacks',
    'change_clothes',
    'rain_jacket',
    'toothbrush',
    'toilet_paper',
    'flashlight',
    'first_aid',
    'camp_chair',
    'speaker',
    'special_breakfast',
  ],
  bungalow: [
    'reservation_docs',
    'phone',
    'charger',
    'wallet_keys',
    'water',
    'pillow',
    'blanket',
    'cookware',
    'planned_food',
    'snacks',
    'change_clothes',
    'rain_jacket',
    'toothbrush',
    'toilet_paper',
    'flashlight',
    'first_aid',
    'camp_chair',
    'ambient_light',
    'speaker',
    'special_breakfast',
  ],
  camping_cabin: [
    'reservation_docs',
    'phone',
    'charger',
    'wallet_keys',
    'water',
    'pillow',
    'planned_food',
    'snacks',
    'change_clothes',
    'rain_jacket',
    'toothbrush',
    'toilet_paper',
    'flashlight',
    'first_aid',
    'camp_chair',
    'ambient_light',
    'speaker',
    'special_breakfast',
  ],
};

export const optionalCategoryTaskIds = {
  pet: ['pet_food', 'pet_bowl', 'pet_bed', 'pet_leash'],
} as const;

export const durationTaskAdditions: Record<TripDuration, string[]> = {
  short: [],
  medium: ['towel', 'power_bank', 'cooler'],
  long: ['towel', 'power_bank', 'cooler', 'warm_clothes'],
};

export const durationPriorityBoosts: Record<TripDuration, string[]> = {
  short: [],
  medium: ['change_clothes', 'planned_food', 'power_bank', 'towel'],
  long: [
    'change_clothes',
    'warm_clothes',
    'planned_food',
    'toothbrush',
    'towel',
    'power_bank',
  ],
};

export const groupQuantityReviewIds = [
  'planned_food',
  'water',
  'cookware',
  'change_clothes',
] as const;

export const raisePriority = (priority: TaskPriority): TaskPriority => {
  if (priority === 'low') {
    return 'medium';
  }

  return 'high';
};

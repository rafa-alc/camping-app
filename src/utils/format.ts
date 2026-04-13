import type {
  AccommodationType,
  PeopleCount,
  TripContext,
  TripDuration,
} from '@/types/trip';

const peopleLabels: Record<PeopleCount, string> = {
  '1': 'Solo',
  '2': '2 people',
  '3': '3 people',
  '4_plus': '4+ people',
};

const durationLabels: Record<TripDuration, string> = {
  short: 'Short stay',
  medium: 'Medium stay',
  long: 'Long stay',
};

const accommodationLabels: Record<AccommodationType, string> = {
  tent: 'Tent',
  caravan: 'Caravan',
  bungalow: 'Bungalow',
  camping_cabin: 'Camping cabin',
};

export const formatTripContext = (context: TripContext): string =>
  `${peopleLabels[context.peopleCount]} / ${durationLabels[context.tripDuration]} / ${accommodationLabels[context.accommodationType]}`;

export const formatFlagSummary = (context: TripContext): string[] => {
  const flags = [
    peopleLabels[context.peopleCount],
    durationLabels[context.tripDuration],
    accommodationLabels[context.accommodationType],
  ];

  if (context.hasPet) {
    flags.push('Pet included');
  }

  return flags;
};

export const formatRate = (rate: number): string => `${Math.round(rate)}%`;

export const getProgressFillStyle = (
  rate: number,
  variant: 'readiness' | 'extras' = 'readiness',
) => {
  if (variant === 'extras') {
    if (rate >= 90) {
      return {
        background:
          'linear-gradient(90deg, rgba(95,144,156,1) 0%, rgba(125,177,150,1) 55%, rgba(214,180,127,1) 100%)',
        boxShadow: '0 0 18px -8px rgba(95,144,156,0.55)',
      };
    }

    if (rate >= 60) {
      return {
        background:
          'linear-gradient(90deg, rgba(66,111,123,1) 0%, rgba(95,144,156,1) 55%, rgba(125,177,150,1) 100%)',
        boxShadow: '0 0 16px -9px rgba(66,111,123,0.45)',
      };
    }

    return {
      background:
        'linear-gradient(90deg, rgba(49,85,96,1) 0%, rgba(66,111,123,1) 100%)',
      boxShadow: '0 0 14px -10px rgba(49,85,96,0.4)',
    };
  }

  if (rate >= 90) {
    return {
      background:
        'linear-gradient(90deg, rgba(47,102,85,1) 0%, rgba(77,138,112,1) 55%, rgba(214,180,127,1) 100%)',
      boxShadow: '0 0 18px -8px rgba(77,138,112,0.55)',
    };
  }

  if (rate >= 60) {
    return {
      background:
        'linear-gradient(90deg, rgba(34,77,65,1) 0%, rgba(47,102,85,1) 55%, rgba(77,138,112,1) 100%)',
      boxShadow: '0 0 16px -9px rgba(47,102,85,0.45)',
    };
  }

  return {
    background:
      'linear-gradient(90deg, rgba(24,57,47,1) 0%, rgba(34,77,65,1) 100%)',
    boxShadow: '0 0 14px -10px rgba(24,57,47,0.4)',
  };
};

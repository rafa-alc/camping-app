import type { CatalogPool, CatalogTripContext } from '@/catalog/types';

export const matchesPoolConditions = (
  pool: CatalogPool,
  context: CatalogTripContext,
): boolean => {
  if (!pool.conditions) {
    return true;
  }

  const {
    accommodationIn,
    tripDurationIn,
    peopleCountIn,
    requiresPet,
  } = pool.conditions;

  if (
    accommodationIn &&
    !accommodationIn.includes(context.accommodationType)
  ) {
    return false;
  }

  if (tripDurationIn && !tripDurationIn.includes(context.tripDuration)) {
    return false;
  }

  if (peopleCountIn && !peopleCountIn.includes(context.peopleCount)) {
    return false;
  }

  if (
    typeof requiresPet === 'boolean' &&
    context.hasPet !== requiresPet
  ) {
    return false;
  }

  return true;
};

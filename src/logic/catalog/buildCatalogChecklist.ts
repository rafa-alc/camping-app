import type { CatalogTripContext } from '@/catalog/types';
import { getActivePools } from '@/logic/catalog/getActivePools';
import { mapPoolsToTasks } from '@/logic/catalog/mapPoolsToTasks';
import type { TripTask } from '@/types/trip';

export const buildCatalogChecklist = (
  context: CatalogTripContext,
): Array<Omit<TripTask, 'id'>> => mapPoolsToTasks(getActivePools(context));

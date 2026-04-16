import {
  createDuplicateTripInventoryReward,
  createLegacyTripInventoryReward,
  createTemplateTripInventoryReward,
} from '@/logic/inventory';
import type { SavedTripRecord, TripContext, TripInventoryReward, TripTask } from '@/types/trip';
import { buildSavedTripName } from '@/utils/format';
import { createId } from '@/utils/id';
import { TRIP_NAME_MAX_LENGTH } from '@/utils/limits';

export const cloneContext = (context: TripContext): TripContext => ({ ...context });

export const cloneTasks = (tasks: TripTask[]): TripTask[] =>
  tasks.map((task) => ({ ...task }));

export const normalizeTripName = (name: string | null | undefined): string | null => {
  if (typeof name !== 'string') {
    return null;
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0 || trimmedName.length > TRIP_NAME_MAX_LENGTH) {
    return null;
  }

  return trimmedName;
};

export const resolveTripName = (
  context: TripContext,
  currentTripName?: string | null,
  explicitName?: string | null,
): string =>
  normalizeTripName(explicitName) ??
  normalizeTripName(currentTripName) ??
  buildSavedTripName(context);

export const createSavedTripRecord = (
  context: TripContext,
  tasks: TripTask[],
  inventoryReward: TripInventoryReward,
  name?: string,
): SavedTripRecord => {
  const timestamp = new Date().toISOString();
  const normalizedName = name?.trim();

  return {
    id: createId(),
    name:
      normalizedName && normalizedName.length > 0
        ? normalizedName
        : buildSavedTripName(context),
    createdAt: timestamp,
    updatedAt: timestamp,
    context: cloneContext(context),
    inventoryReward: { ...inventoryReward },
    tasks: cloneTasks(tasks),
  };
};

export const cloneTaskForTemplate = (task: TripTask, nextContextId: string): TripTask => {
  const nextStatus = task.status === 'not_needed' ? 'not_needed' : 'todo';

  if (task.source === 'catalog') {
    return {
      ...task,
      id: `${nextContextId}-${task.templateId}`,
      status: nextStatus,
    };
  }

  const customId = createId();

  return {
    ...task,
    id: `${nextContextId}-custom-${customId}`,
    templateId: `custom-${customId}`,
    status: nextStatus,
  };
};

export const createTripStateFromSavedTrip = (savedTrip: SavedTripRecord) => ({
  activeSavedTripId: savedTrip.id,
  context: cloneContext(savedTrip.context),
  currentTripName: savedTrip.name,
  inventoryReward: { ...savedTrip.inventoryReward },
  tasks: cloneTasks(savedTrip.tasks),
  lastUpdatedAt: savedTrip.updatedAt,
});

export const createTripStateFromTemplate = (savedTrip: SavedTripRecord) => {
  const nextContext: TripContext = {
    ...cloneContext(savedTrip.context),
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  return {
    activeSavedTripId: null,
    context: nextContext,
    currentTripName: savedTrip.name,
    inventoryReward: createTemplateTripInventoryReward(savedTrip.inventoryReward),
    tasks: savedTrip.tasks.map((task) => cloneTaskForTemplate(task, nextContext.id)),
    lastUpdatedAt: new Date().toISOString(),
  };
};

export const createDuplicatedSavedTripRecord = (
  savedTrip: SavedTripRecord,
  duplicatedTripId: string,
  timestamp = new Date().toISOString(),
): SavedTripRecord => ({
  ...savedTrip,
  id: duplicatedTripId,
  name: `${savedTrip.name} copia`,
  createdAt: timestamp,
  updatedAt: timestamp,
  context: cloneContext(savedTrip.context),
  inventoryReward: createDuplicateTripInventoryReward(),
  tasks: cloneTasks(savedTrip.tasks),
});

export const createLegacySavedTripRecord = (
  savedTrip: Omit<SavedTripRecord, 'inventoryReward'>,
): SavedTripRecord => ({
  ...savedTrip,
  inventoryReward: createLegacyTripInventoryReward(),
});

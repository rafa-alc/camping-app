import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  cloneContext,
  cloneTasks,
  createDuplicatedSavedTripRecord,
  createSavedTripRecord,
  createTripStateFromSavedTrip,
  createTripStateFromTemplate,
  normalizeTripName,
  resolveTripName,
} from '@/logic/savedTrips';
import {
  buildClaimedTripInventoryReward,
  createLegacyTripInventoryReward,
  createNewTripInventoryReward,
  grantUserProgressReward,
  sanitizeUserProgress,
  sanitizeTripInventoryReward,
} from '@/logic/inventory';
import { generateTripTasks } from '@/logic/tripLogic';
import type {
  CustomTaskInput,
  SavedTripRecord,
  TaskSource,
  TaskCategory,
  TaskStatus,
  TripContext,
  TripContextInput,
  TripState,
  TripTask,
  UserProgress,
} from '@/types/trip';
import { buildSavedTripName } from '@/utils/format';
import { createId } from '@/utils/id';
import {
  CUSTOM_ITEM_MAX_COUNT,
  CUSTOM_ITEM_NAME_MAX_LENGTH,
  TRIP_NAME_MAX_LENGTH,
} from '@/utils/limits';
import { normalizeTextInput } from '@/utils/validation';

type TripStore = TripState & {
  savedTrips: SavedTripRecord[];
  activeSavedTripId: string | null;
  localTotalPointsInventory: number;
  rewardedTripContextIds: string[];
  createTrip: (input: TripContextInput) => void;
  updateCurrentTripName: (name: string) => void;
  clearCurrentTripName: () => void;
  saveCurrentTrip: (name?: string) => void;
  loadSavedTrip: (savedTripId: string) => void;
  deleteSavedTrip: (savedTripId: string) => void;
  duplicateSavedTrip: (savedTripId: string) => void;
  createTripFromTemplate: (savedTripId: string) => void;
  renameSavedTrip: (savedTripId: string, name: string) => void;
  openSavedTripRecord: (savedTrip: SavedTripRecord) => void;
  createTripFromSavedRecord: (savedTrip: SavedTripRecord) => void;
  setActiveSavedTripId: (savedTripId: string | null) => void;
  updateTripContext: (input: TripContextInput) => void;
  resetTrip: () => void;
  addCustomTask: (input: CustomTaskInput) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  restoreTaskFromNotNeeded: (taskId: string) => void;
  updateCustomTaskTitle: (taskId: string, title: string) => void;
  deleteCustomTask: (taskId: string) => void;
  markCurrentTripInventoryRewardClaimed: (claimedAt?: string) => void;
  grantLocalTripInventoryReward: () => void;
};

const initialState: TripState = {
  context: null,
  currentTripName: null,
  inventoryReward: null,
  tasks: [],
  lastUpdatedAt: null,
  activeSavedTripId: null,
};

const createContext = (input: TripContextInput, previous?: TripContext): TripContext => ({
  id: previous?.id ?? createId(),
  createdAt: previous?.createdAt ?? new Date().toISOString(),
  ...input,
});

const touchTimestamp = () => new Date().toISOString();

const sanitizeTaskStatus = (status: unknown): TaskStatus =>
  status === 'done' || status === 'not_needed' ? status : 'todo';

const sanitizeTaskSource = (source: unknown): TaskSource =>
  source === 'custom' ? 'custom' : 'catalog';

const sanitizePersistedContext = (context: Record<string, unknown> | null | undefined) => {
  if (!context) {
    return null;
  }

  return {
    id: typeof context.id === 'string' ? context.id : createId(),
    createdAt:
      typeof context.createdAt === 'string'
        ? context.createdAt
        : new Date().toISOString(),
    peopleCount: context.peopleCount as TripContext['peopleCount'],
    tripDuration: context.tripDuration as TripContext['tripDuration'],
    accommodationType: context.accommodationType as TripContext['accommodationType'],
    hasPet: Boolean(context.hasPet),
  } satisfies TripContext;
};

const sanitizeSavedTripRecord = (
  record:
    | (Partial<SavedTripRecord> & { context?: Record<string, unknown> | null })
    | undefined,
): SavedTripRecord | null => {
  if (!record) {
    return null;
  }

  const context = sanitizePersistedContext(record.context);

  if (!context) {
    return null;
  }

  const createdAt =
    typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString();
  const updatedAt =
    typeof record.updatedAt === 'string' ? record.updatedAt : createdAt;
  const name =
    typeof record.name === 'string' && record.name.trim().length > 0
      ? record.name.trim()
      : buildSavedTripName(context);

  return {
    id: typeof record.id === 'string' ? record.id : createId(),
    name,
    createdAt,
    updatedAt,
    context,
    inventoryReward: sanitizeTripInventoryReward(record.inventoryReward),
    tasks: sanitizePersistedTasks(record.tasks),
  };
};

const createCustomTask = (
  context: TripContext,
  input: CustomTaskInput,
): TripTask => {
  const customId = createId();
  const normalizedType = input.destination === 'comfort_extras' ? 'extra' : 'essential';
  const normalizedCategory: TaskCategory = input.destination;

  return {
    id: `${context.id}-custom-${customId}`,
    templateId: `custom-${customId}`,
    source: 'custom',
    title: input.title.trim(),
    category: normalizedCategory,
    priority: normalizedType === 'essential' ? 'medium' : 'low',
    type: normalizedType,
    status: 'todo',
    points: normalizedType === 'essential' ? 10 : 5,
  };
};

const sanitizePersistedTasks = (tasks: TripTask[] | undefined): TripTask[] =>
  (tasks ?? []).map((task) => ({
    ...task,
    source: sanitizeTaskSource(task.source),
    status: sanitizeTaskStatus(task.status),
  }));

const updateTaskCollection = (
  tasks: TripTask[],
  taskId: string,
  status: TaskStatus,
): TripTask[] =>
  tasks.map((task) => (task.id === taskId ? { ...task, status } : task));

const updateActiveSavedTripReward = (
  savedTrips: SavedTripRecord[],
  activeSavedTripId: string | null | undefined,
  inventoryReward: TripState['inventoryReward'],
) => {
  if (!activeSavedTripId || !inventoryReward) {
    return savedTrips;
  }

  return savedTrips.map((trip) =>
    trip.id === activeSavedTripId
      ? {
          ...trip,
          inventoryReward: { ...inventoryReward },
          updatedAt: touchTimestamp(),
        }
      : trip,
  );
};

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      savedTrips: [],
      activeSavedTripId: null,
      localTotalPointsInventory: 0,
      rewardedTripContextIds: [],
      createTrip: (input) => {
        const context = createContext(input);
        const tasks = generateTripTasks(context);

        set({
          activeSavedTripId: null,
          context,
          currentTripName: null,
          inventoryReward: createNewTripInventoryReward(),
          tasks,
          lastUpdatedAt: touchTimestamp(),
        });
      },
      updateCurrentTripName: (name) => {
        const normalizedName = normalizeTripName(name);

        if (!normalizedName) {
          return;
        }

        set({
          currentTripName: normalizedName,
        });
      },
      clearCurrentTripName: () => {
        set({
          currentTripName: null,
        });
      },
      saveCurrentTrip: (name) => {
        const {
          context,
          currentTripName,
          inventoryReward,
          tasks,
          activeSavedTripId,
          savedTrips,
        } = get();

        if (!context || !inventoryReward || tasks.length === 0) {
          return;
        }

        const timestamp = touchTimestamp();
        const resolvedName = resolveTripName(context, currentTripName, name);
        const existingRecord = activeSavedTripId
          ? savedTrips.find((trip) => trip.id === activeSavedTripId)
          : null;

        if (existingRecord) {
          set({
            activeSavedTripId: existingRecord.id,
            savedTrips: savedTrips.map((trip) =>
              trip.id === existingRecord.id
                ? {
                    ...trip,
                    name: resolvedName,
                    updatedAt: timestamp,
                    context: cloneContext(context),
                    inventoryReward: { ...inventoryReward },
                    tasks: cloneTasks(tasks),
                  }
                : trip,
            ),
          });

          return;
        }

        const savedTrip = createSavedTripRecord(context, tasks, inventoryReward, resolvedName);

        set({
          currentTripName: resolvedName,
          activeSavedTripId: savedTrip.id,
          savedTrips: [savedTrip, ...savedTrips],
        });
      },
      openSavedTripRecord: (savedTrip) => {
        set(createTripStateFromSavedTrip(savedTrip));
      },
      createTripFromSavedRecord: (savedTrip) => {
        set(createTripStateFromTemplate(savedTrip));
      },
      setActiveSavedTripId: (savedTripId) => {
        set({
          activeSavedTripId: savedTripId,
        });
      },
      loadSavedTrip: (savedTripId) => {
        const savedTrip = get().savedTrips.find((trip) => trip.id === savedTripId);

        if (!savedTrip) {
          return;
        }

        get().openSavedTripRecord(savedTrip);
      },
      deleteSavedTrip: (savedTripId) => {
        set((state) => ({
          activeSavedTripId:
            state.activeSavedTripId === savedTripId ? null : state.activeSavedTripId,
          savedTrips: state.savedTrips.filter((trip) => trip.id !== savedTripId),
        }));
      },
      duplicateSavedTrip: (savedTripId) => {
        const savedTrip = get().savedTrips.find((trip) => trip.id === savedTripId);

        if (!savedTrip) {
          return;
        }

        const timestamp = touchTimestamp();
        const duplicatedTrip = createDuplicatedSavedTripRecord(
          savedTrip,
          createId(),
          timestamp,
        );

        set((state) => ({
          savedTrips: [duplicatedTrip, ...state.savedTrips],
        }));
      },
      createTripFromTemplate: (savedTripId) => {
        const savedTrip = get().savedTrips.find((trip) => trip.id === savedTripId);

        if (!savedTrip) {
          return;
        }

        get().createTripFromSavedRecord(savedTrip);
      },
      renameSavedTrip: (savedTripId, name) => {
        const normalizedName = normalizeTextInput(name);

        if (normalizedName.length === 0 || normalizedName.length > TRIP_NAME_MAX_LENGTH) {
          return;
        }

        set((state) => ({
          currentTripName:
            state.activeSavedTripId === savedTripId ? normalizedName : state.currentTripName,
          savedTrips: state.savedTrips.map((trip) =>
            trip.id === savedTripId ? { ...trip, name: normalizedName } : trip,
          ),
        }));
      },
      updateTripContext: (input) => {
        const previous = get().context;
        const context = createContext(input, previous ?? undefined);
        const tasks = generateTripTasks(context);

        set({
          context,
          currentTripName: get().currentTripName,
          inventoryReward: get().inventoryReward ?? createLegacyTripInventoryReward(),
          tasks,
          lastUpdatedAt: touchTimestamp(),
        });
      },
      addCustomTask: (input) => {
        const context = get().context;
        const title = normalizeTextInput(input.title);
        const customTaskCount = get().tasks.filter((task) => task.source === 'custom').length;

        if (
          !context ||
          title.length === 0 ||
          title.length > CUSTOM_ITEM_NAME_MAX_LENGTH ||
          customTaskCount >= CUSTOM_ITEM_MAX_COUNT
        ) {
          return;
        }

        set((state) => ({
          tasks: [...state.tasks, createCustomTask(context, { ...input, title })],
          lastUpdatedAt: touchTimestamp(),
        }));
      },
      markCurrentTripInventoryRewardClaimed: (claimedAt = touchTimestamp()) => {
        set((state) => {
          if (!state.inventoryReward) {
            return state;
          }

          const nextInventoryReward = buildClaimedTripInventoryReward(
            state.inventoryReward,
            claimedAt,
          );

          return {
            inventoryReward: nextInventoryReward,
            lastUpdatedAt: claimedAt,
            savedTrips: updateActiveSavedTripReward(
              state.savedTrips,
              state.activeSavedTripId,
              nextInventoryReward,
            ),
          };
        });
      },
      grantLocalTripInventoryReward: () => {
        const { context, inventoryReward, localTotalPointsInventory, rewardedTripContextIds } = get();

        if (!context || !inventoryReward) {
          return;
        }

        const claimedAt = touchTimestamp();
        const nextProgress: UserProgress = grantUserProgressReward(
          {
            totalPoints: localTotalPointsInventory,
            rewardedTripContextIds,
          },
          context.id,
        );
        const nextInventoryReward = buildClaimedTripInventoryReward(inventoryReward, claimedAt);

        set((state) => ({
          inventoryReward: nextInventoryReward,
          lastUpdatedAt: claimedAt,
          localTotalPointsInventory: nextProgress.totalPoints,
          rewardedTripContextIds: nextProgress.rewardedTripContextIds,
          savedTrips: updateActiveSavedTripReward(
            state.savedTrips,
            state.activeSavedTripId,
            nextInventoryReward,
          ),
        }));
      },
      resetTrip: () => {
        set({
          ...initialState,
          savedTrips: get().savedTrips,
          activeSavedTripId: null,
        });
      },
      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: updateTaskCollection(state.tasks, taskId, status),
          lastUpdatedAt: touchTimestamp(),
        }));
      },
      restoreTaskFromNotNeeded: (taskId) => {
        set((state) => ({
          tasks: updateTaskCollection(state.tasks, taskId, 'todo'),
          lastUpdatedAt: touchTimestamp(),
        }));
      },
      updateCustomTaskTitle: (taskId, title) => {
        const normalizedTitle = normalizeTextInput(title);

        if (
          normalizedTitle.length === 0 ||
          normalizedTitle.length > CUSTOM_ITEM_NAME_MAX_LENGTH
        ) {
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId && task.source === 'custom'
              ? { ...task, title: normalizedTitle }
              : task,
          ),
          lastUpdatedAt: touchTimestamp(),
        }));
      },
      deleteCustomTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => !(task.id === taskId && task.source === 'custom'),
          ),
          lastUpdatedAt: touchTimestamp(),
        }));
      },
    }),
    {
      name: 'campin-trip-storage',
      version: 8,
      migrate: (persistedState, version) => {
        const state = persistedState as (TripState & {
          activeSavedTripId?: string | null;
          currentTripName?: string | null;
          inventoryReward?: unknown;
          localTotalPointsInventory?: number;
          rewardedTripContextIds?: unknown;
          context?: Record<string, unknown> | null;
          savedTrips?: Array<
            Partial<SavedTripRecord> & { context?: Record<string, unknown> | null }
          >;
          tasks?: TripTask[];
        }) | undefined;

        if (!state) {
          return initialState;
        }

        const context = sanitizePersistedContext(state.context);
        const savedTrips = (state.savedTrips ?? [])
          .map((record) => sanitizeSavedTripRecord(record))
          .filter((record): record is SavedTripRecord => record !== null);
        const activeSavedTripId =
          typeof state.activeSavedTripId === 'string'
            ? state.activeSavedTripId
            : null;
        const activeSavedTrip = activeSavedTripId
          ? savedTrips.find((trip) => trip.id === activeSavedTripId) ?? null
          : null;
        const localUserProgress = sanitizeUserProgress({
          totalPoints: state.localTotalPointsInventory,
          rewardedTripContextIds: state.rewardedTripContextIds,
        });
        const inventoryReward =
          version < 8
            ? context
              ? createLegacyTripInventoryReward()
              : null
            : context
              ? sanitizeTripInventoryReward(state.inventoryReward)
              : null;

        return {
          ...state,
          activeSavedTripId,
          context,
          currentTripName:
            normalizeTripName(state.currentTripName) ?? activeSavedTrip?.name ?? null,
          inventoryReward: activeSavedTrip?.inventoryReward ?? inventoryReward,
          localTotalPointsInventory: localUserProgress.totalPoints,
          rewardedTripContextIds: localUserProgress.rewardedTripContextIds,
          savedTrips,
          tasks:
            version < 4
              ? context
                ? generateTripTasks(context)
                : []
              : state.tasks
                ? sanitizePersistedTasks(state.tasks)
                : context
                  ? generateTripTasks(context)
                  : [],
        };
      },
      partialize: (state) => ({
        activeSavedTripId: state.activeSavedTripId,
        context: state.context,
        currentTripName: state.currentTripName,
        inventoryReward: state.inventoryReward,
        localTotalPointsInventory: state.localTotalPointsInventory,
        rewardedTripContextIds: state.rewardedTripContextIds,
        savedTrips: state.savedTrips,
        tasks: state.tasks,
        lastUpdatedAt: state.lastUpdatedAt,
      }),
    },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { taskCatalog } from '@/catalog/taskCatalog';
import { generateTripTasks } from '@/logic/tripLogic';
import type { TaskStatus, TripContext, TripContextInput, TripState, TripTask } from '@/types/trip';
import { createId } from '@/utils/id';

type TripStore = TripState & {
  createTrip: (input: TripContextInput) => void;
  updateTripContext: (input: TripContextInput) => void;
  resetTrip: () => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  restoreTaskFromNotNeeded: (taskId: string) => void;
};

const initialState: TripState = {
  context: null,
  tasks: [],
  lastUpdatedAt: null,
};

const createContext = (input: TripContextInput, previous?: TripContext): TripContext => ({
  id: previous?.id ?? createId(),
  createdAt: previous?.createdAt ?? new Date().toISOString(),
  ...input,
});

const touchTimestamp = () => new Date().toISOString();

const sanitizeTaskStatus = (status: string): TaskStatus =>
  status === 'done' || status === 'not_needed' ? status : 'todo';

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

const updateTaskCollection = (
  tasks: TripTask[],
  taskId: string,
  status: TaskStatus,
): TripTask[] =>
  tasks.map((task) => (task.id === taskId ? { ...task, status } : task));

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      createTrip: (input) => {
        const context = createContext(input);
        const tasks = generateTripTasks(context, taskCatalog);

        set({
          context,
          tasks,
          lastUpdatedAt: touchTimestamp(),
        });
      },
      updateTripContext: (input) => {
        const previous = get().context;
        const context = createContext(input, previous ?? undefined);
        const tasks = generateTripTasks(context, taskCatalog);

        set({
          context,
          tasks,
          lastUpdatedAt: touchTimestamp(),
        });
      },
      resetTrip: () => {
        set(initialState);
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
    }),
    {
      name: 'campin-trip-storage',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as (TripState & {
          context?: Record<string, unknown> | null;
          tasks?: Array<TripTask & { category?: string }>;
        }) | undefined;

        if (!state) {
          return initialState;
        }

        return {
          ...state,
          context: sanitizePersistedContext(state.context),
          tasks: (state.tasks ?? [])
            .filter((task) => String(task.category) !== 'children')
            .map((task) => ({
              ...task,
              status: sanitizeTaskStatus(task.status),
            })),
        };
      },
      partialize: (state) => ({
        context: state.context,
        tasks: state.tasks,
        lastUpdatedAt: state.lastUpdatedAt,
      }),
    },
  ),
);

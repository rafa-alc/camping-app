import { buildCatalogChecklist } from '@/logic/catalog/buildCatalogChecklist';
import type {
  CategoryProgress,
  GroupedTasks,
  TaskCategory,
  TripContext,
  TripProgress,
  TripTask,
} from '@/types/trip';
import { CATEGORY_ORDER } from '@/utils/constants';
import { POCKET_POINTS_MAX } from '@/utils/limits';

const activeTasksOnly = (tasks: TripTask[]) =>
  tasks.filter((task) => task.status !== 'not_needed');

export const generateTripTasks = (
  context: TripContext,
): TripTask[] => {
  return buildCatalogChecklist(context).map((task) => ({
    ...task,
    id: `${context.id}-${task.templateId}`,
  }));
};

export const groupTasksByCategory = (tasks: TripTask[]): GroupedTasks =>
  tasks.reduce<GroupedTasks>((groups, task) => {
    const currentGroup = groups[task.category] ?? [];
    groups[task.category] = [...currentGroup, task];
    return groups;
  }, {});

export const getVisibleCategories = (tasks: TripTask[]): TaskCategory[] => {
  const grouped = groupTasksByCategory(tasks);

  return CATEGORY_ORDER.filter((category) =>
    (grouped[category] ?? []).some((task) => task.status !== 'not_needed'),
  );
};

export const getTaskPoints = (task: TripTask): number =>
  task.status === 'done' ? task.points : 0;

export const getCategoryProgress = (
  tasksByCategory: GroupedTasks,
): CategoryProgress[] =>
  CATEGORY_ORDER.filter((category) => (tasksByCategory[category] ?? []).length > 0).map(
    (category) => {
      const activeTasks = activeTasksOnly(tasksByCategory[category] ?? []);
      const total = activeTasks.length;
      const done = activeTasks.filter((task) => task.status === 'done').length;
      const remaining = total - done;

      const status =
        total === 0
          ? 'todo'
          : done === total
            ? 'done'
            : done > 0
              ? 'partial'
              : 'todo';

      return {
        category,
        total,
        done,
        remaining,
        status,
        completionRate: total === 0 ? 0 : (done / total) * 100,
      };
    },
  );

export const getTripProgress = (tasks: TripTask[]): TripProgress => {
  const readinessTasks = activeTasksOnly(
    tasks.filter((task) => task.type === 'essential'),
  );
  const extraTasks = activeTasksOnly(tasks.filter((task) => task.type === 'extra'));

  const readinessCompleted = readinessTasks.filter(
    (task) => task.status === 'done',
  ).length;
  const extrasCompleted = extraTasks.filter((task) => task.status === 'done').length;

  return {
    readinessCompleted,
    readinessTotal: readinessTasks.length,
    readinessRate:
      readinessTasks.length === 0
        ? 0
        : (readinessCompleted / readinessTasks.length) * 100,
    extrasCompleted,
    extrasTotal: extraTasks.length,
    extrasRate:
      extraTasks.length === 0 ? 0 : (extrasCompleted / extraTasks.length) * 100,
    pocketPoints: Math.min(
      tasks.reduce((total, task) => total + getTaskPoints(task), 0),
      POCKET_POINTS_MAX,
    ),
  };
};

export const getNotNeededTasks = (tasks: TripTask[]): TripTask[] =>
  tasks.filter((task) => task.status === 'not_needed');

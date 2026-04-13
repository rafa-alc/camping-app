import { taskCatalog } from '@/catalog/taskCatalog';
import {
  accommodationBaseTaskIds,
  durationPriorityBoosts,
  durationTaskAdditions,
  groupQuantityReviewIds,
  optionalCategoryTaskIds,
  raisePriority,
} from '@/rules/generationRules';
import type {
  CategoryProgress,
  GroupedTasks,
  TaskCategory,
  TaskTemplate,
  TripContext,
  TripProgress,
  TripTask,
} from '@/types/trip';
import { CATEGORY_ORDER } from '@/utils/constants';

const activeTasksOnly = (tasks: TripTask[]) =>
  tasks.filter((task) => task.status !== 'not_needed');

export const generateTripTasks = (
  context: TripContext,
  templates: TaskTemplate[] = taskCatalog,
): TripTask[] => {
  const selectedTemplateIds = new Set(accommodationBaseTaskIds[context.accommodationType]);

  durationTaskAdditions[context.tripDuration].forEach((templateId) =>
    selectedTemplateIds.add(templateId),
  );

  if (context.hasPet) {
    optionalCategoryTaskIds.pet.forEach((templateId) =>
      selectedTemplateIds.add(templateId),
    );
  }

  return templates
    .filter((template) => selectedTemplateIds.has(template.id))
    .map((template) => {
      const shouldRaisePriority = durationPriorityBoosts[context.tripDuration].includes(
        template.id,
      );
      const priority = shouldRaisePriority
        ? raisePriority(template.basePriority)
        : template.basePriority;

      const groupHint =
        context.peopleCount === '4_plus' &&
        groupQuantityReviewIds.includes(
          template.id as (typeof groupQuantityReviewIds)[number],
        )
          ? 'Review quantity for the group.'
          : undefined;

      const description = [template.description, groupHint]
        .filter(Boolean)
        .join(' ');

      return {
        id: `${context.id}-${template.id}`,
        templateId: template.id,
        title: template.title,
        category: template.category,
        priority,
        type: template.type,
        status: 'todo',
        points: template.basePoints,
        description: description || undefined,
      } satisfies TripTask;
    });
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
    pocketPoints: tasks.reduce((total, task) => total + getTaskPoints(task), 0),
  };
};

export const getNotNeededTasks = (tasks: TripTask[]): TripTask[] =>
  tasks.filter((task) => task.status === 'not_needed');

import type { CatalogPool } from '@/catalog/types';
import type { TaskType, TripTask } from '@/types/trip';

const getTaskType = (pool: CatalogPool): TaskType => {
  if (pool.type === 'essential') {
    return 'essential';
  }

  if (pool.type === 'extra') {
    return 'extra';
  }

  return pool.priority === 'low' ? 'extra' : 'essential';
};

export const mapPoolsToTasks = (
  pools: CatalogPool[],
): Array<Omit<TripTask, 'id'>> =>
  pools.map((pool) => {
    const type = getTaskType(pool);

    return {
      templateId: pool.id,
      source: 'catalog',
      title: pool.label,
      category: pool.categoryId,
      priority: pool.priority,
      type,
      status: 'todo',
      points: type === 'essential' ? 10 : 5,
      description: pool.notes,
    };
  });

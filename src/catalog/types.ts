import type {
  AccommodationType,
  PeopleCount,
  TaskCategory,
  TaskPriority,
  TripContext,
  TripDuration,
} from '@/types/trip';

export type CatalogCategoryId = TaskCategory;

export type PoolType = 'essential' | 'extra' | 'conditional';

export type PoolPriority = TaskPriority;

export type ConditionRule = {
  accommodationIn?: AccommodationType[];
  tripDurationIn?: TripDuration[];
  peopleCountIn?: PeopleCount[];
  requiresPet?: boolean;
};

export type CatalogCategory = {
  id: CatalogCategoryId;
  label: string;
  icon: string;
};

export type CatalogPool = {
  id: string;
  categoryId: CatalogCategoryId;
  label: string;
  type: PoolType;
  priority: PoolPriority;
  conditions?: ConditionRule;
  itemIds: string[];
  notes?: string;
};

export type CatalogItem = {
  id: string;
  poolId: string;
  label: string;
  notes?: string;
};

export type CatalogTripContext = Pick<
  TripContext,
  'peopleCount' | 'tripDuration' | 'accommodationType' | 'hasPet'
>;

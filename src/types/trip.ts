export type PeopleCount = '1' | '2' | '3' | '4_plus';

export type TripDuration = 'short' | 'medium' | 'long';

export type AccommodationType =
  | 'tent'
  | 'caravan'
  | 'bungalow'
  | 'camping_cabin';

export type TaskCategory =
  | 'essentials'
  | 'sleep'
  | 'shelter'
  | 'cooking'
  | 'food'
  | 'clothing'
  | 'hygiene'
  | 'safety'
  | 'pet'
  | 'comfort_extras';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskType = 'essential' | 'extra';

export type TaskStatus = 'todo' | 'done' | 'not_needed';

export type CategoryStatus = 'todo' | 'partial' | 'done';

export type TripContext = {
  id: string;
  createdAt: string;
  peopleCount: PeopleCount;
  tripDuration: TripDuration;
  accommodationType: AccommodationType;
  hasPet: boolean;
};

export type TripContextInput = Omit<TripContext, 'id' | 'createdAt'>;

export type TaskTemplate = {
  id: string;
  title: string;
  category: TaskCategory;
  basePriority: TaskPriority;
  type: TaskType;
  basePoints: number;
  description?: string;
};

export type TripTask = {
  id: string;
  templateId: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  type: TaskType;
  status: TaskStatus;
  points: number;
  description?: string;
};

export type TripState = {
  context: TripContext | null;
  tasks: TripTask[];
  lastUpdatedAt: string | null;
};

export type GroupedTasks = Partial<Record<TaskCategory, TripTask[]>>;

export type CategoryProgress = {
  category: TaskCategory;
  total: number;
  done: number;
  remaining: number;
  status: CategoryStatus;
  completionRate: number;
};

export type TripProgress = {
  readinessCompleted: number;
  readinessTotal: number;
  readinessRate: number;
  extrasCompleted: number;
  extrasTotal: number;
  extrasRate: number;
  pocketPoints: number;
};

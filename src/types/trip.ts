export type PeopleCount = '1' | '2' | '3' | '4_plus';

export type TripDuration = 'short' | 'medium' | 'long';

export type AccommodationType =
  | 'tent'
  | 'caravan'
  | 'bungalow'
  | 'camping_cabin';

export type TaskCategory =
  | 'shelter_rest'
  | 'cooking_food'
  | 'clothing_footwear'
  | 'energy_lighting_navigation'
  | 'health_safety_repair'
  | 'hygiene_cleanup'
  | 'documents_money'
  | 'leisure'
  | 'pet'
  | 'comfort_extras';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskType = 'essential' | 'extra';

export type TaskStatus = 'todo' | 'done' | 'not_needed';

export type TaskSource = 'catalog' | 'custom';

export type CategoryStatus = 'todo' | 'partial' | 'done';

export type TripRewardOrigin = 'new' | 'template' | 'duplicate' | 'legacy';

export type TripInventoryReward = {
  eligible: boolean;
  claimed: boolean;
  claimedAt: string | null;
  origin: TripRewardOrigin;
};

export type UserProgress = {
  totalPoints: number;
  rewardedTripContextIds: string[];
};

export type TripContext = {
  id: string;
  createdAt: string;
  peopleCount: PeopleCount;
  tripDuration: TripDuration;
  accommodationType: AccommodationType;
  hasPet: boolean;
};

export type TripContextInput = Omit<TripContext, 'id' | 'createdAt'>;

export type TripSetupInput = {
  tripName: string;
  context: TripContextInput;
};

export type TripTask = {
  id: string;
  templateId: string;
  source: TaskSource;
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
  currentTripName: string | null;
  inventoryReward: TripInventoryReward | null;
  tasks: TripTask[];
  lastUpdatedAt: string | null;
  activeSavedTripId?: string | null;
};

export type SavedTripRecord = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  context: TripContext;
  inventoryReward: TripInventoryReward;
  tasks: TripTask[];
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

export type CustomTaskInput = {
  title: string;
  destination: TaskCategory;
};

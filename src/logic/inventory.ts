import type { TripInventoryReward, UserProgress } from '@/types/trip';
import {
  TOTAL_POINTS_MAX,
  TRIP_INVENTORY_REWARD_THRESHOLD,
  TRIP_INVENTORY_REWARD_VALUE,
} from '@/utils/limits';

const clampTotalPoints = (value: number) =>
  Math.min(Math.max(Math.round(value), 0), TOTAL_POINTS_MAX);

export const createNewTripInventoryReward = (): TripInventoryReward => ({
  eligible: true,
  claimed: false,
  claimedAt: null,
  origin: 'new',
});

export const createTemplateTripInventoryReward = (
  sourceReward?: TripInventoryReward | null,
): TripInventoryReward => ({
  eligible: sourceReward?.origin === 'duplicate' ? false : true,
  claimed: false,
  claimedAt: null,
  origin: 'template',
});

export const createDuplicateTripInventoryReward = (): TripInventoryReward => ({
  eligible: false,
  claimed: false,
  claimedAt: null,
  origin: 'duplicate',
});

export const createLegacyTripInventoryReward = (): TripInventoryReward => ({
  eligible: false,
  claimed: false,
  claimedAt: null,
  origin: 'legacy',
});

export const sanitizeTripInventoryReward = (
  reward: unknown,
): TripInventoryReward => {
  if (!reward || typeof reward !== 'object') {
    return createLegacyTripInventoryReward();
  }

  const candidate = reward as Partial<TripInventoryReward>;
  const origin =
    candidate.origin === 'new' ||
    candidate.origin === 'template' ||
    candidate.origin === 'duplicate' ||
    candidate.origin === 'legacy'
      ? candidate.origin
      : 'legacy';

  return {
    eligible: typeof candidate.eligible === 'boolean' ? candidate.eligible : false,
    claimed: typeof candidate.claimed === 'boolean' ? candidate.claimed : false,
    claimedAt: typeof candidate.claimedAt === 'string' ? candidate.claimedAt : null,
    origin,
  };
};

export const normalizeRewardedTripContextIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim()),
    ),
  );
};

export const sanitizeUserProgress = (value: unknown): UserProgress => {
  if (!value || typeof value !== 'object') {
    return {
      totalPoints: 0,
      rewardedTripContextIds: [],
    };
  }

  const candidate = value as Partial<UserProgress>;

  return {
    totalPoints: clampTotalPoints(typeof candidate.totalPoints === 'number' ? candidate.totalPoints : 0),
    rewardedTripContextIds: normalizeRewardedTripContextIds(candidate.rewardedTripContextIds),
  };
};

export const canClaimTripInventoryReward = ({
  tripContextId,
  pocketPoints,
  reward,
  rewardedTripContextIds,
}: {
  tripContextId: string | null | undefined;
  pocketPoints: number;
  reward: TripInventoryReward | null | undefined;
  rewardedTripContextIds: string[];
}) =>
  Boolean(
    tripContextId &&
      reward &&
      reward.eligible &&
      !reward.claimed &&
      !rewardedTripContextIds.includes(tripContextId) &&
      pocketPoints >= TRIP_INVENTORY_REWARD_THRESHOLD,
  );

export const buildClaimedTripInventoryReward = (
  reward: TripInventoryReward,
  claimedAt = new Date().toISOString(),
): TripInventoryReward => ({
  ...reward,
  claimed: true,
  claimedAt,
});

export const grantUserProgressReward = (
  progress: UserProgress,
  tripContextId: string,
): UserProgress => ({
  totalPoints: clampTotalPoints(progress.totalPoints + TRIP_INVENTORY_REWARD_VALUE),
  rewardedTripContextIds: Array.from(
    new Set([...progress.rewardedTripContextIds, tripContextId]),
  ),
});

export const getTripInventoryRewardHelper = (
  reward: TripInventoryReward | null | undefined,
): string => {
  if (!reward) {
    return `Cada viaje puede sumar ${TRIP_INVENTORY_REWARD_VALUE} puntos totales si alcanza ${TRIP_INVENTORY_REWARD_THRESHOLD} puntos del viaje.`;
  }

  if (reward.claimed) {
    return `Este viaje ya sumó ${TRIP_INVENTORY_REWARD_VALUE} puntos al total.`;
  }

  if (!reward.eligible) {
    return 'Este viaje no puede sumar puntos totales.';
  }

  return `Cada viaje puede sumar ${TRIP_INVENTORY_REWARD_VALUE} puntos totales si alcanza ${TRIP_INVENTORY_REWARD_THRESHOLD} puntos del viaje.`;
};

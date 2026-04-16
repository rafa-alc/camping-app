import { sanitizeUserProgress } from '@/logic/inventory';
import { getSupabaseClient } from '@/lib/supabase';
import type { UserProgress } from '@/types/trip';

type CloudUserProgressRow = {
  user_id: string;
  total_points: number;
  rewarded_trip_context_ids: string[];
  created_at: string;
  updated_at: string;
};

const userProgressColumns =
  'user_id,total_points,rewarded_trip_context_ids,created_at,updated_at';

const createEmptyUserProgress = (): UserProgress => ({
  totalPoints: 0,
  rewardedTripContextIds: [],
});

const createDefaultProgressRow = (userId: string) => ({
  user_id: userId,
  total_points: 0,
  rewarded_trip_context_ids: [],
  updated_at: new Date().toISOString(),
});

const mapCloudUserProgress = (row: CloudUserProgressRow): UserProgress =>
  sanitizeUserProgress({
    totalPoints: row.total_points,
    rewardedTripContextIds: row.rewarded_trip_context_ids,
  });

export const getCloudUserProgress = async (userId: string): Promise<UserProgress> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('user_progress')
    .select(userProgressColumns)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const { data: createdData, error: createdError } = await client
      .from('user_progress')
      .upsert(createDefaultProgressRow(userId), {
        onConflict: 'user_id',
      })
      .select(userProgressColumns)
      .single();

    if (createdError) {
      throw createdError;
    }

    return mapCloudUserProgress(createdData as CloudUserProgressRow);
  }

  return mapCloudUserProgress(data as CloudUserProgressRow);
};

export const upsertCloudUserProgress = async (
  userId: string,
  progress: UserProgress,
): Promise<UserProgress> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        total_points: progress.totalPoints,
        rewarded_trip_context_ids: progress.rewardedTripContextIds,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    )
    .select(userProgressColumns)
    .single();

  if (error) {
    throw error;
  }

  return data ? mapCloudUserProgress(data as CloudUserProgressRow) : createEmptyUserProgress();
};

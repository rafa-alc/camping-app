import { sanitizeTripInventoryReward } from '@/logic/inventory';
import type { SavedTripRecord, TripContext, TripInventoryReward, TripTask } from '@/types/trip';

import { getSupabaseClient } from '@/lib/supabase';

type CloudTripRow = {
  id: string;
  user_id: string;
  name: string;
  context: TripContext;
  reward_meta: TripInventoryReward;
  tasks: TripTask[];
  created_at: string;
  updated_at: string;
};

type CloudTripInput = {
  userId: string;
  name: string;
  context: TripContext;
  rewardMeta: TripInventoryReward;
  tasks: TripTask[];
};

const cloudTripColumns =
  'id,user_id,name,context,reward_meta,tasks,created_at,updated_at';

const mapCloudTrip = (row: CloudTripRow): SavedTripRecord => ({
  id: row.id,
  name: row.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  context: row.context,
  inventoryReward: sanitizeTripInventoryReward(row.reward_meta),
  tasks: row.tasks,
});

export const listCloudTrips = async (userId: string): Promise<SavedTripRecord[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('trips')
    .select(cloudTripColumns)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapCloudTrip(row as CloudTripRow));
};

export const createCloudTrip = async ({
  userId,
  name,
  context,
  rewardMeta,
  tasks,
}: CloudTripInput): Promise<SavedTripRecord> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('trips')
    .insert({
      user_id: userId,
      name,
      context,
      reward_meta: rewardMeta,
      tasks,
    })
    .select(cloudTripColumns)
    .single();

  if (error) {
    throw error;
  }

  return mapCloudTrip(data as CloudTripRow);
};

export const updateCloudTrip = async (
  savedTripId: string,
  { userId, name, context, rewardMeta, tasks }: CloudTripInput,
): Promise<SavedTripRecord> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('trips')
    .update({
      name,
      context,
      reward_meta: rewardMeta,
      tasks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', savedTripId)
    .eq('user_id', userId)
    .select(cloudTripColumns)
    .single();

  if (error) {
    throw error;
  }

  return mapCloudTrip(data as CloudTripRow);
};

export const renameCloudTrip = async (
  savedTripId: string,
  userId: string,
  name: string,
): Promise<SavedTripRecord> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('trips')
    .update({
      name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', savedTripId)
    .eq('user_id', userId)
    .select(cloudTripColumns)
    .single();

  if (error) {
    throw error;
  }

  return mapCloudTrip(data as CloudTripRow);
};

export const deleteCloudTrip = async (savedTripId: string, userId: string) => {
  const client = getSupabaseClient();
  const { error } = await client
    .from('trips')
    .delete()
    .eq('id', savedTripId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

import { catalogPools } from '@/catalog';
import type { CatalogPool, CatalogTripContext } from '@/catalog/types';
import { matchesPoolConditions } from '@/logic/catalog/conditions';

export const getActivePools = (
  context: CatalogTripContext,
  pools: CatalogPool[] = catalogPools,
): CatalogPool[] => pools.filter((pool) => matchesPoolConditions(pool, context));

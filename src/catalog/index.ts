import { catalogCategories } from '@/catalog/categories';
import { catalogItems } from '@/catalog/items';
import { catalogPools } from '@/catalog/pools';
import type {
  CatalogCategory,
  CatalogCategoryId,
  CatalogItem,
  CatalogPool,
} from '@/catalog/types';

export * from '@/catalog/categories';
export * from '@/catalog/items';
export * from '@/catalog/pools';
export * from '@/catalog/types';

export const catalogCategoryMap = Object.fromEntries(
  catalogCategories.map((category) => [category.id, category]),
) as Record<CatalogCategoryId, CatalogCategory>;

export const catalogPoolMap = Object.fromEntries(
  catalogPools.map((pool) => [pool.id, pool]),
) as Record<string, CatalogPool>;

export const catalogItemMap = Object.fromEntries(
  catalogItems.map((item) => [item.id, item]),
) as Record<string, CatalogItem>;

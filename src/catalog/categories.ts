import type { CatalogCategory } from '@/catalog/types';

export const catalogCategories = [
  {
    id: 'shelter_rest',
    label: 'Refugio y descanso',
    icon: 'tent',
  },
  {
    id: 'cooking_food',
    label: 'Cocina y alimentación',
    icon: 'utensils',
  },
  {
    id: 'clothing_footwear',
    label: 'Ropa y calzado',
    icon: 'layers',
  },
  {
    id: 'energy_lighting_navigation',
    label: 'Energía, iluminación y orientación',
    icon: 'compass',
  },
  {
    id: 'health_safety_repair',
    label: 'Salud, seguridad y reparaciones',
    icon: 'shield',
  },
  {
    id: 'hygiene_cleanup',
    label: 'Aseo e higiene',
    icon: 'droplet',
  },
  {
    id: 'documents_money',
    label: 'Documentación y dinero',
    icon: 'wallet',
  },
  {
    id: 'leisure',
    label: 'Ocio',
    icon: 'sparkles',
  },
  {
    id: 'pet',
    label: 'Mascota',
    icon: 'paw',
  },
] satisfies CatalogCategory[];

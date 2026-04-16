import type { UserProgress } from '@/types/trip';
import { TOTAL_POINTS_DISPLAY_CAP, TOTAL_POINTS_MAX } from '@/utils/limits';

export type AchievementDefinition = {
  id: string;
  threshold: number;
  displayThreshold: string;
  name: string;
  assetPath: string | null;
  fallbackLabel: string;
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-trip',
    threshold: 250,
    displayThreshold: '250',
    name: '¡1er viaje!',
    assetPath: null,
    fallbackLabel: '250',
  },
  {
    id: 'repeat-trip',
    threshold: 500,
    displayThreshold: '500',
    name: '¡Repetimos!',
    assetPath: null,
    fallbackLabel: '500',
  },
  {
    id: 'third-trip',
    threshold: 750,
    displayThreshold: '750',
    name: '¡No hay 2 sin 3!',
    assetPath: null,
    fallbackLabel: '750',
  },
  {
    id: 'hot-streak',
    threshold: 1000,
    displayThreshold: '1000',
    name: '¡En racha!',
    assetPath: null,
    fallbackLabel: '1k',
  },
  {
    id: 'trusted-camper',
    threshold: 1500,
    displayThreshold: '1500',
    name: 'Campista de confianza',
    assetPath: null,
    fallbackLabel: '1.5k',
  },
  {
    id: 'born-planner',
    threshold: 2500,
    displayThreshold: '2500',
    name: 'Planificador nato',
    assetPath: null,
    fallbackLabel: '2.5k',
  },
  {
    id: 'advanced-camper',
    threshold: 3500,
    displayThreshold: '3500',
    name: 'Campista avanzado',
    assetPath: null,
    fallbackLabel: '3.5k',
  },
  {
    id: 'way-of-life',
    threshold: 5000,
    displayThreshold: '5000',
    name: 'Forma de vida',
    assetPath: null,
    fallbackLabel: '5k',
  },
  {
    id: 'master-camper',
    threshold: 7000,
    displayThreshold: '7000',
    name: 'Campista maestro',
    assetPath: null,
    fallbackLabel: '7k',
  },
  {
    id: 'one-with-nature',
    threshold: TOTAL_POINTS_MAX,
    displayThreshold: `${TOTAL_POINTS_DISPLAY_CAP}+`,
    name: 'Uno con la naturaleza',
    assetPath: null,
    fallbackLabel: `${TOTAL_POINTS_DISPLAY_CAP}+`,
  },
];

export const ACHIEVEMENT_ROWS = [
  ACHIEVEMENT_DEFINITIONS.slice(0, 3),
  ACHIEVEMENT_DEFINITIONS.slice(3, 6),
  ACHIEVEMENT_DEFINITIONS.slice(6, 9),
  ACHIEVEMENT_DEFINITIONS.slice(9, 10),
];

export const getUnlockedAchievements = (totalPoints: number) =>
  ACHIEVEMENT_DEFINITIONS.filter((achievement) => totalPoints >= achievement.threshold);

export const getUnlockedAchievementCount = (totalPoints: number) =>
  getUnlockedAchievements(totalPoints).length;

export const getAchievementUnlock = (
  achievement: AchievementDefinition,
  progress: UserProgress,
) => progress.totalPoints >= achievement.threshold;

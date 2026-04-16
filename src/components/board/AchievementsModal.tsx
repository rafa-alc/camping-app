import {
  ACHIEVEMENT_ROWS,
  getUnlockedAchievementCount,
  type AchievementDefinition,
} from '@/logic/achievements';
import type { UserProgress } from '@/types/trip';
import { formatTotalPoints } from '@/utils/format';

type AchievementsModalProps = {
  isOpen: boolean;
  progress: UserProgress;
  onClose: () => void;
};

const LockIcon = () => (
  <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
    <path
      d="M8 10V7a4 4 0 1 1 8 0v3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <rect
      height="9"
      rx="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      width="12"
      x="6"
      y="10"
    />
  </svg>
);

const AchievementTile = ({
  achievement,
  unlocked,
}: {
  achievement: AchievementDefinition;
  unlocked: boolean;
}) => (
  <article
    className={`paper-inset relative p-4 text-center transition-[transform,opacity,filter] duration-200 ${
      unlocked ? 'border-sand-200/90' : 'grayscale opacity-60'
    }`}
  >
    {!unlocked && (
      <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 bg-white/85 text-mist-500">
        <LockIcon />
      </span>
    )}

    <div
      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] border text-sm font-semibold tracking-tight ${
        unlocked
          ? 'border-pine-200 bg-[linear-gradient(180deg,rgba(236,244,236,0.96)_0%,rgba(244,238,228,0.98)_100%)] text-pine-700'
          : 'border-stone-200 bg-[linear-gradient(180deg,rgba(247,242,235,0.96)_0%,rgba(240,234,224,0.98)_100%)] text-mist-500'
      }`}
    >
      {achievement.assetPath ? (
        <img
          alt=""
          className="h-9 w-9 object-contain"
          src={achievement.assetPath}
        />
      ) : (
        <span>{achievement.fallbackLabel}</span>
      )}
    </div>

    <p className="mt-3 text-sm font-semibold leading-5 text-pine-700">{achievement.name}</p>
    <p className="mt-2 text-xs leading-5 text-mist-500">
      {achievement.displayThreshold} puntos totales
    </p>
  </article>
);

export const AchievementsModal = ({
  isOpen,
  progress,
  onClose,
}: AchievementsModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="ui-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface ui-dialog-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ui-chip-soft">Logros</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-pine-700">
              Galería de campista
            </h2>
            <p className="mt-2 section-helper">
              Cada viaje puede sumar 250 puntos totales si alcanza 250 puntos del viaje.
            </p>
          </div>
          <button
            aria-label="Cerrar logros"
            className="ui-button-secondary"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="paper-inset mt-6 flex flex-col gap-2 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ui-subtle-heading">Puntos totales</p>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-pine-700">
              {formatTotalPoints(progress.totalPoints)}
            </div>
          </div>
          <p className="text-sm leading-6 text-mist-600">
            {getUnlockedAchievementCount(progress.totalPoints)}/10 desbloqueados
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {ACHIEVEMENT_ROWS.map((row, rowIndex) => (
            <div
              className={`grid gap-3 ${
                row.length === 1
                  ? 'mx-auto max-w-xs grid-cols-1'
                  : 'grid-cols-1 sm:grid-cols-3'
              }`}
              key={`achievement-row-${rowIndex}`}
            >
              {row.map((achievement) => (
                <AchievementTile
                  achievement={achievement}
                  key={achievement.id}
                  unlocked={progress.totalPoints >= achievement.threshold}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

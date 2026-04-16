import { useEffect, useRef, useState } from 'react';

import { getUnlockedAchievementCount } from '@/logic/achievements';
import { getTripInventoryRewardHelper } from '@/logic/inventory';
import type { TripInventoryReward, TripProgress, UserProgress } from '@/types/trip';
import {
  formatPocketPoints,
  formatRate,
  formatTotalPoints,
  getProgressFillStyle,
} from '@/utils/format';

export type PocketFeedback = {
  id: number;
  label: string;
  tone: 'positive' | 'negative' | 'neutral';
};

type ProgressPanelProps = {
  progress: TripProgress;
  totalProgress: UserProgress;
  inventoryReward: TripInventoryReward | null;
  inventoryStatusMessage?: string | null;
  compact?: boolean;
  pocketFeedback?: PocketFeedback | null;
  inventoryFeedback?: PocketFeedback | null;
  onOpenAchievements: () => void;
};

type MetricRowProps = {
  label: string;
  detail: string;
  numericValue: number;
  rate?: number;
  variant?: 'readiness' | 'extras';
  compact?: boolean;
  formatValue?: (value: number) => string;
  feedback?: PocketFeedback | null;
};

const useAnimatedNumber = (value: number, duration = 320) => {
  const [displayValue, setDisplayValue] = useState(value);
  const frameRef = useRef<number | null>(null);
  const displayValueRef = useRef(value);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const startValue = displayValueRef.current;

    if (startValue === value) {
      setDisplayValue(value);
      return undefined;
    }

    const startTime = performance.now();

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, value]);

  return displayValue;
};

const useValuePulse = (value: number) => {
  const [isActive, setIsActive] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    setIsActive(true);
    const timeout = window.setTimeout(() => setIsActive(false), 280);

    return () => window.clearTimeout(timeout);
  }, [value]);

  return isActive;
};

const getFeedbackToneClass = (feedback: PocketFeedback | null) =>
  feedback?.tone === 'positive'
    ? 'border-pine-200 bg-pine-50/95 text-pine-700'
    : feedback?.tone === 'negative'
      ? 'border-rose-200 bg-rose-50/95 text-rose-600'
      : 'border-stone-200 bg-stone-50/95 text-mist-500';

const MetricRow = ({
  label,
  detail,
  numericValue,
  rate,
  variant = 'readiness',
  compact = false,
  formatValue = (value) => `${Math.round(value)}`,
  feedback = null,
}: MetricRowProps) => {
  const animatedValue = useAnimatedNumber(numericValue, compact ? 240 : 320);
  const isValuePulsing = useValuePulse(numericValue);
  const fillStyle =
    typeof rate === 'number' ? getProgressFillStyle(rate, variant) : undefined;

  return (
    <div className={`paper-inset ${compact ? 'px-3.5 py-3' : 'px-4 py-4'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-pine-700">{label}</p>
          <p className={`mt-1 text-mist-600 ${compact ? 'text-xs leading-5' : 'text-sm'}`}>
            {detail}
          </p>
        </div>

        <div className="relative text-right">
          {feedback && (
            <span
              className={`ui-points-feedback absolute -top-7 right-0 ${getFeedbackToneClass(feedback)}`}
            >
              {feedback.label}
            </span>
          )}
          <div
            className={`font-semibold tracking-tight text-pine-700 transition-[transform,color] duration-300 ${
              compact ? 'text-xl' : 'text-2xl'
            } ${isValuePulsing ? 'scale-[1.04] text-pine-600' : ''}`}
          >
            {formatValue(animatedValue)}
          </div>
        </div>
      </div>

      {typeof rate === 'number' && (
        <div
          className={`overflow-hidden rounded-full bg-stone-200/90 ${
            compact ? 'mt-2.5 h-1.5' : 'mt-3 h-2'
          }`}
        >
          <div
            className="ui-progress-fill h-full rounded-full"
            style={{ ...fillStyle, width: `${rate}%` }}
          />
        </div>
      )}
    </div>
  );
};

const InventoryRow = ({
  totalProgress,
  inventoryReward,
  compact,
  feedback,
  onOpenAchievements,
}: {
  totalProgress: UserProgress;
  inventoryReward: TripInventoryReward | null;
  compact: boolean;
  feedback: PocketFeedback | null;
  onOpenAchievements: () => void;
}) => {
  const animatedValue = useAnimatedNumber(totalProgress.totalPoints, compact ? 240 : 320);
  const isValuePulsing = useValuePulse(totalProgress.totalPoints);
  const unlockedCount = getUnlockedAchievementCount(totalProgress.totalPoints);

  return (
    <div className={`paper-inset ${compact ? 'px-3.5 py-3' : 'px-4 py-4'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pine-700">Puntos totales</p>
          <p className={`mt-1 text-mist-600 ${compact ? 'text-xs leading-5' : 'text-sm'}`}>
            {getTripInventoryRewardHelper(inventoryReward)}
          </p>
        </div>

        <div className="relative text-right">
          {feedback && (
            <span
              className={`ui-points-feedback absolute -top-7 right-0 ${getFeedbackToneClass(
                feedback,
              )}`}
            >
              {feedback.label}
            </span>
          )}
          <div
            className={`font-semibold tracking-tight text-pine-700 transition-[transform,color] duration-300 ${
              compact ? 'text-xl' : 'text-2xl'
            } ${isValuePulsing ? 'scale-[1.04] text-pine-600' : ''}`}
          >
            {formatTotalPoints(animatedValue)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs leading-5 text-mist-500">{unlockedCount}/10 logros</span>
        <button className="ui-button-ghost px-0 py-0" onClick={onOpenAchievements} type="button">
          Ver logros
        </button>
      </div>
    </div>
  );
};

export const ProgressPanel = ({
  progress,
  totalProgress,
  inventoryReward,
  inventoryStatusMessage = null,
  compact = false,
  pocketFeedback = null,
  inventoryFeedback = null,
  onOpenAchievements,
}: ProgressPanelProps) => (
  <section className={`panel-surface ${compact ? 'p-4' : 'p-5'}`}>
    <div>
      <h2 className="section-title">Resumen de progreso</h2>
      <p className={`${compact ? 'mt-1 text-xs leading-5 text-mist-600' : 'mt-1 section-helper'}`}>
        Sigue de un vistazo lo esencial mientras completas la checklist.
      </p>
    </div>

    <div className={`space-y-3 ${compact ? 'mt-3' : 'mt-4'}`}>
      <MetricRow
        compact={compact}
        detail={`${progress.readinessCompleted}/${progress.readinessTotal} tareas esenciales completadas`}
        formatValue={formatRate}
        label="Preparación del viaje"
        numericValue={progress.readinessRate}
        rate={progress.readinessRate}
      />
      <MetricRow
        compact={compact}
        detail={`${progress.extrasCompleted}/${progress.extrasTotal} extras completados`}
        formatValue={formatRate}
        label="Extras de confort"
        numericValue={progress.extrasRate}
        rate={progress.extrasRate}
        variant="extras"
      />
      <MetricRow
        compact={compact}
        detail="10 puntos por esenciales y 5 por extras."
        feedback={pocketFeedback}
        formatValue={formatPocketPoints}
        label="Puntos del viaje"
        numericValue={progress.pocketPoints}
      />
      <InventoryRow
        compact={compact}
        feedback={inventoryFeedback}
        inventoryReward={inventoryReward}
        onOpenAchievements={onOpenAchievements}
        totalProgress={totalProgress}
      />
      {inventoryStatusMessage && (
        <p
          className={`paper-inset border-sand-200/80 text-sand-700 ${
            compact ? 'px-3.5 py-2 text-xs leading-5' : 'px-4 py-3 text-sm leading-6'
          }`}
        >
          {inventoryStatusMessage}
        </p>
      )}
    </div>
  </section>
);

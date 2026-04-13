import type { TripProgress } from '@/types/trip';
import { formatRate, getProgressFillStyle } from '@/utils/format';

type ProgressPanelProps = {
  progress: TripProgress;
  compact?: boolean;
};

type MetricRowProps = {
  label: string;
  value: string;
  detail: string;
  rate?: number;
  variant?: 'readiness' | 'extras';
  compact?: boolean;
};

const MetricRow = ({
  label,
  value,
  detail,
  rate,
  variant = 'readiness',
  compact = false,
}: MetricRowProps) => {
  const fillStyle =
    typeof rate === 'number' ? getProgressFillStyle(rate, variant) : undefined;

  return (
    <div
      className={`rounded-2xl border border-stone-200/80 bg-[#f8f5ef] ${
        compact ? 'px-3.5 py-3' : 'px-4 py-4'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-pine-700">{label}</p>
          <p className={`mt-1 text-mist-600 ${compact ? 'text-xs leading-5' : 'text-sm'}`}>
            {detail}
          </p>
        </div>
        <div
          className={`text-right font-semibold tracking-tight text-pine-700 ${
            compact ? 'text-xl' : 'text-2xl'
          }`}
        >
          {value}
        </div>
      </div>

      {typeof rate === 'number' && (
        <div className={`overflow-hidden rounded-full bg-stone-200/90 ${compact ? 'mt-2.5 h-1.5' : 'mt-3 h-2'}`}>
          <div
            className="h-full rounded-full transition-[width,background,box-shadow]"
            style={{ ...fillStyle, width: `${rate}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ProgressPanel = ({
  progress,
  compact = false,
}: ProgressPanelProps) => (
  <section className={`panel-surface ${compact ? 'p-4' : 'p-5'}`}>
    <div>
      <h2 className="section-title">Progress overview</h2>
      <p className={`${compact ? 'mt-1 text-xs leading-5 text-mist-600' : 'mt-1 section-helper'}`}>
        Keep an eye on the core checklist while you tick items off.
      </p>
    </div>

    <div className={`space-y-3 ${compact ? 'mt-3' : 'mt-4'}`}>
      <MetricRow
        compact={compact}
        detail={`${progress.readinessCompleted}/${progress.readinessTotal} essential tasks done`}
        label="Trip readiness"
        rate={progress.readinessRate}
        value={formatRate(progress.readinessRate)}
      />
      <MetricRow
        compact={compact}
        detail={`${progress.extrasCompleted}/${progress.extrasTotal} extras done`}
        label="Comfort extras"
        rate={progress.extrasRate}
        value={formatRate(progress.extrasRate)}
        variant="extras"
      />
      <MetricRow
        compact={compact}
        detail="10 points for essentials, 5 for extras."
        label="Pocket points"
        value={`${progress.pocketPoints}`}
      />
    </div>
  </section>
);

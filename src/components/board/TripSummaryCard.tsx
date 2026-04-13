import type { TripContext } from '@/types/trip';
import { formatFlagSummary, formatTripContext } from '@/utils/format';

type TripSummaryCardProps = {
  context: TripContext;
  activeTaskCount: number;
  onEditContext: () => void;
  onOpenSummary: () => void;
};

export const TripSummaryCard = ({
  context,
  activeTaskCount,
  onEditContext,
  onOpenSummary,
}: TripSummaryCardProps) => (
  <section className="panel-surface p-5 sm:p-6">
    <div className="flex flex-col gap-4">
      <span className="ui-chip-soft">Current trip</span>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-pine-700 sm:text-3xl">
            {formatTripContext(context)}
          </h2>
          <p className="mt-2 section-helper">
            A simple camping checklist shaped around this trip, with optional extras and
            recoverable exclusions kept separate.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <button
            className="ui-button-primary"
            onClick={onOpenSummary}
            type="button"
          >
            Open summary
          </button>
          <button
            className="ui-button-ghost"
            onClick={onEditContext}
            type="button"
          >
            Edit context
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {formatFlagSummary(context).map((item) => (
          <span className="ui-chip-muted" key={item}>
            {item}
          </span>
        ))}
        <span className="ui-chip-muted">{activeTaskCount} checklist sections</span>
      </div>
    </div>
  </section>
);

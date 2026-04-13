import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { CategoryProgress, TripProgress } from '@/types/trip';
import { CATEGORY_LABELS } from '@/utils/constants';
import { formatRate } from '@/utils/format';

type SummaryModalProps = {
  isOpen: boolean;
  progress: TripProgress;
  categoryProgress: CategoryProgress[];
  onClose: () => void;
};

export const SummaryModal = ({
  isOpen,
  progress,
  categoryProgress,
  onClose,
}: SummaryModalProps) => {
  if (!isOpen) {
    return null;
  }

  const completedCategories = categoryProgress.filter(
    (category) => category.status === 'done',
  );
  const remainingCategories = categoryProgress.filter(
    (category) => category.status !== 'done',
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ui-chip-soft">Trip summary</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-pine-700">
              A quick readiness snapshot
            </h2>
            <p className="mt-2 section-helper">
              A compact view of what is already ready, what is still pending, and how the
              checklist is progressing overall.
            </p>
          </div>
          <button
            aria-label="Close summary"
            className="ui-button-secondary"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-stone-50 p-5">
            <p className="ui-subtle-heading">Trip readiness</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {formatRate(progress.readinessRate)}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              {progress.readinessCompleted}/{progress.readinessTotal} core tasks done
            </p>
          </div>
          <div className="rounded-3xl bg-stone-50 p-5">
            <p className="ui-subtle-heading">Comfort extras</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {formatRate(progress.extrasRate)}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              {progress.extrasCompleted}/{progress.extrasTotal} extras done
            </p>
          </div>
          <div className="rounded-3xl bg-stone-50 p-5">
            <p className="ui-subtle-heading">Pocket points</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {progress.pocketPoints}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              Points respond instantly to the tasks that are done right now.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl bg-pine-50/60 p-5">
            <h3 className="text-lg font-semibold text-pine-700">Categories completed</h3>
            <div className="mt-4 space-y-2">
              {completedCategories.length === 0 && (
                <p className="text-sm text-mist-600">No categories completed yet.</p>
              )}
              {completedCategories.map((category) => (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-pine-700"
                  key={category.category}
                >
                  <div className="ui-icon-badge h-8 w-8 rounded-xl">
                    <CategoryIcon category={category.category} className="h-4 w-4" />
                  </div>
                  <span>{CATEGORY_LABELS[category.category]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-stone-50 p-5">
            <h3 className="text-lg font-semibold text-pine-700">Still to finish</h3>
            <div className="mt-4 space-y-2">
              {remainingCategories.length === 0 && (
                <p className="text-sm text-mist-600">Everything active is complete.</p>
              )}
              {remainingCategories.map((category) => (
                <div
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-mist-600"
                  key={category.category}
                >
                  <div className="ui-icon-badge h-8 w-8 rounded-xl">
                    <CategoryIcon category={category.category} className="h-4 w-4" />
                  </div>
                  <span>
                    {CATEGORY_LABELS[category.category]} / {category.done}/{category.total} done
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

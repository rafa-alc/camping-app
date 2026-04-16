import { CategoryIcon } from '@/components/ui/CategoryIcon';
import type { CategoryProgress, TripProgress } from '@/types/trip';
import { CATEGORY_LABELS } from '@/utils/constants';
import { formatPocketPoints, formatRate } from '@/utils/format';

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
    <div className="ui-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface ui-dialog-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ui-chip-soft">Resumen del viaje</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-pine-700">
              Estado rápido del viaje
            </h2>
            <p className="mt-2 section-helper">
              Una vista compacta de lo que ya está listo, lo que sigue pendiente y cómo
              avanza el viaje en conjunto.
            </p>
          </div>
          <button
            aria-label="Cerrar resumen"
            className="ui-button-secondary"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="paper-inset rounded-3xl p-5">
            <p className="ui-subtle-heading">Preparación del viaje</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {formatRate(progress.readinessRate)}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              {progress.readinessCompleted}/{progress.readinessTotal} tareas clave completadas
            </p>
          </div>
          <div className="paper-inset rounded-3xl p-5">
            <p className="ui-subtle-heading">Extras de confort</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {formatRate(progress.extrasRate)}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              {progress.extrasCompleted}/{progress.extrasTotal} extras completados
            </p>
          </div>
          <div className="paper-inset rounded-3xl p-5">
            <p className="ui-subtle-heading">Puntos del viaje</p>
            <div className="mt-3 text-3xl font-semibold text-pine-700">
              {formatPocketPoints(progress.pocketPoints)}
            </div>
            <p className="mt-2 text-sm text-mist-600">
              Los puntos cambian al instante según lo que ya has completado.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="paper-inset paper-tint rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-pine-700">Categorías completadas</h3>
            <div className="mt-4 space-y-2">
              {completedCategories.length === 0 && (
                <p className="text-sm text-mist-600">Todavía no hay categorías completadas.</p>
              )}
              {completedCategories.map((category) => (
                <div
                  className="paper-inset-soft flex items-center gap-3 px-4 py-3 text-sm text-pine-700"
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

          <section className="paper-inset rounded-3xl p-5">
            <h3 className="text-lg font-semibold text-pine-700">Pendiente</h3>
            <div className="mt-4 space-y-2">
              {remainingCategories.length === 0 && (
                <p className="text-sm text-mist-600">Todo lo activo está completado.</p>
              )}
              {remainingCategories.map((category) => (
                <div
                  className="paper-inset-soft flex items-center gap-3 px-4 py-3 text-sm text-mist-600"
                  key={category.category}
                >
                  <div className="ui-icon-badge h-8 w-8 rounded-xl">
                    <CategoryIcon category={category.category} className="h-4 w-4" />
                  </div>
                  <span>
                    {CATEGORY_LABELS[category.category]} / {category.done}/{category.total} completado
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

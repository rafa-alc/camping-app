type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    tone === 'danger'
      ? 'bg-rose-600 text-white hover:bg-rose-700'
      : 'bg-pine-600 text-white hover:bg-pine-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface w-full max-w-lg p-6 sm:p-7">
        <h2 className="text-2xl font-semibold tracking-tight text-pine-700">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-mist-600">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-pine-700 transition hover:border-pine-200 hover:bg-pine-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${confirmButtonClass}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

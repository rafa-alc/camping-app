type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  errorMessage?: string | null;
  isWorking?: boolean;
  secondaryAction?: {
    label: string;
    tone?: 'primary' | 'secondary' | 'ghost';
  };
  onConfirm: () => void;
  onCancel: () => void;
  onSecondaryAction?: () => void;
};

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'default',
  errorMessage,
  isWorking = false,
  secondaryAction,
  onConfirm,
  onCancel,
  onSecondaryAction,
}: ConfirmDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass = tone === 'danger' ? 'ui-button-danger' : 'ui-button-primary';
  const secondaryButtonClass =
    secondaryAction?.tone === 'primary'
      ? 'ui-button-primary'
      : secondaryAction?.tone === 'ghost'
        ? 'ui-button-ghost'
        : 'ui-button-secondary';

  return (
    <div className="ui-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-pine-700/35 px-4 py-6 backdrop-blur-sm">
      <div className="panel-surface ui-dialog-panel w-full max-w-lg p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-pine-700 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-mist-600">{description}</p>

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button
            className="ui-button-ghost sm:px-4"
            disabled={isWorking}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          {secondaryAction && (
            <button
              className={secondaryButtonClass}
              disabled={isWorking}
              onClick={onSecondaryAction}
              type="button"
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            className={confirmButtonClass}
            disabled={isWorking}
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

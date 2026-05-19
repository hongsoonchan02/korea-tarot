import { useUiStore } from '../../store/useUiStore';

const TOAST_VARIANTS = {
  info: {
    accent: 'border-primary/30 bg-primary/10 text-primary',
  },
  success: {
    accent: 'border-secondary/30 bg-secondary/10 text-secondary',
  },
  error: {
    accent: 'border-error/30 bg-error/10 text-error',
  },
};

export function Toast() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(100%,24rem)] flex-col gap-3">
      {toasts.map((toast) => {
        const variant = TOAST_VARIANTS[toast.type] ?? TOAST_VARIANTS.info;

        return (
          <div
            className="pointer-events-auto glass-panel flex items-start gap-3 px-4 py-4 shadow-glass"
            key={toast.id}
            role="status"
          >
            <span
              className={`inline-flex rounded-full border px-2 py-1 text-label-sm uppercase tracking-[0.18em] ${variant.accent}`}
            >
              {toast.type}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-body-md font-semibold text-on-surface">
                {toast.title}
              </p>
              <p className="text-body-md text-on-surface-variant">
                {toast.message}
              </p>
            </div>
            <button
              aria-label="toast close"
              className="rounded-full border border-white/10 px-2 py-1 text-label-sm uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-primary"
              onClick={() => removeToast(toast.id)}
              type="button"
            >
              Close
            </button>
          </div>
        );
      })}
    </div>
  );
}

import { useUiStore } from '../../store/useUiStore';

export function Modal() {
  const modal = useUiStore((state) => state.modal);
  const closeModal = useUiStore((state) => state.closeModal);

  if (!modal.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-lowest/80 px-margin-mobile backdrop-blur-sm">
      <div
        aria-labelledby="global-modal-title"
        aria-modal="true"
        className="glass-panel w-full max-w-lg px-6 py-6 shadow-glass md:px-8 md:py-8"
        role="dialog"
      >
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit rounded-full border border-error/30 bg-error/10 px-3 py-1 text-label-sm uppercase tracking-[0.18em] text-error">
            System Notice
          </span>
          <div className="space-y-3">
            <h2
              className="text-headline-md font-semibold text-on-surface"
              id="global-modal-title"
            >
              {modal.title}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {modal.message}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-full bg-primary px-5 py-2 text-label-sm uppercase tracking-[0.18em] text-on-primary transition-colors hover:bg-primary-container"
              onClick={closeModal}
              type="button"
            >
              {modal.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

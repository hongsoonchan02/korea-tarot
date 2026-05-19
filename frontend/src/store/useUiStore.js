import { create } from 'zustand';

const DEFAULT_MODAL = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
};

const toastTimers = new Map();

function clearToastTimer(toastId) {
  const timeoutId = toastTimers.get(toastId);

  if (timeoutId) {
    window.clearTimeout(timeoutId);
    toastTimers.delete(toastId);
  }
}

export const useUiStore = create((set) => ({
  modal: DEFAULT_MODAL,
  toasts: [],
  openModal: ({
    title,
    message,
    confirmLabel = DEFAULT_MODAL.confirmLabel,
  }) =>
    set({
      modal: {
        isOpen: true,
        title,
        message,
        confirmLabel,
      },
    }),
  closeModal: () =>
    set({
      modal: DEFAULT_MODAL,
    }),
  pushToast: ({
    type = 'info',
    title,
    message,
    duration = 4000,
  }) => {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: toastId,
          type,
          title,
          message,
          duration,
        },
      ],
    }));

    if (typeof window !== 'undefined' && duration > 0) {
      const timeoutId = window.setTimeout(() => {
        clearToastTimer(toastId);
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== toastId),
        }));
      }, duration);

      toastTimers.set(toastId, timeoutId);
    }

    return toastId;
  },
  removeToast: (toastId) => {
    if (typeof window !== 'undefined') {
      clearToastTimer(toastId);
    }

    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }));
  },
}));

import { create } from 'zustand';

const DEFAULT_MODAL = {
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
};

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
      window.setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== toastId),
        }));
      }, duration);
    }

    return toastId;
  },
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
}));

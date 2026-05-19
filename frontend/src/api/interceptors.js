import {
  API_ERROR_CODES,
  apiClient,
  normalizeApiError,
} from './client';
import { useUiStore } from '../store/useUiStore';

const INTERCEPTOR_FLAG = Symbol.for('mystic-ai-tarot.interceptors');
const NORMALIZED_ERROR_FLAG = Symbol.for('mystic-ai-tarot.normalized-error');

function getErrorPresentation(normalizedError) {
  if (
    normalizedError.isTimeout ||
    normalizedError.isNetworkError ||
    normalizedError.status >= 500
  ) {
    return {
      kind: 'modal',
      title: 'Server Connection Issue',
      message: normalizedError.message,
    };
  }

  if (normalizedError.status >= 400) {
    return {
      kind: 'toast',
      title: 'Request Failed',
      message: normalizedError.message,
      type: 'error',
    };
  }

  return {
    kind: 'toast',
    title: 'Unexpected Error',
    message: normalizedError.message,
    type: 'error',
  };
}

export function registerApiInterceptors(client = apiClient) {
  if (client[INTERCEPTOR_FLAG]) {
    return client[INTERCEPTOR_FLAG];
  }

  const responseErrorInterceptorId = client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalizedError = normalizeApiError(error);
      const originalError = normalizedError.originalError ?? error;
      const uiStore = useUiStore.getState();
      const presentation = getErrorPresentation(normalizedError);

      if (presentation.kind === 'modal') {
        uiStore.openModal({
          title: presentation.title,
          message: presentation.message,
          confirmLabel:
            normalizedError.code === API_ERROR_CODES.TIMEOUT
              ? 'Retry'
              : 'Confirm',
        });
      } else {
        uiStore.pushToast({
          type: presentation.type,
          title: presentation.title,
          message: presentation.message,
        });
      }

      if (originalError && typeof originalError === 'object') {
        originalError[NORMALIZED_ERROR_FLAG] = normalizedError;
      }

      return Promise.reject(originalError);
    },
  );

  const controller = {
    eject() {
      client.interceptors.response.eject(responseErrorInterceptorId);
      delete client[INTERCEPTOR_FLAG];
    },
  };

  client[INTERCEPTOR_FLAG] = controller;

  return controller;
}

export function getNormalizedApiError(error) {
  if (
    error &&
    typeof error === 'object' &&
    NORMALIZED_ERROR_FLAG in error
  ) {
    return error[NORMALIZED_ERROR_FLAG];
  }

  return normalizeApiError(error);
}

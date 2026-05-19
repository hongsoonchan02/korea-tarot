import axios from 'axios';

export const API_TIMEOUT_MS = 15000;

export const API_ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'REQUEST_TIMEOUT',
  UNKNOWN: 'UNKNOWN_ERROR',
};

function createDefaultHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export function normalizeApiError(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return {
        code: API_ERROR_CODES.TIMEOUT,
        message: 'Request timed out.',
        status: null,
        isTimeout: true,
        isNetworkError: false,
        originalError: error,
      };
    }

    if (!error.response) {
      return {
        code: API_ERROR_CODES.NETWORK,
        message: 'Check your network connection.',
        status: null,
        isTimeout: false,
        isNetworkError: true,
        originalError: error,
      };
    }

    return {
      code: error.code || API_ERROR_CODES.UNKNOWN,
      message:
        error.response.data?.message ||
        error.message ||
        'Request failed.',
      status: error.response.status,
      isTimeout: false,
      isNetworkError: false,
      originalError: error,
    };
  }

  return {
    code: API_ERROR_CODES.UNKNOWN,
    message: error instanceof Error ? error.message : 'Unknown error.',
    status: null,
    isTimeout: false,
    isNetworkError: false,
    originalError: error,
  };
}

export function createApiClient(config = {}) {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: API_TIMEOUT_MS,
    headers: createDefaultHeaders(),
    ...config,
  });

  client.defaults.withCredentials = config.withCredentials ?? true;

  return client;
}

export const apiClient = createApiClient();

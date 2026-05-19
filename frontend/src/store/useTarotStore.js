import { create } from 'zustand';

const TAROT_SESSION_STORAGE_KEY = 'mystic-ai-tarot-session';
const MAX_SELECTED_CARDS = 3;

function createInitialState() {
  if (typeof window === 'undefined') {
    return {
      userContent: '',
      selectedCardIds: [],
      currentStep: 'INPUT',
    };
  }

  const savedSession = window.localStorage.getItem(TAROT_SESSION_STORAGE_KEY);

  if (!savedSession) {
    return {
      userContent: '',
      selectedCardIds: [],
      currentStep: 'INPUT',
    };
  }

  try {
    const parsedSession = JSON.parse(savedSession);

    return {
      userContent: parsedSession.userContent ?? '',
      selectedCardIds: Array.isArray(parsedSession.selectedCardIds)
        ? parsedSession.selectedCardIds.slice(0, MAX_SELECTED_CARDS)
        : [],
      currentStep: parsedSession.currentStep ?? 'INPUT',
    };
  } catch {
    return {
      userContent: '',
      selectedCardIds: [],
      currentStep: 'INPUT',
    };
  }
}

function persistSession(state) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    TAROT_SESSION_STORAGE_KEY,
    JSON.stringify({
      userContent: state.userContent,
      selectedCardIds: state.selectedCardIds,
      currentStep: state.currentStep,
    }),
  );
}

const initialState = createInitialState();

export const useTarotStore = create((set) => ({
  ...initialState,
  setUserContent: (userContent) =>
    set((state) => {
      const nextState = { ...state, userContent };
      persistSession(nextState);
      return nextState;
    }),
  setCurrentStep: (currentStep) =>
    set((state) => {
      const nextState = { ...state, currentStep };
      persistSession(nextState);
      return nextState;
    }),
  setSelectedCardIds: (selectedCardIds) =>
    set((state) => {
      const nextState = {
        ...state,
        selectedCardIds: selectedCardIds.slice(0, MAX_SELECTED_CARDS),
      };
      persistSession(nextState);
      return nextState;
    }),
  resetSession: () =>
    set(() => {
      const nextState = {
        userContent: '',
        selectedCardIds: [],
        currentStep: 'INPUT',
      };
      persistSession(nextState);
      return nextState;
    }),
}));

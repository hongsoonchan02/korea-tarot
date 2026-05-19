import { useMemo, useState } from 'react';
import {
  TAROT_CONTENT_MAX_LENGTH,
  TAROT_CONTENT_MIN_LENGTH,
  containsPromptInjection,
  getTrimmedContentLength,
  tarotContentSchema,
} from '../utils/validationSchema';

function readInputValue(nextInput) {
  if (typeof nextInput === 'string') {
    return nextInput;
  }

  if (nextInput && typeof nextInput === 'object' && 'target' in nextInput) {
    return nextInput.target?.value ?? '';
  }

  return '';
}

export function useTarotInput(initialValue = '') {
  const [userContent, setUserContent] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const validationResult = useMemo(
    () => tarotContentSchema.safeParse(userContent),
    [userContent],
  );

  const characterCount = userContent.length;
  const trimmedCharacterCount = getTrimmedContentLength(userContent);
  const hasWhitespaceOnly = userContent.trim().length === 0 && userContent.length > 0;
  const hasPromptInjection = containsPromptInjection(userContent);
  const isValid = validationResult.success;
  const errorMessage = isTouched && !validationResult.success
    ? validationResult.error.issues[0]?.message ?? null
    : null;

  function handleChange(nextInput) {
    setUserContent(readInputValue(nextInput));
    setIsTouched(true);
  }

  function handleBlur() {
    setIsTouched(true);
  }

  function reset(nextValue = '') {
    setUserContent(nextValue);
    setIsTouched(false);
  }

  function validate(value = userContent) {
    return tarotContentSchema.safeParse(value);
  }

  return {
    userContent,
    setUserContent,
    handleChange,
    handleBlur,
    reset,
    validate,
    isTouched,
    isValid,
    errorMessage,
    characterCount,
    trimmedCharacterCount,
    hasWhitespaceOnly,
    hasPromptInjection,
    minLength: TAROT_CONTENT_MIN_LENGTH,
    maxLength: TAROT_CONTENT_MAX_LENGTH,
  };
}

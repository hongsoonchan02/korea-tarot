import { z } from 'zod';

export const TAROT_CONTENT_MIN_LENGTH = 10;
export const TAROT_CONTENT_MAX_LENGTH = 500;
export const TAROT_SELECTED_CARD_COUNT = 3;

const NON_WHITESPACE_REGEX = /\S/u;

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/iu,
  /disregard\s+(all\s+)?previous\s+instructions/iu,
  /system\s+prompt/iu,
  /developer\s+message/iu,
  /reveal\s+(your|the)\s+instructions/iu,
  /show\s+(your|the)\s+prompt/iu,
  /act\s+as\s+(?:the\s+)?system/iu,
  /bypass\s+(?:the\s+)?safety/iu,
  /jailbreak/iu,
];

export function containsPromptInjection(value) {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

export function getTrimmedContentLength(value) {
  return value.replace(/\s/gu, '').length;
}

export const tarotContentSchema = z
  .string()
  .min(TAROT_CONTENT_MIN_LENGTH, {
    message: `Concern must be at least ${TAROT_CONTENT_MIN_LENGTH} characters long.`,
  })
  .max(TAROT_CONTENT_MAX_LENGTH, {
    message: `Concern must be ${TAROT_CONTENT_MAX_LENGTH} characters or fewer.`,
  })
  .refine((value) => NON_WHITESPACE_REGEX.test(value), {
    message: 'Concern cannot be made of whitespace only.',
  })
  .refine(
    (value) => getTrimmedContentLength(value) >= TAROT_CONTENT_MIN_LENGTH,
    {
      message: `Concern must include at least ${TAROT_CONTENT_MIN_LENGTH} non-whitespace characters.`,
    },
  )
  .refine((value) => !containsPromptInjection(value), {
    message: 'Concern contains blocked prompt-injection language.',
  });

export const selectedCardIdsSchema = z
  .array(z.number().int().nonnegative())
  .max(TAROT_SELECTED_CARD_COUNT, {
    message: `You can select up to ${TAROT_SELECTED_CARD_COUNT} cards.`,
  })
  .refine((value) => new Set(value).size === value.length, {
    message: 'Duplicate card selections are not allowed.',
  });

export const tarotInputSchema = z.object({
  userContent: tarotContentSchema,
  selectedCardIds: selectedCardIdsSchema.optional(),
});

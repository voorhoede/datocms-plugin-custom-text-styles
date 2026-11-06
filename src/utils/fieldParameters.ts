export type FieldParameters = {
  allowedStyles: string[];
  allowedMarks: string[];
};

/**
 * Returns null when the field addon has been attached but not yet configured
 * (empty params object), signalling the caller to fall back to "all allowed".
 */
export function getFieldParameters(
  params: Record<string, unknown>,
): FieldParameters | null {
  if (Object.keys(params).length === 0) {
    return null;
  }
  return {
    allowedStyles: Array.isArray(params.allowedStyles)
      ? (params.allowedStyles as string[])
      : [],
    allowedMarks: Array.isArray(params.allowedMarks)
      ? (params.allowedMarks as string[])
      : [],
  };
}

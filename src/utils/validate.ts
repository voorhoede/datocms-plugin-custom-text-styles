import parse from "style-to-js";

export type ValidationResult = {
  error?: string;
};

export const validateSlugUniqueness = (
  slug: string,
  currentIndex: number,
  allStyles: (CustomStyle | CustomMark)[],
): ValidationResult => {
  const trimmedSlug = slug.trim();
  if (!trimmedSlug) {
    return { error: "Slug cannot be empty" };
  }

  const duplicateStyle = allStyles.find(
    ({ slug }, index) => index !== currentIndex && slug.trim() === trimmedSlug,
  );
  if (duplicateStyle) {
    return { error: `Slug "${trimmedSlug}" is already used.` };
  }
  return { error: undefined };
};

export const validateTitleUniqueness = (
  title: string,
  currentIndex: number,
  allStyles: (CustomStyle | CustomMark)[],
): ValidationResult => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { error: "Title cannot be empty" };
  }

  const duplicateStyle = allStyles.find(
    ({ title }, index) =>
      index !== currentIndex && title.trim() === trimmedTitle,
  );
  if (duplicateStyle) {
    return { error: `Title "${trimmedTitle}" is already used.` };
  }
  return { error: undefined };
};

export const validateKeyboardShortcutUniqueness = (
  keyboardShortcut: string,
  currentIndex: number,
  allMarks: CustomMark[],
): ValidationResult => {
  const trimmedKeyboardShortcut = keyboardShortcut.trim();
  if (!trimmedKeyboardShortcut) {
    return { error: "Keyboard shortcut cannot be empty" };
  }

  const duplicateMark = allMarks.find(
    ({ keyboardShortcut }, index) =>
      index !== currentIndex &&
      keyboardShortcut.trim() === trimmedKeyboardShortcut,
  );
  if (duplicateMark) {
    return {
      error: `Keyboard shortcut "${trimmedKeyboardShortcut}" is already used.`,
    };
  }
  return { error: undefined };
};

// TODO: add function to select with structured text fields you can apply which custom styles to
/*
 * Handler for saving all custom styles.
 * Saved custom styles can be used in all structured text fields.
 */
const validateCss = (style: CustomStyle | CustomMark) => {
  try {
    parse(style.css);
  } catch (error) {
    throw new Error(`Invalid CSS in "${style.title}": ${error}`);
  }
};

const validateSlug = (
  style: CustomStyle | CustomMark,
  index: number,
  customStyles: (CustomStyle | CustomMark)[],
) => {
  const slugValidation = validateSlugUniqueness(
    style.slug,
    index,
    customStyles,
  );
  if (slugValidation.error) {
    throw new Error(slugValidation.error);
  }
};

const validateTitle = (
  style: CustomStyle | CustomMark,
  index: number,
  customStyles: (CustomStyle | CustomMark)[],
) => {
  const titleValidation = validateTitleUniqueness(
    style.title,
    index,
    customStyles,
  );
  if (titleValidation.error) {
    throw new Error(titleValidation.error);
  }
};

export const validateFields = (customStyles: (CustomStyle | CustomMark)[]) => {
  customStyles.forEach((style, index) => {
    validateSlug(style, index, customStyles);
    validateTitle(style, index, customStyles);
  });
};

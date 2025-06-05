import parse from "style-to-js";

export type ValidationResult = {
  error?: string;
};

export const validateSlugUniqueness = (
  slug: string,
  currentCreatedAt: string,
  allStyles: CustomStyle[],
): ValidationResult => {
  const trimmedSlug = slug.trim();
  if (!trimmedSlug) {
    return { error: "Slug cannot be empty" };
  }

  const duplicateStyle = allStyles.find(
    ({ createdAt, slug }) => createdAt !== currentCreatedAt && slug.trim() === trimmedSlug
  );
  if (duplicateStyle) {
    return { error: `Slug "${trimmedSlug}" is already used.` };
  }
  return { error: undefined };
};

export const validateTitleUniqueness = (
  title: string,
  currentCreatedAt: string,
  allStyles: CustomStyle[]
): ValidationResult => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { error: "Title cannot be empty" };
  }

  const duplicateStyle = allStyles.find(
    ({ createdAt, title }) => createdAt !== currentCreatedAt && title.trim() === trimmedTitle
  );
  if (duplicateStyle) {
    return { error: `Title "${trimmedTitle}" is already used.` };
  }
  return { error: undefined };
};

// TODO: add function to select with structured text fields you can apply which custom styles to
/*
 * Handler for saving all custom styles.
 * Saved custom styles can be used in all structured text fields.
 */
const validateCss = (style: CustomStyle) => {
  try {
    parse(style.css);
  } catch (error) {
    throw new Error(`Invalid CSS in "${style.title}": ${error}`);
  }
};

const validateSlug = (style: CustomStyle, customStyles: CustomStyle[]) => {
  const slugValidation = validateSlugUniqueness(style.slug, style.createdAt, customStyles);
  if (slugValidation.error) {
    throw new Error(slugValidation.error);
  }
};

const validateTitle = (style: CustomStyle, customStyles: CustomStyle[]) => {
  const titleValidation = validateTitleUniqueness(style.title, style.createdAt, customStyles);
  if (titleValidation.error) {
    throw new Error(titleValidation.error);
  }
};

export const validateFields = (customStyles: CustomStyle[]) => {
  for (const style of customStyles) {
    validateCss(style);
    validateSlug(style, customStyles);
    validateTitle(style, customStyles);
  }
};
